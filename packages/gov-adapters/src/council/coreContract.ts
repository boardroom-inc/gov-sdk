import { BigNumber, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import coreVotingAbi from './abi-coreVoting.json';

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    proposalId: BigNumber;
    created: BigNumber
    execution: BigNumber;
    expiration: BigNumber;
  }
>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    proposalId: BigNumber;
  }
>;

export type AnyProposalEvent = ProposalExecuted | ProposalCreated;

export type Voted = ParsedEvent<
  'Voted',
  {
    voter: string;
    proposalId: BigNumber;
    /** 0 = YES, 1 = NO, 2 = MAYBE */
    vote: {
      castBallot: number;
      votingPower: BigNumber;
    }
  }
>;

export type VoteChange = ParsedEvent<
  'VoteChange',
  {
    from: string;
    to: string;
    amount: BigNumber;
  }
>;

export type DelegateChangeEvents = VoteChange;



export class CouncilCoreVotingContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  async getProposalCreatedEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<ProposalCreated>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, coreVotingAbi, rpc);
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


  async getProposalEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, coreVotingAbi, rpc);
    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalExecuted'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  async getVoteEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<Voted>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, coreVotingAbi, rpc);
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

}
