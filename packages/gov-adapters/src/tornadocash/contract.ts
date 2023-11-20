import { BigNumber, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorAbi from './abi-governor.json';

/*

  Data source for tornado cash on chain governance modules

  https://docs.tornado.cash/governance
  
  https://github.com/tornadocash/tornado-governance/blob/master/contracts/Governance.sol

*/

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    id: BigNumber;
    proposer: string;
    target: string;
    startTime: BigNumber;
    endTime: BigNumber;
    description: string;
  }
>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    proposalId: BigNumber;
  }
>;

export type Voted = ParsedEvent<
  'Voted',
  {
    voter: string;
    proposalId: BigNumber;
    support: boolean;
    votes: BigNumber;
  }
>;

export type Delegated = ParsedEvent<
  'Delegated',
  {
    account: string;
    to: string;
  }
>;

export type Undelegated = ParsedEvent<
  'Undelegated',
  {
    account: string;
    from: string;
  }
>;

export type DelegateChangeEvents = Delegated | Undelegated;

export type NonCreatedProposalEvent = ProposalExecuted;

export class TornadoCashGovernanceContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Fetch all proposal created events from the governance contract
   */
  async getAllProposalCreatedEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<ProposalCreated>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<ProposalCreated>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCreated'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Fetch all vote events from governance contract
   */
  async getAllVoteEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<Voted>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<Voted>(
      {
        rpc,
        cursor,
        contract,
        events: ['Voted'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

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
    const contract = new Contract(this.address, governorAbi, rpc);
    const response = await queryEventLogs<DelegateChangeEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['Delegated', 'Undelegated'],
      },
      startBlock,
      endBlock
    );

    return response;
  }
}
