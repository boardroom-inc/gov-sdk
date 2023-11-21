"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = void 0;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    if (log.parsed.name === 'ClearDelegate') {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegate,
            amount: '',
            aaveDelegationType: '',
            snapshotId: log.parsed.args.id,
            eventType: 'UNDELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
    else {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegate,
            amount: '',
            aaveDelegationType: '',
            snapshotId: log.parsed.args.id,
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map