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

/*
 * This file defines the shape of SecretBid's private state, as well as the
 * witness functions that access it.
 *
 * There are two witnesses, matching the two kinds of secrets a bidder in a
 * multi-auction SecretBid contract needs to keep local:
 *
 *   - `localSecretKey`   a single global secret key, the root of every
 *                        per-auction pseudonymous identity the contract
 *                        derives via `deriveBidderKey` (see
 *                        secretbid.compact). One key covers every auction
 *                        the wallet ever participates in.
 *
 *   - `localBidSecret`   the real bid amount and salting nonce for one
 *                        specific auction. Scoped by `auctionId` because a
 *                        bidder may be committed to many auctions
 *                        concurrently, each with its own secret bid.
 */

import { BidSecret, Ledger } from "./managed/secretbid/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

/* **********************************************************************
 * SecretBidPrivateState is the private state shared by every SecretBid
 * contract instance a wallet interacts with.
 *
 *   secretKey - the wallet's global secret key.
 *   bids      - a local, off-ledger record of {amount, nonce} per
 *               auctionId (hex-encoded). Populated by the API layer
 *               *before* `commitBid` is called (never by a circuit), and
 *               read back by the `localBidSecret` witness during both
 *               `commitBid` (to compute a commitment) and `revealBid` (to
 *               prove it and disclose the amount). An auctionId with no
 *               entry here means this wallet has not (yet) prepared a bid
 *               for that auction.
 */
export type SecretBidPrivateState = {
  readonly secretKey: Uint8Array;
  readonly bids: Readonly<Record<string, BidSecret>>;
};

export const createSecretBidPrivateState = (
  secretKey: Uint8Array,
): SecretBidPrivateState => ({
  secretKey,
  bids: {},
});

/* **********************************************************************
 * Returns a copy of `privateState` with a bid secret recorded for
 * `auctionId`. This is a plain local write — it does not touch the ledger
 * and is not a witness itself. Callers (the API layer) use this to prepare
 * a bid before calling the `commitBid` circuit, which will read it back via
 * the `localBidSecret` witness below.
 */
export const setLocalBidSecret = (
  privateState: SecretBidPrivateState,
  auctionId: string,
  bidSecret: BidSecret,
): SecretBidPrivateState => ({
  ...privateState,
  bids: { ...privateState.bids, [auctionId]: bidSecret },
});

/* **********************************************************************
 * The witnesses object for the SecretBid contract. Each function's first
 * argument is a WitnessContext<Ledger, SecretBidPrivateState> (fields:
 * ledger, privateState, contractAddress); the return value is a tuple of
 * the (possibly updated) private state and the declared return value.
 *
 * Neither witness below mutates private state — both are pure reads of
 * locally-held secrets — so each returns `privateState` unchanged.
 */
export const witnesses = {
  /** Returns the wallet's global secret key. Ledger/contractAddress unused. */
  localSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, SecretBidPrivateState>): [
    SecretBidPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],

  /**
   * Returns the caller's locally-prepared bid secret for `auctionId`.
   * Throws if no bid has been prepared for that auction yet (i.e. the API
   * layer must call `setLocalBidSecret` before submitting `commitBid`).
   */
  localBidSecret: (
    { privateState }: WitnessContext<Ledger, SecretBidPrivateState>,
    auctionId: Uint8Array,
  ): [SecretBidPrivateState, BidSecret] => {
    const key = Buffer.from(auctionId).toString("hex");
    const bidSecret = privateState.bids[key];
    if (bidSecret === undefined) {
      throw new Error(`No local bid secret prepared for auction ${key}`);
    }
    return [privateState, bidSecret];
  },
};
