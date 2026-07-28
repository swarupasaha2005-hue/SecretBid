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

import { SecretBidSimulator } from "./secretbid-simulator.js";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { describe, it, expect } from "vitest";
import { randomBytes } from "./utils.js";
import { AuctionPhase } from "../managed/secretbid/contract/index.js";

setNetworkId("undeployed");

const NO_RESERVE = { is_some: false, value: 0n };

describe("SecretBid multi-auction contract scaffold", () => {
  it("starts with an empty ledger", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const ledgerState = simulator.getLedger();
    expect(ledgerState.auctionCount).toEqual(0n);
    expect(ledgerState.auctions.isEmpty()).toEqual(true);
    expect(ledgerState.commitments.isEmpty()).toEqual(true);
    expect(ledgerState.revealedBids.isEmpty()).toEqual(true);
  });

  it("generates initial state deterministically for the same key", () => {
    const key = randomBytes(32);
    const auctionId = randomBytes(32);
    const simulator0 = new SecretBidSimulator(key);
    const simulator1 = new SecretBidSimulator(key);
    expect(simulator0.getLedger().auctionCount).toEqual(
      simulator1.getLedger().auctionCount,
    );
    expect(simulator0.deriveBidderKey(auctionId)).toEqual(
      simulator1.deriveBidderKey(auctionId),
    );
  });

  it("derives a different pseudonymous bidder key per user for the same auction", () => {
    const auctionId = randomBytes(32);
    const simulatorA = new SecretBidSimulator(randomBytes(32));
    const simulatorB = new SecretBidSimulator(randomBytes(32));
    expect(simulatorA.deriveBidderKey(auctionId)).not.toEqual(
      simulatorB.deriveBidderKey(auctionId),
    );
  });

  it("throws from commitBid if no local bid secret has been prepared", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    expect(() => simulator.commitBid(auctionId)).toThrow(
      /No local bid secret prepared/,
    );
  });

  it("lets a caller invoke startReveal, revealBid, and closeAuction against an existing auction", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.setBidSecret(auctionId, 250n, randomBytes(32));
    simulator.commitBid(auctionId);

    // Placeholder wiring: phase transitions and the reveal are recorded, but
    // no authorization, prior-phase, or commitment-verification checks are
    // implemented yet.
    expect(() => simulator.startReveal(auctionId)).not.toThrow();
    expect(() => simulator.revealBid(auctionId)).not.toThrow();
    expect(() => simulator.closeAuction(auctionId)).not.toThrow();

    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.phase).toEqual(AuctionPhase.CLOSED);
    expect(simulator.getLedger().revealedBids.isEmpty()).toEqual(false);
  });
});

describe("createAuction (production circuit)", () => {
  it("successfully creates an auction and returns a 32-byte auctionId", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    expect(auctionId).toBeInstanceOf(Uint8Array);
    expect(auctionId.length).toEqual(32);
  });

  it("produces the correct ledger state after creation", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );

    const ledgerState = simulator.getLedger();
    expect(ledgerState.auctions.isEmpty()).toEqual(false);
    expect(ledgerState.auctions.member(auctionId)).toEqual(true);

    const record = ledgerState.auctions.lookup(auctionId);
    expect(record.auctionId).toEqual(auctionId);
    expect(record.title).toEqual("My auction");
    expect(record.description).toEqual("A description");
  });

  it("initializes phase to COMMIT", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.phase).toEqual(AuctionPhase.COMMIT);
  });

  it("initializes commitCount and revealCount to 0", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.commitCount).toEqual(0n);
    expect(record.revealCount).toEqual(0n);
  });

  it("initializes winner and winningBid to none", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.winner.is_some).toEqual(false);
    expect(record.winningBid.is_some).toEqual(false);
  });

  it("derives the creator's identity via deriveBidderKey(secretKey, auctionId) — the sole identity model", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.creator).toEqual(simulator.deriveBidderKey(auctionId));
  });

  it("stores no reserve price when none is given", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const record = simulator.getLedger().auctions.lookup(auctionId);
    expect(record.reservePrice.is_some).toEqual(false);
  });

  it("stores a reserve price when one is given, including a reserve of 0", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));

    const withReserve = simulator.createAuction(
      "Reserved auction",
      "A description",
      {
        is_some: true,
        value: 500n,
      },
    );
    const reservedRecord = simulator.getLedger().auctions.lookup(withReserve);
    expect(reservedRecord.reservePrice).toEqual({ is_some: true, value: 500n });

    const zeroReserve = simulator.createAuction(
      "Zero reserve auction",
      "A description",
      {
        is_some: true,
        value: 0n,
      },
    );
    const zeroReserveRecord = simulator
      .getLedger()
      .auctions.lookup(zeroReserve);
    expect(zeroReserveRecord.reservePrice).toEqual({
      is_some: true,
      value: 0n,
    });
  });

  it("increments auctionCount by exactly 1 per auction created", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    expect(simulator.getLedger().auctionCount).toEqual(0n);

    simulator.createAuction("First", "A description", NO_RESERVE);
    expect(simulator.getLedger().auctionCount).toEqual(1n);

    simulator.createAuction("Second", "A description", NO_RESERVE);
    expect(simulator.getLedger().auctionCount).toEqual(2n);
  });

  it("supports creating multiple auctions from the same caller, each with a unique auctionId", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));

    const auctionIds = [
      simulator.createAuction("Auction 1", "Description 1", NO_RESERVE),
      simulator.createAuction("Auction 2", "Description 2", NO_RESERVE),
      simulator.createAuction("Auction 3", "Description 3", NO_RESERVE),
    ];

    const uniqueHexIds = new Set(
      auctionIds.map((id) => Buffer.from(id).toString("hex")),
    );
    expect(uniqueHexIds.size).toEqual(3);
    expect(simulator.getLedger().auctionCount).toEqual(3n);

    for (const [index, auctionId] of auctionIds.entries()) {
      const record = simulator.getLedger().auctions.lookup(auctionId);
      expect(record.title).toEqual(`Auction ${index + 1}`);
    }
  });

  it("supports creating auctions from different callers, each with a unique auctionId and correct creator", () => {
    const simulatorA = new SecretBidSimulator(randomBytes(32));
    const auctionIdA = simulatorA.createAuction(
      "Auction A",
      "A description",
      NO_RESERVE,
    );

    simulatorA.switchUser(randomBytes(32));
    const auctionIdB = simulatorA.createAuction(
      "Auction B",
      "A description",
      NO_RESERVE,
    );

    expect(Buffer.from(auctionIdA).toString("hex")).not.toEqual(
      Buffer.from(auctionIdB).toString("hex"),
    );

    const recordA = simulatorA.getLedger().auctions.lookup(auctionIdA);
    const recordB = simulatorA.getLedger().auctions.lookup(auctionIdB);
    expect(recordA.creator).not.toEqual(recordB.creator);
  });

  it("rejects an empty title", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    expect(() =>
      simulator.createAuction("", "A description", NO_RESERVE),
    ).toThrow(/title must not be empty/);
  });

  it("does not mutate the ledger when rejecting an empty title", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    expect(() =>
      simulator.createAuction("", "A description", NO_RESERVE),
    ).toThrow();
    expect(simulator.getLedger().auctionCount).toEqual(0n);
    expect(simulator.getLedger().auctions.isEmpty()).toEqual(true);
  });

  it("does not mutate the caller's private state", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const initialPrivateState = simulator.getPrivateState();
    simulator.createAuction("My auction", "A description", NO_RESERVE);
    expect(simulator.getPrivateState()).toEqual(initialPrivateState);
  });
});

describe("commitBid (production circuit)", () => {
  const createAndCommit = (
    simulator: SecretBidSimulator,
    amount: bigint,
    nonce: Uint8Array,
  ) => {
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.setBidSecret(auctionId, amount, nonce);
    simulator.commitBid(auctionId);
    return auctionId;
  };

  it("successfully commits a bid", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.setBidSecret(auctionId, 100n, randomBytes(32));
    expect(() => simulator.commitBid(auctionId)).not.toThrow();
  });

  it("stores exactly the commitment hash createCommitment would produce", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const nonce = randomBytes(32);
    const amount = 100n;
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const bidderKey = simulator.deriveBidderKey(auctionId);
    simulator.setBidSecret(auctionId, amount, nonce);
    simulator.commitBid(auctionId);

    const recordKey = simulator.contract.circuits.deriveRecordKey(
      simulator.circuitContext,
      auctionId,
      bidderKey,
    ).result;
    const expectedCommitment = simulator.contract.circuits.createCommitment(
      simulator.circuitContext,
      auctionId,
      bidderKey,
      amount,
      nonce,
    ).result;

    expect(simulator.getLedger().commitments.lookup(recordKey)).toEqual(
      expectedCommitment,
    );
  });

  it("increments commitCount on the auction record", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    expect(
      simulator.getLedger().auctions.lookup(auctionId).commitCount,
    ).toEqual(0n);

    simulator.setBidSecret(auctionId, 100n, randomBytes(32));
    simulator.commitBid(auctionId);

    expect(
      simulator.getLedger().auctions.lookup(auctionId).commitCount,
    ).toEqual(1n);
  });

  it("rejects a commit to an unknown auction", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const unknownAuctionId = randomBytes(32);
    simulator.setBidSecret(unknownAuctionId, 100n, randomBytes(32));
    expect(() => simulator.commitBid(unknownAuctionId)).toThrow(
      /unknown auction/,
    );
  });

  it("rejects a commit once the auction has left the COMMIT phase", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.startReveal(auctionId);

    simulator.setBidSecret(auctionId, 100n, randomBytes(32));
    expect(() => simulator.commitBid(auctionId)).toThrow(
      /not in the commit phase/,
    );
  });

  it("rejects a duplicate commit from the same bidder", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = createAndCommit(simulator, 100n, randomBytes(32));

    simulator.setBidSecret(auctionId, 200n, randomBytes(32));
    expect(() => simulator.commitBid(auctionId)).toThrow(/already committed/);
  });

  it("leaves the ledger unchanged when a duplicate commit is rejected", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = createAndCommit(simulator, 100n, randomBytes(32));
    const commitmentsBefore = simulator.getLedger().commitments.size();
    const commitCountBefore = simulator
      .getLedger()
      .auctions.lookup(auctionId).commitCount;

    simulator.setBidSecret(auctionId, 200n, randomBytes(32));
    expect(() => simulator.commitBid(auctionId)).toThrow();

    expect(simulator.getLedger().commitments.size()).toEqual(commitmentsBefore);
    expect(
      simulator.getLedger().auctions.lookup(auctionId).commitCount,
    ).toEqual(commitCountBefore);
  });

  it("leaves the ledger unchanged when a commit to an unknown auction is rejected", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const unknownAuctionId = randomBytes(32);
    simulator.setBidSecret(unknownAuctionId, 100n, randomBytes(32));

    expect(() => simulator.commitBid(unknownAuctionId)).toThrow();
    expect(simulator.getLedger().commitments.isEmpty()).toEqual(true);
  });

  it("supports multiple different bidders committing to the same auction", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );

    simulator.setBidSecret(auctionId, 100n, randomBytes(32));
    simulator.commitBid(auctionId);

    simulator.switchUser(randomBytes(32));
    simulator.setBidSecret(auctionId, 200n, randomBytes(32));
    expect(() => simulator.commitBid(auctionId)).not.toThrow();

    expect(
      simulator.getLedger().auctions.lookup(auctionId).commitCount,
    ).toEqual(2n);
    expect(simulator.getLedger().commitments.size()).toEqual(2n);
  });

  it("supports the same bidder committing to different auctions", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionIdA = simulator.createAuction(
      "Auction A",
      "A description",
      NO_RESERVE,
    );
    const auctionIdB = simulator.createAuction(
      "Auction B",
      "A description",
      NO_RESERVE,
    );

    simulator.setBidSecret(auctionIdA, 100n, randomBytes(32));
    simulator.commitBid(auctionIdA);

    simulator.setBidSecret(auctionIdB, 200n, randomBytes(32));
    expect(() => simulator.commitBid(auctionIdB)).not.toThrow();

    expect(
      simulator.getLedger().auctions.lookup(auctionIdA).commitCount,
    ).toEqual(1n);
    expect(
      simulator.getLedger().auctions.lookup(auctionIdB).commitCount,
    ).toEqual(1n);
  });

  it("never stores the bid amount on the public ledger", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const nonce = randomBytes(32);
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const bidderKey = simulator.deriveBidderKey(auctionId);
    simulator.setBidSecret(auctionId, 100n, nonce);
    simulator.commitBid(auctionId);

    // `revealedBids` is the only ledger Map with a plaintext-amount value type,
    // and it must remain untouched by commitBid.
    expect(simulator.getLedger().revealedBids.isEmpty()).toEqual(true);

    // `commitments` holds only a 32-byte hash; structurally (by the Ledger
    // type itself) it cannot carry a `Uint<64>` amount. As a behavioral
    // sanity check, the stored value is exactly the hash produced by
    // createCommitment, not the amount in any raw encoding.
    const recordKey = simulator.contract.circuits.deriveRecordKey(
      simulator.circuitContext,
      auctionId,
      bidderKey,
    ).result;
    const stored = simulator.getLedger().commitments.lookup(recordKey);
    expect(stored.length).toEqual(32);
  });

  it("never stores the nonce on the public ledger", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const nonce = randomBytes(32);
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    const bidderKey = simulator.deriveBidderKey(auctionId);
    simulator.setBidSecret(auctionId, 100n, nonce);
    simulator.commitBid(auctionId);

    const recordKey = simulator.contract.circuits.deriveRecordKey(
      simulator.circuitContext,
      auctionId,
      bidderKey,
    ).result;
    const stored = simulator.getLedger().commitments.lookup(recordKey);
    expect(stored).not.toEqual(nonce);
  });

  it("produces different commitments for identical bids with different nonces", () => {
    const simulatorA = new SecretBidSimulator(randomBytes(32));
    const auctionIdA = simulatorA.createAuction(
      "Auction A",
      "A description",
      NO_RESERVE,
    );
    const bidderKeyA = simulatorA.deriveBidderKey(auctionIdA);
    simulatorA.setBidSecret(auctionIdA, 100n, randomBytes(32));
    simulatorA.commitBid(auctionIdA);
    const recordKeyA = simulatorA.contract.circuits.deriveRecordKey(
      simulatorA.circuitContext,
      auctionIdA,
      bidderKeyA,
    ).result;
    const commitmentA = simulatorA.getLedger().commitments.lookup(recordKeyA);

    const simulatorB = new SecretBidSimulator(randomBytes(32));
    const auctionIdB = simulatorB.createAuction(
      "Auction B",
      "A description",
      NO_RESERVE,
    );
    const bidderKeyB = simulatorB.deriveBidderKey(auctionIdB);
    simulatorB.setBidSecret(auctionIdB, 100n, randomBytes(32));
    simulatorB.commitBid(auctionIdB);
    const recordKeyB = simulatorB.contract.circuits.deriveRecordKey(
      simulatorB.circuitContext,
      auctionIdB,
      bidderKeyB,
    ).result;
    const commitmentB = simulatorB.getLedger().commitments.lookup(recordKeyB);

    expect(commitmentA).not.toEqual(commitmentB);
  });

  it("rejects a malformed (all-zero) nonce", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.setBidSecret(auctionId, 100n, new Uint8Array(32));
    expect(() => simulator.commitBid(auctionId)).toThrow(
      /malformed bid secret/,
    );
  });

  it("does not mutate the caller's private state", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = simulator.createAuction(
      "My auction",
      "A description",
      NO_RESERVE,
    );
    simulator.setBidSecret(auctionId, 100n, randomBytes(32));
    const stateBeforeCommit = simulator.getPrivateState();
    simulator.commitBid(auctionId);
    expect(simulator.getPrivateState()).toEqual(stateBeforeCommit);
  });
});

describe("SecretBid pure cryptographic helpers", () => {
  it("createCommitment and verifyCommitment agree on a matching reveal", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = randomBytes(32);
    const bidderKey = simulator.deriveBidderKey(auctionId);
    const amount = 42n;
    const nonce = randomBytes(32);

    const commitment = simulator.contract.circuits.createCommitment(
      simulator.circuitContext,
      auctionId,
      bidderKey,
      amount,
      nonce,
    ).result;

    const verified = simulator.contract.circuits.verifyCommitment(
      simulator.circuitContext,
      commitment,
      auctionId,
      bidderKey,
      amount,
      nonce,
    ).result;

    expect(verified).toEqual(true);
  });

  it("verifyCommitment rejects a mismatched amount", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const auctionId = randomBytes(32);
    const bidderKey = simulator.deriveBidderKey(auctionId);
    const nonce = randomBytes(32);

    const commitment = simulator.contract.circuits.createCommitment(
      simulator.circuitContext,
      auctionId,
      bidderKey,
      42n,
      nonce,
    ).result;

    const verified = simulator.contract.circuits.verifyCommitment(
      simulator.circuitContext,
      commitment,
      auctionId,
      bidderKey,
      43n,
      nonce,
    ).result;

    expect(verified).toEqual(false);
  });

  it("deriveBidderKey produces different keys for the same secret key across different auctions", () => {
    const simulator = new SecretBidSimulator(randomBytes(32));
    const secretKey = simulator.getPrivateState().secretKey;
    const auctionA = randomBytes(32);
    const auctionB = randomBytes(32);

    const keyA = simulator.contract.circuits.deriveBidderKey(
      simulator.circuitContext,
      secretKey,
      auctionA,
    ).result;
    const keyB = simulator.contract.circuits.deriveBidderKey(
      simulator.circuitContext,
      secretKey,
      auctionB,
    ).result;

    expect(keyA).not.toEqual(keyB);
  });
});
