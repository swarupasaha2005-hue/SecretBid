import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var AuctionPhase;
(function (AuctionPhase) {
  AuctionPhase[AuctionPhase['COMMIT'] = 0] = 'COMMIT';
  AuctionPhase[AuctionPhase['REVEAL'] = 1] = 'REVEAL';
  AuctionPhase[AuctionPhase['CLOSED'] = 2] = 'CLOSED';
})(AuctionPhase || (AuctionPhase = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeOpaqueString;

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Maybe_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_2.fromValue(value_0),
      value: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_some).concat(_descriptor_3.toValue(value_0.value));
  }
}

const _descriptor_4 = new _Maybe_0();

const _descriptor_5 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

class _Maybe_1 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_2.fromValue(value_0),
      value: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_some).concat(_descriptor_0.toValue(value_0.value));
  }
}

const _descriptor_7 = new _Maybe_1();

class _AuctionRecord_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_7.alignment().concat(_descriptor_4.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      auctionId: _descriptor_0.fromValue(value_0),
      creator: _descriptor_0.fromValue(value_0),
      title: _descriptor_1.fromValue(value_0),
      description: _descriptor_1.fromValue(value_0),
      reservePrice: _descriptor_4.fromValue(value_0),
      phase: _descriptor_5.fromValue(value_0),
      commitCount: _descriptor_6.fromValue(value_0),
      revealCount: _descriptor_6.fromValue(value_0),
      winner: _descriptor_7.fromValue(value_0),
      winningBid: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.auctionId).concat(_descriptor_0.toValue(value_0.creator).concat(_descriptor_1.toValue(value_0.title).concat(_descriptor_1.toValue(value_0.description).concat(_descriptor_4.toValue(value_0.reservePrice).concat(_descriptor_5.toValue(value_0.phase).concat(_descriptor_6.toValue(value_0.commitCount).concat(_descriptor_6.toValue(value_0.revealCount).concat(_descriptor_7.toValue(value_0.winner).concat(_descriptor_4.toValue(value_0.winningBid))))))))));
  }
}

const _descriptor_8 = new _AuctionRecord_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _BidSecret_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      amount: _descriptor_3.fromValue(value_0),
      nonce: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.amount).concat(_descriptor_0.toValue(value_0.nonce));
  }
}

const _descriptor_10 = new _BidSecret_0();

const _descriptor_11 = new __compactRuntime.CompactTypeVector(4, _descriptor_0);

const _descriptor_12 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_13 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_14 = new _Either_0();

const _descriptor_15 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_16 = new _ContractAddress_0();

const _descriptor_17 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.localSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSecretKey');
    }
    if (typeof(witnesses_0.localBidSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localBidSecret');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      deriveAuctionId(context, ...args_1) {
        return { result: pureCircuits.deriveAuctionId(...args_1), context };
      },
      deriveBidderKey(context, ...args_1) {
        return { result: pureCircuits.deriveBidderKey(...args_1), context };
      },
      createCommitment(context, ...args_1) {
        return { result: pureCircuits.createCommitment(...args_1), context };
      },
      verifyCommitment(context, ...args_1) {
        return { result: pureCircuits.verifyCommitment(...args_1), context };
      },
      deriveRecordKey(context, ...args_1) {
        return { result: pureCircuits.deriveRecordKey(...args_1), context };
      },
      createAuction: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`createAuction: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const title_0 = args_1[1];
        const description_0 = args_1[2];
        const reservePrice_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 1 (as invoked from Typescript)',
                                     'secretbid.compact line 287 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(reservePrice_0) === 'object' && typeof(reservePrice_0.is_some) === 'boolean' && typeof(reservePrice_0.value) === 'bigint' && reservePrice_0.value >= 0n && reservePrice_0.value <= 18446744073709551615n)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'secretbid.compact line 287 char 1',
                                     'struct Maybe<is_some: Boolean, value: Uint<0..18446744073709551616>>',
                                     reservePrice_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(title_0).concat(_descriptor_1.toValue(description_0).concat(_descriptor_4.toValue(reservePrice_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_4.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createAuction_0(context,
                                               partialProofData,
                                               title_0,
                                               description_0,
                                               reservePrice_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      commitBid: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`commitBid: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const auctionId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('commitBid',
                                     'argument 1 (as invoked from Typescript)',
                                     'secretbid.compact line 344 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
          __compactRuntime.typeError('commitBid',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'secretbid.compact line 344 char 1',
                                     'Bytes<32>',
                                     auctionId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(auctionId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._commitBid_0(context,
                                           partialProofData,
                                           auctionId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      startReveal: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`startReveal: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const auctionId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('startReveal',
                                     'argument 1 (as invoked from Typescript)',
                                     'secretbid.compact line 397 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
          __compactRuntime.typeError('startReveal',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'secretbid.compact line 397 char 1',
                                     'Bytes<32>',
                                     auctionId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(auctionId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._startReveal_0(context,
                                             partialProofData,
                                             auctionId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revealBid: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`revealBid: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const auctionId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revealBid',
                                     'argument 1 (as invoked from Typescript)',
                                     'secretbid.compact line 467 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
          __compactRuntime.typeError('revealBid',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'secretbid.compact line 467 char 1',
                                     'Bytes<32>',
                                     auctionId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(auctionId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revealBid_0(context,
                                           partialProofData,
                                           auctionId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closeAuction: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`closeAuction: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const auctionId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('closeAuction',
                                     'argument 1 (as invoked from Typescript)',
                                     'secretbid.compact line 550 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
          __compactRuntime.typeError('closeAuction',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'secretbid.compact line 550 char 1',
                                     'Bytes<32>',
                                     auctionId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(auctionId_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closeAuction_0(context,
                                              partialProofData,
                                              auctionId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createAuction: this.circuits.createAuction,
      commitBid: this.circuits.commitBid,
      startReveal: this.circuits.startReveal,
      revealBid: this.circuits.revealBid,
      closeAuction: this.circuits.closeAuction
    };
    this.provableCircuits = {
      createAuction: this.circuits.createAuction,
      commitBid: this.circuits.commitBid,
      startReveal: this.circuits.startReveal,
      revealBid: this.circuits.revealBid,
      closeAuction: this.circuits.closeAuction
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createAuction', new __compactRuntime.ContractOperation());
    state_0.setOperation('commitBid', new __compactRuntime.ContractOperation());
    state_0.setOperation('startReveal', new __compactRuntime.ContractOperation());
    state_0.setOperation('revealBid', new __compactRuntime.ContractOperation());
    state_0.setOperation('closeAuction', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(0n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _some_0(value_0) { return { is_some: true, value: value_0 }; }
  _some_1(value_0) { return { is_some: true, value: value_0 }; }
  _none_0() { return { is_some: false, value: new Uint8Array(32) }; }
  _none_1() { return { is_some: false, value: 0n }; }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_13, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_11, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_12, value_0);
    return result_0;
  }
  _localSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSecretKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSecretKey',
                                 'return value',
                                 'secretbid.compact line 148 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localBidSecret_0(context, partialProofData, auctionId_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localBidSecret(witnessContext_0,
                                                                         auctionId_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.amount) === 'bigint' && result_0.amount >= 0n && result_0.amount <= 18446744073709551615n && result_0.nonce.buffer instanceof ArrayBuffer && result_0.nonce.BYTES_PER_ELEMENT === 1 && result_0.nonce.length === 32)) {
      __compactRuntime.typeError('localBidSecret',
                                 'return value',
                                 'secretbid.compact line 156 char 1',
                                 'struct BidSecret<amount: Uint<0..18446744073709551616>, nonce: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_10.toValue(result_0),
      alignment: _descriptor_10.alignment()
    });
    return result_0;
  }
  _deriveAuctionId_0(seed_0, secretKey_0) {
    return this._persistentHash_0([new Uint8Array([115, 101, 99, 114, 101, 116, 98, 105, 100, 58, 97, 117, 99, 116, 105, 111, 110, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   seed_0,
                                   secretKey_0]);
  }
  _deriveBidderKey_0(secretKey_0, auctionId_0) {
    return this._persistentHash_0([new Uint8Array([115, 101, 99, 114, 101, 116, 98, 105, 100, 58, 98, 105, 100, 100, 101, 114, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   auctionId_0,
                                   secretKey_0]);
  }
  _createCommitment_0(auctionId_0, bidderKey_0, amount_0, nonce_0) {
    return this._persistentHash_1([auctionId_0,
                                   bidderKey_0,
                                   __compactRuntime.convertFieldToBytes(32,
                                                                        amount_0,
                                                                        'secretbid.compact line 217 char 70'),
                                   nonce_0]);
  }
  _verifyCommitment_0(commitment_0, auctionId_0, bidderKey_0, amount_0, nonce_0)
  {
    return this._equal_0(commitment_0,
                         this._createCommitment_0(auctionId_0,
                                                  bidderKey_0,
                                                  amount_0,
                                                  nonce_0));
  }
  _deriveRecordKey_0(auctionId_0, bidderKey_0) {
    return this._persistentHash_2([auctionId_0, bidderKey_0]);
  }
  _createAuction_0(context,
                   partialProofData,
                   title_0,
                   description_0,
                   reservePrice_0)
  {
    __compactRuntime.assert(title_0 !== '', 'SecretBid: title must not be empty');
    const secretKey_0 = this._localSecretKey_0(context, partialProofData);
    const auctionId_0 = this._deriveAuctionId_0(__compactRuntime.convertFieldToBytes(32,
                                                                                     _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                                               partialProofData,
                                                                                                                                               [
                                                                                                                                                { dup: { n: 0 } },
                                                                                                                                                { idx: { cached: false,
                                                                                                                                                         pushPath: false,
                                                                                                                                                         path: [
                                                                                                                                                                { tag: 'value',
                                                                                                                                                                  value: { value: _descriptor_17.toValue(0n),
                                                                                                                                                                           alignment: _descriptor_17.alignment() } }] } },
                                                                                                                                                { popeq: { cached: true,
                                                                                                                                                           result: undefined } }]).value),
                                                                                     'secretbid.compact line 295 char 46'),
                                                secretKey_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(1n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'SecretBid: auctionId collision (should never occur)');
    const creatorKey_0 = this._deriveBidderKey_0(secretKey_0, auctionId_0);
    const tmp_0 = { auctionId: auctionId_0,
                    creator: creatorKey_0,
                    title: title_0,
                    description: description_0,
                    reservePrice: reservePrice_0,
                    phase: 0,
                    commitCount: 0n,
                    revealCount: 0n,
                    winner: this._none_0(),
                    winningBid: this._none_1() };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(1n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(0n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_9.toValue(tmp_1),
                                                                alignment: _descriptor_9.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return auctionId_0;
  }
  _commitBid_0(context, partialProofData, auctionId_0) {
    const publicAuctionId_0 = auctionId_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'SecretBid: unknown auction');
    const auction_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(1n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(auction_0.phase === 0,
                            'SecretBid: auction is not in the commit phase');
    const bidderKey_0 = this._deriveBidderKey_0(this._localSecretKey_0(context,
                                                                       partialProofData),
                                                publicAuctionId_0);
    const recordKey_0 = this._deriveRecordKey_0(publicAuctionId_0, bidderKey_0);
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(2n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(recordKey_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'SecretBid: bidder has already committed to this auction');
    const bidSecret_0 = this._localBidSecret_0(context,
                                               partialProofData,
                                               auctionId_0);
    __compactRuntime.assert(!this._equal_1(bidSecret_0.nonce, new Uint8Array(32)),
                            'SecretBid: malformed bid secret (nonce must not be zero)');
    const commitment_0 = this._createCommitment_0(publicAuctionId_0,
                                                  bidderKey_0,
                                                  bidSecret_0.amount,
                                                  bidSecret_0.nonce);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(2n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(recordKey_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(commitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { auctionId: auction_0.auctionId,
                    creator: auction_0.creator,
                    title: auction_0.title,
                    description: auction_0.description,
                    reservePrice: auction_0.reservePrice,
                    phase: auction_0.phase,
                    commitCount:
                      ((t1) => {
                        if (t1 > 4294967295n) {
                          throw new __compactRuntime.CompactError('secretbid.compact line 367 char 18: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                        }
                        return t1;
                      })(auction_0.commitCount + 1n),
                    revealCount: auction_0.revealCount,
                    winner: auction_0.winner,
                    winningBid: auction_0.winningBid };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(1n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _startReveal_0(context, partialProofData, auctionId_0) {
    const publicAuctionId_0 = auctionId_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'SecretBid: unknown auction');
    const current_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(1n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const callerKey_0 = this._deriveBidderKey_0(this._localSecretKey_0(context,
                                                                       partialProofData),
                                                publicAuctionId_0);
    __compactRuntime.assert(this._equal_2(callerKey_0, current_0.creator),
                            'SecretBid: only the auction creator may start the reveal phase');
    __compactRuntime.assert(current_0.phase === 0,
                            'SecretBid: auction is not in the commit phase');
    const tmp_0 = { auctionId: current_0.auctionId,
                    creator: current_0.creator,
                    title: current_0.title,
                    description: current_0.description,
                    reservePrice: current_0.reservePrice,
                    phase: 1,
                    commitCount: current_0.commitCount,
                    revealCount: current_0.revealCount,
                    winner: current_0.winner,
                    winningBid: current_0.winningBid };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(1n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revealBid_0(context, partialProofData, auctionId_0) {
    const publicAuctionId_0 = auctionId_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'SecretBid: unknown auction');
    const current_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(1n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(current_0.phase === 1,
                            'SecretBid: auction is not in the reveal phase');
    const bidderKey_0 = this._deriveBidderKey_0(this._localSecretKey_0(context,
                                                                       partialProofData),
                                                publicAuctionId_0);
    const recordKey_0 = this._deriveRecordKey_0(publicAuctionId_0, bidderKey_0);
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(2n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(recordKey_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'SecretBid: bidder never committed to this auction');
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(3n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(recordKey_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'SecretBid: bidder has already revealed');
    const bidSecret_0 = this._localBidSecret_0(context,
                                               partialProofData,
                                               auctionId_0);
    __compactRuntime.assert(!this._equal_3(bidSecret_0.nonce, new Uint8Array(32)),
                            'SecretBid: malformed bid secret (nonce must not be zero)');
    const storedCommitment_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_17.toValue(2n),
                                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_0.toValue(recordKey_0),
                                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value);
    const expectedCommitment_0 = this._createCommitment_0(publicAuctionId_0,
                                                          bidderKey_0,
                                                          bidSecret_0.amount,
                                                          bidSecret_0.nonce);
    __compactRuntime.assert(this._equal_4(storedCommitment_0,
                                          expectedCommitment_0),
                            'SecretBid: commitment mismatch');
    const amount_0 = bidSecret_0.amount;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(3n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(recordKey_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(amount_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const newRevealCount_0 = ((t1) => {
                               if (t1 > 4294967295n) {
                                 throw new __compactRuntime.CompactError('secretbid.compact line 488 char 26: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                               }
                               return t1;
                             })(current_0.revealCount + 1n);
    const meetsReserve_0 = current_0.reservePrice.is_some ?
                           amount_0 >= current_0.reservePrice.value :
                           true;
    const becomesWinner_0 = meetsReserve_0
                            &&
                            (!current_0.winningBid.is_some
                             ||
                             amount_0 > current_0.winningBid.value);
    if (becomesWinner_0) {
      const tmp_0 = { auctionId: current_0.auctionId,
                      creator: current_0.creator,
                      title: current_0.title,
                      description: current_0.description,
                      reservePrice: current_0.reservePrice,
                      phase: current_0.phase,
                      commitCount: current_0.commitCount,
                      revealCount: newRevealCount_0,
                      winner: this._some_0(bidderKey_0),
                      winningBid: this._some_1(amount_0) };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_17.toValue(1n),
                                                                    alignment: _descriptor_17.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                                alignment: _descriptor_8.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    } else {
      const tmp_1 = { auctionId: current_0.auctionId,
                      creator: current_0.creator,
                      title: current_0.title,
                      description: current_0.description,
                      reservePrice: current_0.reservePrice,
                      phase: current_0.phase,
                      commitCount: current_0.commitCount,
                      revealCount: newRevealCount_0,
                      winner: current_0.winner,
                      winningBid: current_0.winningBid };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_17.toValue(1n),
                                                                    alignment: _descriptor_17.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_1),
                                                                                                alignment: _descriptor_8.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    return [];
  }
  _closeAuction_0(context, partialProofData, auctionId_0) {
    const publicAuctionId_0 = auctionId_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'SecretBid: unknown auction');
    const current_0 = _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(1n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const callerKey_0 = this._deriveBidderKey_0(this._localSecretKey_0(context,
                                                                       partialProofData),
                                                publicAuctionId_0);
    __compactRuntime.assert(this._equal_5(callerKey_0, current_0.creator),
                            'SecretBid: only the auction creator may close the auction');
    __compactRuntime.assert(current_0.phase === 1,
                            'SecretBid: auction is not in the reveal phase');
    __compactRuntime.assert(this._equal_6(current_0.revealCount,
                                          current_0.commitCount),
                            'SecretBid: not every commitment has been revealed');
    const tmp_0 = { auctionId: current_0.auctionId,
                    creator: current_0.creator,
                    title: current_0.title,
                    description: current_0.description,
                    reservePrice: current_0.reservePrice,
                    phase: 2,
                    commitCount: current_0.commitCount,
                    revealCount: current_0.revealCount,
                    winner: current_0.winner,
                    winningBid: current_0.winningBid };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(1n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicAuctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get auctionCount() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(0n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    auctions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(1n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(1n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'secretbid.compact line 124 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(1n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'secretbid.compact line 124 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(1n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_8.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    commitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(2n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(2n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'secretbid.compact line 130 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(2n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'secretbid.compact line 130 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(2n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    revealedBids: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(3n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(3n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'secretbid.compact line 136 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(3n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'secretbid.compact line 136 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(3n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  localSecretKey: (...args) => undefined, localBidSecret: (...args) => undefined
});
export const pureCircuits = {
  deriveAuctionId: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveAuctionId: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const seed_0 = args_0[0];
    const secretKey_0 = args_0[1];
    if (!(seed_0.buffer instanceof ArrayBuffer && seed_0.BYTES_PER_ELEMENT === 1 && seed_0.length === 32)) {
      __compactRuntime.typeError('deriveAuctionId',
                                 'argument 1',
                                 'secretbid.compact line 188 char 1',
                                 'Bytes<32>',
                                 seed_0)
    }
    if (!(secretKey_0.buffer instanceof ArrayBuffer && secretKey_0.BYTES_PER_ELEMENT === 1 && secretKey_0.length === 32)) {
      __compactRuntime.typeError('deriveAuctionId',
                                 'argument 2',
                                 'secretbid.compact line 188 char 1',
                                 'Bytes<32>',
                                 secretKey_0)
    }
    return _dummyContract._deriveAuctionId_0(seed_0, secretKey_0);
  },
  deriveBidderKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveBidderKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const secretKey_0 = args_0[0];
    const auctionId_0 = args_0[1];
    if (!(secretKey_0.buffer instanceof ArrayBuffer && secretKey_0.BYTES_PER_ELEMENT === 1 && secretKey_0.length === 32)) {
      __compactRuntime.typeError('deriveBidderKey',
                                 'argument 1',
                                 'secretbid.compact line 202 char 1',
                                 'Bytes<32>',
                                 secretKey_0)
    }
    if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
      __compactRuntime.typeError('deriveBidderKey',
                                 'argument 2',
                                 'secretbid.compact line 202 char 1',
                                 'Bytes<32>',
                                 auctionId_0)
    }
    return _dummyContract._deriveBidderKey_0(secretKey_0, auctionId_0);
  },
  createCommitment: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`createCommitment: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const auctionId_0 = args_0[0];
    const bidderKey_0 = args_0[1];
    const amount_0 = args_0[2];
    const nonce_0 = args_0[3];
    if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
      __compactRuntime.typeError('createCommitment',
                                 'argument 1',
                                 'secretbid.compact line 211 char 1',
                                 'Bytes<32>',
                                 auctionId_0)
    }
    if (!(bidderKey_0.buffer instanceof ArrayBuffer && bidderKey_0.BYTES_PER_ELEMENT === 1 && bidderKey_0.length === 32)) {
      __compactRuntime.typeError('createCommitment',
                                 'argument 2',
                                 'secretbid.compact line 211 char 1',
                                 'Bytes<32>',
                                 bidderKey_0)
    }
    if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('createCommitment',
                                 'argument 3',
                                 'secretbid.compact line 211 char 1',
                                 'Uint<0..18446744073709551616>',
                                 amount_0)
    }
    if (!(nonce_0.buffer instanceof ArrayBuffer && nonce_0.BYTES_PER_ELEMENT === 1 && nonce_0.length === 32)) {
      __compactRuntime.typeError('createCommitment',
                                 'argument 4',
                                 'secretbid.compact line 211 char 1',
                                 'Bytes<32>',
                                 nonce_0)
    }
    return _dummyContract._createCommitment_0(auctionId_0,
                                              bidderKey_0,
                                              amount_0,
                                              nonce_0);
  },
  verifyCommitment: (...args_0) => {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`verifyCommitment: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const commitment_0 = args_0[0];
    const auctionId_0 = args_0[1];
    const bidderKey_0 = args_0[2];
    const amount_0 = args_0[3];
    const nonce_0 = args_0[4];
    if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
      __compactRuntime.typeError('verifyCommitment',
                                 'argument 1',
                                 'secretbid.compact line 226 char 1',
                                 'Bytes<32>',
                                 commitment_0)
    }
    if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
      __compactRuntime.typeError('verifyCommitment',
                                 'argument 2',
                                 'secretbid.compact line 226 char 1',
                                 'Bytes<32>',
                                 auctionId_0)
    }
    if (!(bidderKey_0.buffer instanceof ArrayBuffer && bidderKey_0.BYTES_PER_ELEMENT === 1 && bidderKey_0.length === 32)) {
      __compactRuntime.typeError('verifyCommitment',
                                 'argument 3',
                                 'secretbid.compact line 226 char 1',
                                 'Bytes<32>',
                                 bidderKey_0)
    }
    if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('verifyCommitment',
                                 'argument 4',
                                 'secretbid.compact line 226 char 1',
                                 'Uint<0..18446744073709551616>',
                                 amount_0)
    }
    if (!(nonce_0.buffer instanceof ArrayBuffer && nonce_0.BYTES_PER_ELEMENT === 1 && nonce_0.length === 32)) {
      __compactRuntime.typeError('verifyCommitment',
                                 'argument 5',
                                 'secretbid.compact line 226 char 1',
                                 'Bytes<32>',
                                 nonce_0)
    }
    return _dummyContract._verifyCommitment_0(commitment_0,
                                              auctionId_0,
                                              bidderKey_0,
                                              amount_0,
                                              nonce_0);
  },
  deriveRecordKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveRecordKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const auctionId_0 = args_0[0];
    const bidderKey_0 = args_0[1];
    if (!(auctionId_0.buffer instanceof ArrayBuffer && auctionId_0.BYTES_PER_ELEMENT === 1 && auctionId_0.length === 32)) {
      __compactRuntime.typeError('deriveRecordKey',
                                 'argument 1',
                                 'secretbid.compact line 241 char 1',
                                 'Bytes<32>',
                                 auctionId_0)
    }
    if (!(bidderKey_0.buffer instanceof ArrayBuffer && bidderKey_0.BYTES_PER_ELEMENT === 1 && bidderKey_0.length === 32)) {
      __compactRuntime.typeError('deriveRecordKey',
                                 'argument 2',
                                 'secretbid.compact line 241 char 1',
                                 'Bytes<32>',
                                 bidderKey_0)
    }
    return _dummyContract._deriveRecordKey_0(auctionId_0, bidderKey_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
