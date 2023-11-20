import { Contract, ethers } from 'ethers';
import {
  ProposalsAdapter,
  VoteAdapter,
  DelegationAdapter,
  TransportResolver,
  PaginationOptions,
  ProposalPage,
  VotePage,
  ExternalLink,
  ProposalEventPage,
  VotePowerInfo,
  CreateOnChainProposalAdapter,
  CallData,
  CreateOnChainProposalPayload,
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  TokenAddress,
  BalanceInfo,
  TransferEventPage,
  GeneralAdapter,
  CastVoteData,
  Proposal,
  VotePowerAdapter,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
  Vote,
} from '@boardroom/gov-lib';
import {
  AnyProposalEvent,
  CompoundGovernorAlphaContract,
  TransferEvents,
} from './contract-alpha';
import { mapProposalEvent, mapProposal, mapVotes, mapDelegationEvents } from './transforms';
import governanceAbi from './abi-alpha.json';
import compTokenAbi from './abi-comp.json';
import { Provider, Contract as MultiContract } from 'ethers-multicall';
import { defaultAbiCoder, formatUnits, Interface } from 'ethers/lib/utils';
import { LogResult } from '../rpc';
import { DelegateChangeEvents } from './contract-bravo';
import { getFunctionsSelectorsWithInputs, getFunctionsSignatures, getSelectorsFromFunctionsSignatures } from './../utils';

interface CompoundGovernorAlphaAdapterConfig {
  governanceAddress: string;
  tokenAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
  etherscanMainnetAPIKey?: string;
}

/**
 * Proposals adapter for Compound Alpha Governor
 */

export class CompoundGovernorAlphaAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, CreateOnChainProposalAdapter, GeneralAdapter {
  private readonly governanceAddress: string;
  private readonly tokenAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;
  private readonly etherscanMainnetAPIKey?: string;

  constructor(config: CompoundGovernorAlphaAdapterConfig) {
    this.governanceAddress = config.governanceAddress;
    this.tokenAddress = config.tokenAddress;
    this.transports = config.transports;
    this.protocolName = config.protocolName;
    this.chainId = config.chainId ?? 1;
    this.boardroomAPIKey = config.boardroomAPIKey;
    this.etherscanMainnetAPIKey = config.etherscanMainnetAPIKey;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getSnapshotSpaceName(): Promise<string> {
    return '';
  }

  async getTokenAddress(): Promise<TokenAddress> {
    return this.tokenAddress;
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.governanceAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'compoundAlpha';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['propose']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['castVote', 'castVoteBySig'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(compTokenAbi, ['delegate']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.tokenAddress;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const governor = new CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
    const results = await governor.getProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const rpc = this.transports('rpc').network(await this.getChainId());

    const items = [] as Proposal[];
    for (const item of results.items) {
      const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
      const quorumResult = await contract.quorumVotes();
      const quorum = parseInt(ethers.utils.formatUnits(quorumResult, 18));
      const proposal = mapProposal(item.parsed, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, item.event.transactionHash);
      items.push(proposal);
    }

    return { items, nextCursor: results.nextCursor };
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string) : Promise<Proposal> {
    throw new Error("Function not defined for this adapter");
  }

  async getProposalIdFromEvent() : Promise<string> {
    throw new Error("Function not defined for this adapter");
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const governor = new CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
    const results = await governor.getProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const events = results.items.map((i: LogResult<AnyProposalEvent>) => mapProposalEvent(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
    const results = await governor.getVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const votes = mapVotes(results.items);

    return { items: votes, nextCursor: results.nextCursor };
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error("Function not defined for this adapter");
  }

  async getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    if (choice !== 0 && choice !== 1) {
      throw new Error('choice parameter must be 0 or 1');
    }

    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.governanceAddress;
    const contract = new Contract(governanceAddress, governanceAbi, rpc);
    const functionSignature = contract.interface.getSighash('castVote');
    const encodedData = contract.interface.encodeFunctionData(functionSignature, [parseInt(proposalId, 10), choice]);
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    if (choice !== 0 && choice !== 1) {
      throw new Error('choice parameter must be 0 or 1');
    }

    const res = await contract.castVote(parseInt(proposalId, 10), choice !== 0);

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteCompoundAlpha',
          hashId: res.hash,
          proposalId: proposalId,
          userAddress: await signer.getAddress(),
          identifier,
          separateAction: 'castVote',
          separateFramework: await this.getFramework(),
        }),

        this.transports('http').postJson(`https://api.boardroom.info/v1/voters/addOrUpdatePendingVote?key=${this.boardroomAPIKey}`, {
          cname: this.protocolName,
          choices: choice,
          address: await signer.getAddress(),
          txnHash: res.hash,
          status: 'pending',
          power,
          proposalRefId,
          adapter: adapter || 'onchain',
        }),
      ]);
      await apiCalls;
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async delegateVotingPower(delegatee: string, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.tokenAddress, compTokenAbi, signer);
    const res = await contract.delegate(delegatee);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateCompoundAlpha',
        hashId: res.hash,
        proposalId: '',
        userAddress: await signer.getAddress(),
        identifier,
        separateAction: 'delegate',
        separateFramework: await this.getFramework(),
      });
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async getDelegationEvents(pagination: PaginationOptions = {}): Promise<DelegationEventPage> {
    const governor = new CompoundGovernorAlphaContract(this.tokenAddress, this.transports);
    const results = await governor.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, compTokenAbi, rpc);
    return await contract.delegates(address);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, compTokenAbi, rpc);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.delegates(address));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getTransferEvents(pagination: PaginationOptions = {}): Promise<TransferEventPage> {
    const governor = new CompoundGovernorAlphaContract(this.tokenAddress, this.transports);
    const results = await governor.getTransferEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((log: LogResult<TransferEvents>) => {
      return {
        from: log.parsed.args.from,
        to: log.parsed.args.to,
        value: formatUnits(log.parsed.args.amount, 18),
        txHash: log.event.transactionHash,
      };
    });

    return { items: events, nextCursor: results.nextCursor };
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    const contract = new MultiContract(this.tokenAddress, compTokenAbi);

    // any[] is the type that comes back from the ethers contract
    // metaprogramming abstraction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let calls: any[];

    if (blockHeight === undefined) {
      calls = addresses.map((a) => contract.getCurrentVotes(a));
    } else {
      calls = addresses.map((a) => contract.getPriorVotes(a, blockHeight));
    }

    const powers = await provider.all(calls);

    const info = powers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
    });

    return info;
  }

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, compTokenAbi, rpc);

    const calls = addresses.map((a) => contract.balanceOf(a));

    const balances = await Promise.all(calls);
    return balances.map<BalanceInfo>((balance, idx) => {
      return { address: addresses[idx], balance: parseFloat(formatUnits(balance, 18)) };
    });
  }

  async getContract(contractAddress: string) {
    const resp = await this.transports('http').getJson(
      `https://api.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
        contractAddress
    );

    return JSON.parse(resp.data.result);
  }

  async getContractFunctions(contractAddress: string) {
    const abi = await this.getContract(contractAddress);

    const filteredAbi = abi.filter((obj: { type: any }) => {
      return obj.type === 'function';
    });

    return JSON.stringify(filteredAbi);
  }

  async encodeCalldata(data: CallData) {
    return defaultAbiCoder.encode(data.types, data.values);
  }

  /**
   * @param targets The ordered list of target addresses for calls to be made
   * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
   * @param signatures The ordered list of function signatures to be called
   * @param calldatas The ordered list of calldata to be passed to each call
   * @param description The proposal description of intended actions
   */
  async createOnChainProposal(payload: CreateOnChainProposalPayload, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;

    const encodedCallData = [];

    let index = 0;
    for (const data of payload.calldata) {
      const target = payload.targets[index];
      const contractAbi = await this.getContract(target);

      let contractIface = new ethers.utils.Interface(contractAbi);
      const encodedFunctionData = contractIface.encodeFunctionData(data.type, data.values);
      encodedCallData.push(encodedFunctionData);

      index++;
    }

    const iface = new Interface(governanceAbi);
    const encodedFunctionData = iface.encodeFunctionData('propose', [
      payload.targets,
      payload.values,
      payload.signatures,
      encodedCallData,
      payload.description,
    ]);
    const call = signer.sendTransaction({
      to: this.governanceAddress,
      data: encodedFunctionData,
    });
    const result = await Promise.all([call]);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'createOnChainProposalCompoundAlpha',
        // The response from onchain looks like [{"hash":"0x047a44d69fb0a04a6b4fadb82bfc057eb88ac23182b581e490f131035b37cead","type":null ...}]
        hashId: result[0].hash,
        userAddress: await signer.getAddress(),
        identifier,
        separateAction: 'createProposal',
        separateFramework: await this.getFramework(),
      });
    } catch (err) {
      console.log(err);
    }

    return JSON.stringify(result);
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }
}
