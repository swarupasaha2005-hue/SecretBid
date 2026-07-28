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

import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../managed/secretbid/contract/index.js";
import { type SecretBidPrivateState, witnesses } from "../witnesses.js";

/**
 * Serves as a testbed to exercise the SecretBid contract scaffold in tests.
 * Only wraps the placeholder circuits defined so far (createAuction,
 * commitBid, startReveal, revealBid, closeAuction) plus the pure
 * cryptographic helpers; none of them implement real auction logic yet.
 */
export class SecretBidSimulator {
  readonly contract: Contract<SecretBidPrivateState>;
  circuitContext: CircuitContext<SecretBidPrivateState>;

  constructor(secretKey: Uint8Array) {
    this.contract = new Contract<SecretBidPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      createConstructorContext({ secretKey, bids: {} }, "0".repeat(64)),
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  /***
   * Switch to a different secret key for a different user
   */
  public switchUser(secretKey: Uint8Array) {
    this.circuitContext.currentPrivateState = {
      secretKey,
      bids: {},
    };
  }

  /**
   * Records a local bid secret for `auctionId` under the current user,
   * mirroring what the API layer will do before calling `commitBid`.
   */
  public setBidSecret(
    auctionId: Uint8Array,
    amount: bigint,
    nonce: Uint8Array,
  ) {
    const key = Buffer.from(auctionId).toString("hex");
    this.circuitContext.currentPrivateState = {
      ...this.circuitContext.currentPrivateState,
      bids: {
        ...this.circuitContext.currentPrivateState.bids,
        [key]: { amount, nonce },
      },
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): SecretBidPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public createAuction(
    title: string,
    description: string,
    reservePrice: { is_some: boolean; value: bigint },
  ): Uint8Array {
    const result = this.contract.impureCircuits.createAuction(
      this.circuitContext,
      title,
      description,
      reservePrice,
    );
    this.circuitContext = result.context;
    return result.result;
  }

  public commitBid(auctionId: Uint8Array): void {
    this.circuitContext = this.contract.impureCircuits.commitBid(
      this.circuitContext,
      auctionId,
    ).context;
  }

  public startReveal(auctionId: Uint8Array): void {
    this.circuitContext = this.contract.impureCircuits.startReveal(
      this.circuitContext,
      auctionId,
    ).context;
  }

  public revealBid(auctionId: Uint8Array): void {
    this.circuitContext = this.contract.impureCircuits.revealBid(
      this.circuitContext,
      auctionId,
    ).context;
  }

  public closeAuction(auctionId: Uint8Array): void {
    this.circuitContext = this.contract.impureCircuits.closeAuction(
      this.circuitContext,
      auctionId,
    ).context;
  }

  /**
   * Computes the current user's per-auction pseudonymous identity for
   * `auctionId`, via the contract's sole identity derivation helper,
   * `deriveBidderKey`. This is the same derivation the contract itself
   * uses internally to identify callers in every circuit.
   */
  public deriveBidderKey(auctionId: Uint8Array): Uint8Array {
    return this.contract.circuits.deriveBidderKey(
      this.circuitContext,
      this.getPrivateState().secretKey,
      auctionId,
    ).result;
  }
}
