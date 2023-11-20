import { BigNumber, Contract, ContractInterface } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';

export type VoteChange = ParsedEvent<
  'VoteChange',
  {
    from: string;
    to: string;
    amount: BigNumber;
  }
>;

export type DelegateChangeEvents = VoteChange;



export class VaultContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Get all delegation events
   */
   async getDelegationEvents(
    chainId: number,
    vaultAbi: ContractInterface,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, vaultAbi, rpc);
    const response = await queryEventLogs<DelegateChangeEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['VoteChange'],
      },
      startBlock,
      endBlock
    );
    return response;
  }


}
