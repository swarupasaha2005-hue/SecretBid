import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AuctionPhase { COMMIT = 0, REVEAL = 1, CLOSED = 2 }

export type AuctionRecord = { auctionId: Uint8Array;
                              creator: Uint8Array;
                              title: string;
                              description: string;
                              reservePrice: { is_some: boolean, value: bigint };
                              phase: AuctionPhase;
                              commitCount: bigint;
                              revealCount: bigint;
                              winner: { is_some: boolean, value: Uint8Array };
                              winningBid: { is_some: boolean, value: bigint }
                            };

export type BidSecret = { amount: bigint; nonce: Uint8Array };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localBidSecret(context: __compactRuntime.WitnessContext<Ledger, PS>,
                 auctionId_0: Uint8Array): [PS, BidSecret];
}

export type ImpureCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                description_0: string,
                reservePrice_0: { is_some: boolean, value: bigint }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  commitBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startReveal(context: __compactRuntime.CircuitContext<PS>,
              auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                description_0: string,
                reservePrice_0: { is_some: boolean, value: bigint }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  commitBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startReveal(context: __compactRuntime.CircuitContext<PS>,
              auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveAuctionId(seed_0: Uint8Array, secretKey_0: Uint8Array): Uint8Array;
  deriveBidderKey(secretKey_0: Uint8Array, auctionId_0: Uint8Array): Uint8Array;
  createCommitment(auctionId_0: Uint8Array,
                   bidderKey_0: Uint8Array,
                   amount_0: bigint,
                   nonce_0: Uint8Array): Uint8Array;
  verifyCommitment(commitment_0: Uint8Array,
                   auctionId_0: Uint8Array,
                   bidderKey_0: Uint8Array,
                   amount_0: bigint,
                   nonce_0: Uint8Array): boolean;
  deriveRecordKey(auctionId_0: Uint8Array, bidderKey_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  deriveAuctionId(context: __compactRuntime.CircuitContext<PS>,
                  seed_0: Uint8Array,
                  secretKey_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  deriveBidderKey(context: __compactRuntime.CircuitContext<PS>,
                  secretKey_0: Uint8Array,
                  auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  createCommitment(context: __compactRuntime.CircuitContext<PS>,
                   auctionId_0: Uint8Array,
                   bidderKey_0: Uint8Array,
                   amount_0: bigint,
                   nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyCommitment(context: __compactRuntime.CircuitContext<PS>,
                   commitment_0: Uint8Array,
                   auctionId_0: Uint8Array,
                   bidderKey_0: Uint8Array,
                   amount_0: bigint,
                   nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  deriveRecordKey(context: __compactRuntime.CircuitContext<PS>,
                  auctionId_0: Uint8Array,
                  bidderKey_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                title_0: string,
                description_0: string,
                reservePrice_0: { is_some: boolean, value: bigint }): __compactRuntime.CircuitResults<PS, Uint8Array>;
  commitBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startReveal(context: __compactRuntime.CircuitContext<PS>,
              auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealBid(context: __compactRuntime.CircuitContext<PS>,
            auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               auctionId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly auctionCount: bigint;
  auctions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): AuctionRecord;
    [Symbol.iterator](): Iterator<[Uint8Array, AuctionRecord]>
  };
  commitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  revealedBids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
