import { BigNumber, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorAbi from './abi-governor.json';

/*

  Data source for moloch on chain governance modules

  https://github.com/HausDAO/daohaus-supergraph/blob/master/abis/V21Moloch.json

*/

export type SubmitProposal = ParsedEvent<
  'SubmitProposal',
  {
    applicant: string;
    sharesRequested: BigNumber;
    lootRequested: BigNumber;
    tributeOffered: BigNumber;
    tributeToken: BigNumber;
    paymentRequested: BigNumber;
    paymentToken: string;
    details: string;
    flags: boolean[];
    proposalId: BigNumber;
    delegateKey: string;
    memberAddress: string;
  }
>;

export type SponsorProposal = ParsedEvent<
  'SponsorProposal',
  {
    delegateKey: string;
    memberAddress: string;
    proposalId: BigNumber;
    proposalIndex: BigNumber;
    startingPeriod: BigNumber;
  }
>;

export type ProcessProposal = ParsedEvent<
  'ProcessProposal',
  {
    proposalIndex: BigNumber;
    proposalId: BigNumber;
    didPass: boolean;
  }
>;

export type CancelProposal = ParsedEvent<
  'CancelProposal',
  {
    proposalId: BigNumber;
    applicantAddress: string;
  }
>;

export type SubmitVote = ParsedEvent<
  'SubmitVote',
  {
    proposalId: BigNumber;
    proposalIndex: BigNumber;
    delegateKey: string;
    memberAddress: string;
    uintVote: number;
  }
>;

export type UpdateDelegateKey = ParsedEvent<
  'UpdateDelegateKey',
  {
    memberAddress: string;
    newDelegateKey: string;
  }
>;

export type DelegateChangeEvents = UpdateDelegateKey;

export type AnyProposalEvent = CancelProposal | ProcessProposal | SponsorProposal | SubmitProposal;

export class MolochGovernanceContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Fetch all proposal created events from the governance contract
   */
  async getAllProposalCreatedEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<SubmitProposal>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<SubmitProposal>({
        rpc,
        cursor,
        contract,
        events: ['SubmitProposal'],
      },
      startBlock,
      endBlock);

    return response;
  }

  /**
   * Get all proposal events
   */
  async getProposalEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['CancelProposal', 'ProcessProposal', 'SponsorProposal', 'SubmitProposal'],
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
  ): Promise<PaginatedResponse<LogResult<SubmitVote>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<SubmitVote>(
      {
        rpc,
        cursor,
        contract,
        events: ['SubmitVote'],
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
        events: ['UpdateDelegateKey'],
      },
      startBlock,
      endBlock
    );

    return response;
  }
}
