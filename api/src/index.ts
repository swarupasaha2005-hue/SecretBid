// This file is part of midnightntwrk/example-secretbid.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Provides types and utilities for working with SecretBid contracts.
 *
 * @remarks
 * Architecture: React -> {@link SecretBidAPI} -> Midnight SDK -> `secretbid.compact`. One deployed
 * `secretbid.compact` contract is an auction house hosting many auctions; this file is the sole API
 * surface between the frontend and that contract. There is no separate factory/registry API — every
 * method below maps 1:1 onto a circuit or a ledger read defined in `secretbid.compact`.
 *
 * @packageDocumentation
 */

import * as SecretBid from '../../contract/src/managed/secretbid/contract/index.js';

import { type ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { type Logger } from 'pino';
import {
  type AuctionDerivedState,
  type AuctionId,
  type AuctionPhase,
  type SecretBidContract,
  type SecretBidProviders,
  type DeployedSecretBidContract,
  secretBidPrivateStateKey,
} from './common-types.js';
import { CompiledSecretBidContractContract } from '../../contract/src/index';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from, type Observable } from 'rxjs';
import { toHex, fromHex } from '@midnight-ntwrk/midnight-js-utils';
import { SecretBidPrivateState, createSecretBidPrivateState, setLocalBidSecret } from '../../contract/src/witnesses.js';

/** @internal */

/**
 * An API for a deployed SecretBid contract hosting many auctions.
 *
 * @remarks
 * Every method here is a thin wire-up to one circuit in `secretbid.compact` (or, for
 * `getAuction`/`getWinner`, a plain off-chain read of already-public ledger data — Midnight ledger
 * state does not require a transaction to read). All five auction circuits — `createAuction`,
 * `commitBid`, `startReveal`, `revealBid`, `closeAuction` — are production-complete: each fully
 * validates its input and mutates the ledger via its underlying circuit.
 */
export interface DeployedSecretBidAPI {
  readonly deployedContractAddress: ContractAddress;

  /** Every auction known to this contract, keyed by {@link AuctionId}, kept live as the ledger changes. */
  readonly auctions$: Observable<ReadonlyMap<AuctionId, AuctionDerivedState>>;

  createAuction(params: { title: string; description: string; reservePrice?: bigint }): Promise<AuctionId>;
  commitBid(auctionId: AuctionId, amount: bigint): Promise<void>;
  startReveal(auctionId: AuctionId): Promise<void>;
  revealBid(auctionId: AuctionId): Promise<void>;
  closeAuction(auctionId: AuctionId): Promise<void>;

  /** Reads the latest known state of one auction. Does not submit a transaction. */
  getAuction(auctionId: AuctionId): AuctionDerivedState | undefined;
  /** Reads the latest known winner of one auction, if determined. Does not submit a transaction. */
  getWinner(auctionId: AuctionId): { winner: string; winningBid: bigint } | undefined;
}

/**
 * Provides an implementation of {@link DeployedSecretBidAPI} by adapting a deployed SecretBid
 * contract.
 *
 * @remarks
 * The `SecretBidPrivateState` is managed at the DApp level by a private state provider. As such, this
 * private state is shared between all instances of {@link SecretBidAPI}, and their underlying deployed
 * contracts. The private state defines a `'secretKey'` property that identifies the current user across
 * every auction (via `deriveBidderKey`), and a `'bids'` property holding locally-prepared bid secrets
 * per auction (see `contract/src/witnesses.ts`).
 *
 * In the future, Midnight.js will provide a private state provider that supports private state storage
 * keyed by contract address. This will remove the current workaround of sharing private state across
 * the deployed SecretBid contracts.
 */
// TODO: Update SecretBidAPI to use contract level private state storage.
export class SecretBidAPI implements DeployedSecretBidAPI {
  /** @internal */
  #latestAuctions: ReadonlyMap<AuctionId, AuctionDerivedState> = new Map();

  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedSecretBidContract,
    private readonly providers: SecretBidProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.deployedContractAddress);
    this.auctions$ = combineLatest(
      [
        // Combine public (ledger) state with...
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => SecretBid.ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                auctionCount: ledgerState.auctionCount,
              },
            }),
          ),
        ),
        // ...private state...
        //    since the private state's secret key never changes, we can query the private state once
        //    and always use the same value with `combineLatest`. If private state gains fields that
        //    change independently of the secret key, this would need to become a genuine `Observable`.
        from(providers.privateStateProvider.get(secretBidPrivateStateKey) as Promise<SecretBidPrivateState>),
      ],
      // ...and combine them to produce the required derived state for every known auction.
      (ledgerState, privateState) => deriveAllAuctions(ledgerState, privateState),
    );
    this.auctions$.subscribe((auctions) => {
      this.#latestAuctions = auctions;
    });
  }

  readonly deployedContractAddress: ContractAddress;
  readonly auctions$: Observable<ReadonlyMap<AuctionId, AuctionDerivedState>>;

  /**
   * Creates a new auction on this SecretBid contract.
   *
   * @param params.title The auction's public title. Must not be empty — the underlying circuit
   * rejects an empty title, so a failed proof/transaction is the observable failure mode.
   * @param params.description The auction's public description.
   * @param params.reservePrice An optional minimum winning bid. Omit for no reserve.
   * @returns The newly created auction's {@link AuctionId}.
   *
   * @remarks
   * Wires up to the production `createAuction` circuit in `secretbid.compact`, which validates the
   * title, derives a unique `auctionId`, derives the caller's identity via
   * `deriveBidderKey(secretKey, auctionId)` — the sole identity model used throughout this project —
   * and inserts a complete `AuctionRecord` (phase `COMMIT`, zeroed counts, no winner) into the
   * ledger. The returned `auctionId` is read directly off the circuit's return value, carried back on
   * the call-transaction result (`txData.private.result`).
   */
  async createAuction(params: { title: string; description: string; reservePrice?: bigint }): Promise<AuctionId> {
    this.logger?.info({ creatingAuction: params });

    const reservePrice =
      params.reservePrice === undefined ? { is_some: false, value: 0n } : { is_some: true, value: params.reservePrice };

    const txData = await this.deployedContract.callTx.createAuction(params.title, params.description, reservePrice);

    this.logger?.trace({
      transactionAdded: {
        circuit: 'createAuction',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });

    return toHex(txData.private.result);
  }

  /**
   * Commits a sealed bid to an auction.
   *
   * @param auctionId The auction to bid on.
   * @param amount The bid amount. Never sent to the ledger — only a commitment hash is.
   *
   * @remarks
   * The caller supplies only `auctionId` and `amount`; the nonce is generated automatically here via
   * `utils.randomBytes(32)` (backed by `crypto.getRandomValues`). Both `amount` and the generated
   * `nonce` are written to local private state (via `setLocalBidSecret`) *before* the `commitBid`
   * circuit is called, so the circuit's `localBidSecret` witness can read them back locally — they are
   * never passed as transaction arguments and never appear on the ledger. Wires up to the production
   * `commitBid` circuit in `secretbid.compact`, which validates the auction exists and is in the
   * COMMIT phase, rejects a duplicate commit, and stores only the resulting commitment hash.
   */
  async commitBid(auctionId: AuctionId, amount: bigint): Promise<void> {
    this.logger?.info({ committingBid: { auctionId } });

    const nonce = utils.randomBytes(32);
    const privateState = (await this.providers.privateStateProvider.get(
      secretBidPrivateStateKey,
    )) as SecretBidPrivateState;
    await this.providers.privateStateProvider.set(
      secretBidPrivateStateKey,
      setLocalBidSecret(privateState, auctionId, { amount, nonce }),
    );

    const txData = await this.deployedContract.callTx.commitBid(fromHex(auctionId));

    this.logger?.trace({
      transactionAdded: { circuit: 'commitBid', txHash: txData.public.txHash, blockHeight: txData.public.blockHeight },
    });
  }

  /**
   * Transitions an auction from the COMMIT phase to the REVEAL phase.
   *
   * @param auctionId The auction to transition.
   *
   * @remarks
   * Wires up to the production `startReveal` circuit in `secretbid.compact`, which verifies the
   * auction exists, that the caller is the auction's creator (identified via
   * `deriveBidderKey(secretKey, auctionId)`), and that the auction is currently in the COMMIT phase,
   * before flipping its phase to REVEAL. This circuit performs no other logic — no commitments,
   * reveals, or winner-selection are touched.
   */
  async startReveal(auctionId: AuctionId): Promise<void> {
    this.logger?.info({ startingReveal: { auctionId } });

    const txData = await this.deployedContract.callTx.startReveal(fromHex(auctionId));

    this.logger?.trace({
      transactionAdded: {
        circuit: 'startReveal',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Reveals a previously committed bid.
   *
   * @param auctionId The auction to reveal a bid for.
   *
   * @remarks
   * No bid data is passed in — the amount and nonce are retrieved automatically from
   * `SecretBidPrivateState` (the same `{ amount, nonce }` recorded by an earlier `commitBid` call) and
   * read by the circuit via the `localBidSecret` witness. Wires up to the production `revealBid`
   * circuit in `secretbid.compact`, which verifies the commitment, discloses the amount into
   * `revealedBids`, and updates the auction's running `winner`/`winningBid` if this bid qualifies. The
   * nonce is never disclosed and never appears on the ledger.
   */
  async revealBid(auctionId: AuctionId): Promise<void> {
    this.logger?.info({ revealingBid: { auctionId } });

    const txData = await this.deployedContract.callTx.revealBid(fromHex(auctionId));

    this.logger?.trace({
      transactionAdded: { circuit: 'revealBid', txHash: txData.public.txHash, blockHeight: txData.public.blockHeight },
    });
  }

  /**
   * Finalizes an auction, locking it against any further reveals.
   *
   * @param auctionId The auction to close.
   *
   * @remarks
   * Wires up to the production `closeAuction` circuit in `secretbid.compact`, which verifies the
   * auction exists, that the caller is the auction's creator (identified via
   * `deriveBidderKey(secretKey, auctionId)`), that the auction is currently in the REVEAL phase, and
   * that every commitment has been accounted for (`revealCount == commitCount`) before flipping the
   * phase to CLOSED. This circuit never recomputes the winner — `winner`/`winningBid` were already
   * finalized incrementally by `revealBid` and are carried over unchanged.
   */
  async closeAuction(auctionId: AuctionId): Promise<void> {
    this.logger?.info({ closingAuction: { auctionId } });

    const txData = await this.deployedContract.callTx.closeAuction(fromHex(auctionId));

    this.logger?.trace({
      transactionAdded: {
        circuit: 'closeAuction',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  getAuction(auctionId: AuctionId): AuctionDerivedState | undefined {
    return this.#latestAuctions.get(auctionId);
  }

  getWinner(auctionId: AuctionId): { winner: string; winningBid: bigint } | undefined {
    const auction = this.#latestAuctions.get(auctionId);
    if (!auction || auction.winner === undefined || auction.winningBid === undefined) {
      return undefined;
    }
    return { winner: auction.winner, winningBid: auction.winningBid };
  }

  /**
   * Deploys a new SecretBid contract (a fresh, empty auction house) to the network.
   *
   * @param providers The SecretBid providers.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link SecretBidAPI} instance that manages the newly deployed
   * {@link DeployedSecretBidContract}; or rejects with a deployment error.
   */
  static async deploy(providers: SecretBidProviders, logger?: Logger): Promise<SecretBidAPI> {
    logger?.info('deployContract');

    const deployedSecretBidContract = await deployContract(providers, {
      compiledContract: CompiledSecretBidContractContract,
      privateStateId: secretBidPrivateStateKey,
      initialPrivateState: createSecretBidPrivateState(utils.randomBytes(32)),
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedSecretBidContract.deployTxData.public,
      },
    });

    return new SecretBidAPI(deployedSecretBidContract, providers, logger);
  }

  /**
   * Finds an already deployed SecretBid contract (an existing auction house) on the network, and joins it.
   *
   * @param providers The SecretBid providers.
   * @param contractAddress The contract address of the deployed SecretBid contract to search for and join.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link SecretBidAPI} instance that manages the joined
   * {@link DeployedSecretBidContract}; or rejects with an error.
   */
  static async join(
    providers: SecretBidProviders,
    contractAddress: ContractAddress,
    logger?: Logger,
  ): Promise<SecretBidAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedSecretBidContract = await findDeployedContract<SecretBidContract>(providers, {
      contractAddress,
      compiledContract: CompiledSecretBidContractContract,
      privateStateId: secretBidPrivateStateKey,
      initialPrivateState: await SecretBidAPI.getPrivateState(providers, contractAddress),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedSecretBidContract.deployTxData.public,
      },
    });

    return new SecretBidAPI(deployedSecretBidContract, providers, logger);
  }

  private static async getPrivateState(
    providers: SecretBidProviders,
    contractAddress: ContractAddress,
  ): Promise<SecretBidPrivateState> {
    providers.privateStateProvider.setContractAddress(contractAddress);
    const existingPrivateState = await providers.privateStateProvider.get(secretBidPrivateStateKey);
    return existingPrivateState ?? createSecretBidPrivateState(utils.randomBytes(32));
  }
}

/**
 * Maps the raw `AuctionPhase` enum from the compiled contract onto the API's string-union
 * {@link AuctionPhase} type.
 *
 * @internal
 */
const phaseToString = (phase: SecretBid.AuctionPhase): AuctionPhase => {
  switch (phase) {
    case SecretBid.AuctionPhase.COMMIT:
      return 'commit';
    case SecretBid.AuctionPhase.REVEAL:
      return 'reveal';
    case SecretBid.AuctionPhase.CLOSED:
      return 'closed';
  }
};

/**
 * Derives an {@link AuctionDerivedState} for every auction currently on the ledger, combining each
 * auction's public `AuctionRecord` with the current viewer's private state. Viewer-relative fields
 * (`isCreator`, `hasCommitted`, etc.) are computed purely from the viewer's own secret key and locally
 * prepared bid secrets — never from another bidder's private data, which this process never has access to.
 *
 * @internal
 */
const deriveAllAuctions = (
  ledgerState: SecretBid.Ledger,
  privateState: SecretBidPrivateState,
): ReadonlyMap<AuctionId, AuctionDerivedState> => {
  const auctions = new Map<AuctionId, AuctionDerivedState>();

  for (const [auctionIdBytes, record] of ledgerState.auctions) {
    const auctionId = toHex(auctionIdBytes);
    const bidderKey = SecretBid.pureCircuits.deriveBidderKey(privateState.secretKey, auctionIdBytes);
    const recordKey = SecretBid.pureCircuits.deriveRecordKey(auctionIdBytes, bidderKey);

    const winnerHex = record.winner.is_some ? toHex(record.winner.value) : undefined;
    const myBidSecret = privateState.bids[auctionId];

    auctions.set(auctionId, {
      auctionId,
      creator: toHex(record.creator),
      title: record.title,
      description: record.description,
      reservePrice: record.reservePrice.is_some ? record.reservePrice.value : undefined,
      phase: phaseToString(record.phase),
      commitCount: Number(record.commitCount),
      revealCount: Number(record.revealCount),
      winner: winnerHex,
      winningBid: record.winningBid.is_some ? record.winningBid.value : undefined,

      isCreator: toHex(record.creator) === toHex(bidderKey),
      hasCommitted: ledgerState.commitments.member(recordKey),
      hasRevealed: ledgerState.revealedBids.member(recordKey),
      myBidAmount: myBidSecret?.amount,
      isWinner: winnerHex !== undefined && winnerHex === toHex(bidderKey),
    });
  }

  return auctions;
};

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
