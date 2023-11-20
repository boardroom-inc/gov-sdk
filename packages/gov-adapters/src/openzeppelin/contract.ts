import { BigNumber, Bytes, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorAbi from './abi-governor.json';
import governorAbiWithVotingModule from './abi-governor-voting-module.json';
import tokenAbi from './abi-token.json';
import tokenAbi721 from './abi-token-721.json';

/*

  Data source for openzeppelin on chain governance modules

  https://docs.openzeppelin.com/contracts/4.x/
  
  https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol

*/

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    proposalId: BigNumber;
    proposer: string;
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: string[];
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
  }
>;

export type ProposalCreatedWithVotingModule = ParsedEvent<
  'ProposalCreated',
  {
    proposalId: BigNumber;
    proposer: string;
    votingModule: string;
    proposalData: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
  }
>;

export type ProposalQueued = ParsedEvent <
  'ProposalQueued',
  {
    proposalId: BigNumber;
    eta: BigNumber;
  }

>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    proposalId: BigNumber;
  }
>;

export type ProposalCanceled = ParsedEvent<
  'ProposalCanceled',
  {
    proposalId: BigNumber;
  }
>;

export type VoteCast = ParsedEvent<
  'VoteCast',
  {
    voter: string;
    proposalId: BigNumber;
    support: number;
    weight: BigNumber;
    reason: string;
  }
>;

export type VoteCastWithParams = ParsedEvent<
  'VoteCastWithParams',
  {
    voter: string;
    proposalId: BigNumber;
    support: number;
    weight: BigNumber;
    reason: string;
    params: Bytes;
  }
>

export type DelegateChanged = ParsedEvent<
  'DelegateChanged',
  {
    delegator: string;
    fromDelegate: string;
    toDelegate: string;
  }
>;

export type DelegateVotesChanged = ParsedEvent<
  'DelegateVotesChanged',
  {
    delegate: string;
    previousBalance: BigNumber;
    newBalance: BigNumber;
  }
>;

export type VoteCastEvents = VoteCast | VoteCastWithParams;

export type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;

export type ProposalCreatedEvents = ProposalCreated | ProposalCreatedWithVotingModule;

export type AnyProposalEvent = ProposalCanceled | ProposalExecuted | ProposalCreated | ProposalQueued | ProposalCreatedWithVotingModule;

export type TransferEvents = ParsedEvent<
  'Transfer',
  {
    from: string;
    to: string;
    value: BigNumber;
  }
>;

export class OpenZeppelinGovernanceContract {
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
   * Fetch all proposal created events from the governance contract
   */
  async getAllProposalCreatedWithVotingModuleEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<ProposalCreatedWithVotingModule>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbiWithVotingModule, rpc);

    const response = await queryEventLogs<ProposalCreatedWithVotingModule>(
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
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCanceled', 'ProposalExecuted', 'ProposalCreated', 'ProposalQueued'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  async getProposalEventsWithVotingModule(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbiWithVotingModule, rpc);

    const response = await queryEventLogs<AnyProposalEvent>(
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
  ): Promise<PaginatedResponse<LogResult<VoteCastEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const response = await queryEventLogs<VoteCastEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['VoteCast', 'VoteCastWithParams'],
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
    const contract = new Contract(this.address, tokenAbi, rpc);
    const response = await queryEventLogs<DelegateChangeEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['DelegateChanged', 'DelegateVotesChanged'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Get all transfer events
   */
  async getTransferEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number,
    isTokenERC721?: boolean
  ): Promise<PaginatedResponse<LogResult<TransferEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    let contract = new Contract(this.address, tokenAbi, rpc);
    if (isTokenERC721) {
      contract = new Contract(this.address, tokenAbi721, rpc);
    }
    const response = await queryEventLogs<TransferEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['Transfer'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  async getProposalDeadline(chainId: number, proposalId: string): Promise<number> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi, rpc);

    const deadline = await contract.proposalDeadline(proposalId);
    return deadline;
  }
}
