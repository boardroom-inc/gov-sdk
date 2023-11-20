import { Bytes, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import delegatorAbi from './abi-delegator.json';

export type ClearDelegate = ParsedEvent<
  'ClearDelegate',
  {
    delegator: string;
    id: string;
    delegate: string;
  }
>;

export type SetDelegate = ParsedEvent<
  'SetDelegate',
  {
    delegator: string;
    id: string;
    delegate: string;
  }
>;

export type DelegateChangeEvents = ClearDelegate | SetDelegate;

export class SnapshotDelegatorContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Get all delegation events
   */
  async getDelegationEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, delegatorAbi, rpc);
    const response = await queryEventLogs<DelegateChangeEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['ClearDelegate', 'SetDelegate'],
      },
      startBlock,
      endBlock
    );

    return response;
  }
}
