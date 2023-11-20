import { BigNumber, Contract, utils as ethersUtils } from 'ethers';
import { PaginatedResponse, TransportResolver } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governanceV2Abi from './abi-v2.json';
import tokenAbi from './abi-aave.json';

/*

  Data source module for Aave's Governance V2 contract

  https://docs.aave.com/developers/protocol-governance/governance

  https://github.com/aave/governance-v2/blob/master/contracts/interfaces/IAaveGovernanceV2.sol

*/

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    id: BigNumber;
    calldatas: string[];
    creator: string;
    endBlock: BigNumber;
    executor: string;
    ipfsHash: string;
    signatures: string[];
    startBlock: BigNumber;
    strategy: string;
    targets: string[];
    values: BigNumber[];
    withDelegatecalls: string[];
  }
>;

export type ProposalCanceled = ParsedEvent<
  'ProposalCanceled',
  {
    id: BigNumber;
  }
>;

export type ProposalQueued = ParsedEvent<
  'ProposalQueued',
  {
    id: BigNumber;
    executionTime: BigNumber;
    initiatorQueueing: string;
  }
>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    id: BigNumber;
    executionTime: BigNumber;
    initiatorExecution: string;
  }
>;

export type VoteEmitted = ParsedEvent<
  'VoteEmitted',
  {
    id: BigNumber;
    voter: string;
    support: boolean;
    votingPower: BigNumber;
  }
>;

export type DelegateChanged = ParsedEvent<
  'DelegateChanged',
  {
    delegator: string;
    delegatee: string;
    delegationType: number;
  }
>;

export type DelegatedPowerChanged = ParsedEvent<
  'DelegatedPowerChanged',
  {
    user: string;
    amount: BigNumber;
    delegationType: number;
  }
>;

export type DelegateChangeEvents = DelegateChanged | DelegatedPowerChanged;

export type NonCreatedProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted;

export type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalCreated;

/**
 * IPFS content for a proposal
 *
 * eg: https://gateway.pinata.cloud/ipfs/QmNfU4FMdQriJVQeqQTNxgY63iSJVh8yCJf8aFDkQDjaLQ
 */
export interface ProposalContent {
  title: string;
  shortDescription: string;
  description: string;
}

export type TransferEvents = ParsedEvent<
  'Transfer',
  {
    from: string;
    to: string;
    value: BigNumber;
  }
>;

export class AaveGovernanceV2Contract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Resolve the proposal content from IPFS
   */
  async getProposalContent(ipfsHash: string): Promise<ProposalContent> {
    const ipfs = this.transports('ipfs');

    // aave contracts store ipfs hash as a 32 byte word, this coverts it to the
    // standard base58 IPFS CID that is used to request the file from gateways
    // https://github.com/aave/governance-v2-subgraph/blob/master/src/mapping/governance.ts#L42
    const ipfsCid = ethersUtils.base58.encode('0x1220' + ipfsHash.slice(2));

    let content = {} as ProposalContent;
    try {
      content = (await ipfs.fetchJson(ipfsCid)) as ProposalContent;
    } catch (e) {
      console.log(e);
      const resp = await ipfs.fetchRaw(ipfsCid);

      // Try to extract a title
      const title = resp.split('title:')[1];
      content.title = title.split('\n')[0];
      content.description = resp;
    }

    return content;
  }

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
    const contract = new Contract(this.address, governanceV2Abi, rpc);

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
   * Get all proposal events
   */
  async getAllProposalEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governanceV2Abi, rpc);

    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCanceled', 'ProposalExecuted', 'ProposalQueued', 'ProposalCreated'],
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
  ): Promise<PaginatedResponse<LogResult<VoteEmitted>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governanceV2Abi, rpc);

    const response = await queryEventLogs<VoteEmitted>(
      {
        rpc,
        cursor,
        contract,
        events: ['VoteEmitted'],
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
        events: ['DelegateChanged', 'DelegatedPowerChanged'],
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
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<TransferEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, tokenAbi, rpc);
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
}
