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
 * SecretBid common types and abstractions.
 *
 * @module
 */

import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { SecretBidPrivateState, Contract, Witnesses } from '../../contract/src/index';

export const secretBidPrivateStateKey = 'secretBidPrivateState';
export type PrivateStateId = typeof secretBidPrivateStateKey;

/**
 * The private states consumed throughout the application.
 *
 * @remarks
 * {@link PrivateStates} can be thought of as a type that describes a schema for all
 * private states for all contracts used in the application. Each key represents
 * the type of private state consumed by a particular type of contract.
 * The key is used by the deployed contract when interacting with a private state provider,
 * and the type (i.e., `typeof PrivateStates[K]`) represents the type of private state
 * expected to be returned.
 *
 * Since there is only one contract type for the secret bid example, we only define a
 * single key/type in the schema.
 *
 * @public
 */
export type PrivateStates = {
  /**
   * Key used to provide the private state for {@link SecretBidContract} deployments.
   */
  readonly secretBidPrivateState: SecretBidPrivateState;
};

/**
 * Represents a secret bid contract and its private state.
 *
 * @public
 */
export type SecretBidContract = Contract<SecretBidPrivateState, Witnesses<SecretBidPrivateState>>;

/**
 * The keys of the circuits exported from {@link SecretBidContract}.
 *
 * @public
 */
export type SecretBidCircuitKeys = Exclude<keyof SecretBidContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link SecretBidContract}.
 *
 * @public
 */
export type SecretBidProviders = MidnightProviders<SecretBidCircuitKeys, PrivateStateId, SecretBidPrivateState>;

/**
 * A {@link SecretBidContract} that has been deployed to the network.
 *
 * @public
 */
export type DeployedSecretBidContract = FoundContract<SecretBidContract>;

/**
 * Hex-encoded identifier for a single auction hosted on a {@link SecretBidContract} deployment.
 *
 * @remarks
 * One deployed contract is an "auction house" that can host many auctions; `AuctionId` is what
 * distinguishes one auction's ledger records (in `auctions`, `commitments`, `revealedBids`) from
 * another's. It is NOT the contract address — see {@link DeployedSecretBidContract} for that.
 */
export type AuctionId = string;

/**
 * The lifecycle phase of a single auction, mirroring the Compact `AuctionPhase` enum.
 */
export type AuctionPhase = 'commit' | 'reveal' | 'closed';

/**
 * A type that represents the derived combination of public (ledger) state and private state for a
 * single auction.
 *
 * @remarks
 * Every field up to and including `winningBid` is derived purely from the public `AuctionRecord`
 * stored on the ledger (see `secretbid.compact`) and is visible to anyone observing the contract.
 * The remaining fields are derived by additionally comparing that public state against the current
 * viewer's own private state (their secret key and any bid secrets they've locally prepared) — they
 * answer "how does this auction relate to me", and are never computed from another bidder's private
 * data, because no other bidder's private data is ever available to this process.
 */
export type AuctionDerivedState = {
  readonly auctionId: AuctionId;
  readonly creator: string;
  readonly title: string;
  readonly description: string;
  readonly reservePrice: bigint | undefined;
  readonly phase: AuctionPhase;
  readonly commitCount: number;
  readonly revealCount: number;
  readonly winner: string | undefined;
  readonly winningBid: bigint | undefined;

  /** `true` if the current viewer's secret key derives this auction's `creator` key. */
  readonly isCreator: boolean;
  /** `true` if the current viewer has an entry in `commitments` for this auction. */
  readonly hasCommitted: boolean;
  /** `true` if the current viewer has an entry in `revealedBids` for this auction. */
  readonly hasRevealed: boolean;
  /** The current viewer's own locally-prepared bid amount for this auction, if any. Never another bidder's. */
  readonly myBidAmount: bigint | undefined;
  /** `true` if the current viewer's derived bidder key matches `winner`. */
  readonly isWinner: boolean;
};

// TODO: for some reason I needed to include "@midnight-ntwrk/wallet-sdk-address-format": "1.0.0-rc.1", should we bump in to rc-2 ?
