import { DelegationEvent } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { DelegateChangeEvents } from './contract';

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
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
  } else {
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
