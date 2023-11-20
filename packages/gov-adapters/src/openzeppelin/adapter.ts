import { BigNumber, Contract, ethers, utils } from 'ethers';
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
  VotePowerAdapter,
  VotePowerInfo,
  CallData,
  CreateOnChainProposalPayload,
  CreateOnChainProposalAdapter,
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  BalanceInfo,
  TokenAddress,
  GeneralAdapter,
  TransferEventPage,
  CastVoteData,
  Proposal,
  JsonRpcTransport,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
  ProposalExecutionAdapter,
  ExecutionPayload,
  Vote,
} from '@boardroom/gov-lib';
import { mapProposalEvents, mapProposal, mapVotes, mapDelegationEvents, mapProposalWithVotingModule, mapVoteEvent } from './transforms';
import governanceAbi from './abi-governor.json';
import openZeppelinTokenAbi from './abi-token.json';
import timelockAbi from './abi-timelock.json';
import { Provider, Contract as MultiContract } from 'ethers-multicall';
import { defaultAbiCoder, formatUnits, Interface } from 'ethers/lib/utils';
import { DelegateChangeEvents, TransferEvents, OpenZeppelinGovernanceContract, ProposalCreated, ProposalCreatedWithVotingModule, VoteCastEvents } from './contract';
import { LogResult } from '../rpc';
import {
  getFunctionsSelectorsWithInputs,
  getFunctionsSignatures,
  getSelectorsFromFunctionsSignatures,
} from './../utils';

interface OpenZeppelinGovernorAdapterConfig {
  governanceAddress: string;
  tokenAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  isTokenERC721?: boolean;
  alternateDelegationAddress?: string;
  useTokenAddressForVotePower?: boolean;
  alternateVotePowerFunctionName?: string;
  decimals?: number;
  boardroomAPIKey?: string;
  etherscanMainnetAPIKey?: string;
  etherscanOptimismAPIKey?: string;
}

/**
 * Proposals adapter for OpenZeppelin Governor
 */
export class OpenZeppelinGovernorAdapter
  implements
    ProposalsAdapter,
    VoteAdapter,
    DelegationAdapter,
    VotePowerAdapter,
    CreateOnChainProposalAdapter,
    ProposalExecutionAdapter,
    GeneralAdapter {

  private readonly governanceAddress: string;
  private readonly tokenAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly isTokenERC721?: boolean;
  private readonly alternateDelegationAddress?: string;
  private readonly useTokenAddressForVotePower?: boolean;
  private readonly alternateVotePowerFunctionName?: string;
  private readonly decimals: number;
  private readonly boardroomAPIKey?: string;
  private readonly etherscanMainnetAPIKey?: string;
  private readonly etherscanOptimismAPIKey?: string;

  constructor(config: OpenZeppelinGovernorAdapterConfig) {
    this.governanceAddress = config.governanceAddress;
    this.tokenAddress = config.tokenAddress;
    this.transports = config.transports;
    this.protocolName = config.protocolName;
    this.chainId = config.chainId ?? 1;
    this.isTokenERC721 = config.isTokenERC721 ?? false;
    this.alternateDelegationAddress = config.alternateDelegationAddress;
    this.useTokenAddressForVotePower = config.useTokenAddressForVotePower ?? false;
    this.alternateVotePowerFunctionName = config.alternateVotePowerFunctionName;
    this.decimals = config.decimals ?? 18; // Provide default value if not specified
    this.boardroomAPIKey = config.boardroomAPIKey;
    this.etherscanMainnetAPIKey = config.etherscanMainnetAPIKey;
    this.etherscanOptimismAPIKey = config.etherscanOptimismAPIKey;
  }

  async getTimeDelay(): Promise<number> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceContract = new Contract(this.governanceAddress, governanceAbi, rpc);
    const timelockAddress = await governanceContract.timelock();
    const timelockContract = new Contract(timelockAddress, timelockAbi, rpc);
    const timeDelay = await timelockContract.getMinDelay();
    return timeDelay.toNumber();
  }

  async queueProposal(payload: ExecutionPayload): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    const res = await contract.queue(payload.targets, payload.values, payload.calldata, payload.descriptionHash);

    return res.hash;
  }

  async executeProposal(payload: ExecutionPayload): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    const res = await contract.execute(payload.targets, payload.values, payload.calldata, payload.descriptionHash);

    return res.hash;
  }

  // A proposal is cancellable by the proposer, but only while it is Pending state, i.e. before the vote starts.
  async cancelProposal(payload: ExecutionPayload): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    const res = await contract.cancel(payload.targets, payload.values, payload.calldata, payload.descriptionHash);

    return res.hash;
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
    return 'openZeppelin';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['propose']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['castVote', 'castVoteWithReason', 'castVoteBySig'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(openZeppelinTokenAbi, ['delegate']);
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
    const governor = new OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getAllProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    // Optimism has a separate governor style with a voting module
    let votingModuleItems = [];
    if (this.protocolName === 'optimism') {
      const votingModuleResults = await governor.getAllProposalCreatedWithVotingModuleEvents(
        await this.getChainId(),
        pagination.cursor,
        pagination.startBlock,
        pagination.endBlock
      );
      votingModuleItems.push(...votingModuleResults.items);
    }

    const rpc = this.transports('rpc').network(await this.getChainId());

    const items = [] as Proposal[];
    for (const item of results.items) {
      let proposalDeadline = item.parsed.args.endBlock;

      // Optimism proposals have the wrong end block time in the events,
      // so we have to call getProposalDeadline separately to get the correct value.
      if (this.protocolName === 'optimism') {
        const deadline = await governor.getProposalDeadline(
          await this.getChainId(),
          item.parsed.args.proposalId.toString()
        );
        proposalDeadline = BigNumber.from(deadline);
      }

      // Arbitrum quorum function uses ethereum mainnet blocks for its quorum function
      // event.blockNumber contains the arbitrum block number so we have to use args.startBlock instead
      let quorum = 0;
      if (this.protocolName === 'arbitrum') {
        quorum = await this.getQuorum(rpc, item.parsed.args.startBlock.toNumber());
      } else {
        quorum = await this.getQuorum(rpc, item.event.blockNumber);
      }

      let signatureList: string[] = [];
      try {
        signatureList = await this.getSignatureList(item.parsed.args.targets, item.parsed.args.calldatas);
      } catch (error) {
        console.log('Unable to get signature list for given targets of proposalId:' + item.parsed.args.proposalId);
        console.log(error);
      }

      const proposal = mapProposal(
        item.parsed as ProposalCreated,
        ['AGAINST', 'FOR', 'ABSTAIN'],
        quorum,
        item.event.transactionHash,
        proposalDeadline,
        signatureList
      );
      items.push(proposal);
    }

    for (const item of votingModuleItems) {
      let proposalDeadline = item.parsed.args.endBlock;

      // Optimism proposals have the wrong end block time in the events,
      // so we have to call getProposalDeadline separately to get the correct value.
      if (this.protocolName === 'optimism') {
        const deadline = await governor.getProposalDeadline(await this.getChainId(), item.parsed.args.proposalId.toString());
        proposalDeadline = BigNumber.from(deadline);
      }
      const quorum = await this.getQuorum(rpc, item.event.blockNumber);
      const proposal = mapProposalWithVotingModule(item.parsed as ProposalCreatedWithVotingModule, quorum, item.event.transactionHash, proposalDeadline);
      items.push(proposal);
    }

    return { items, nextCursor: results.nextCursor };
  }

  async getSignatureList(targets: string[], calldatas: string[]) : Promise<string[]> {
    const signatureList = [];
    let index = 0;
    for (const target of targets) {
      const calldata = calldatas[index];
      const callDataFunctionSelector: string = calldata.slice(0, 10);

      const targetABI = await this.getContract(target);

      for (const obj of targetABI) {
        if (obj.type === 'function') {
          const inputTypes = obj.inputs.map((input: { type: any }) => input.type).join(',');
          const functionSignature = `${obj.name}(${inputTypes})`;

          const selector = utils.id(functionSignature).slice(0, 10);

          if (selector === callDataFunctionSelector) {
            signatureList.push(functionSignature);
          }
        }
      }
      index++;
    }
    return signatureList;
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string) : Promise<Proposal> {
    const governor = new OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
    const rpc = this.transports('rpc').network(await this.getChainId());

    const parsedEvent = JSON.parse(event);

    const contract = new Contract(
      this.governanceAddress,
      governanceAbi,
      rpc
    );

    const parsedLog = contract.interface.parseLog(parsedEvent.event.data.block.logs[0]);

    // For some reason values are not properly labeled in parsedLog output
    const values = parsedLog.args[3];

    let proposalDeadline = BigNumber.from(parsedLog.args.endBlock);

    // Optimism proposals have the wrong end block time in the events,
    // so we have to call getProposalDeadline separately to get the correct value.
    if (this.protocolName === 'optimism') {
      const deadline = await governor.getProposalDeadline(await this.getChainId(), parsedLog.args.proposalId.toString());
      proposalDeadline = BigNumber.from(deadline);
    }

    // Arbitrum quorum function uses ethereum mainnet blocks for its quorum function
    // event.blockNumber contains the arbitrum block number so we have to use args.startBlock instead
    let quorum = 0;
    if (this.protocolName === 'arbitrum') {
      quorum = await this.getQuorum(rpc, BigNumber.from(parsedLog.args.startBlock).toNumber());
    } else {
      quorum = await this.getQuorum(rpc, blockNumber);
    }

    let signatureList: string[] = [];
    try {
      signatureList = await this.getSignatureList(parsedLog.args.targets, parsedLog.args.calldatas);
    } catch (error) {
      console.log('Unable to get signature list for given targets of proposalId:' + parsedLog.args.proposalId);
      console.log(error);
    }

    const proposalCreatedLog: ProposalCreated = {
      name: 'ProposalCreated',
      signature: parsedLog.signature,
      eventFragment: parsedLog.eventFragment,
      topic: parsedLog.topic,
      args: {
        proposalId: BigNumber.from(parsedLog.args.proposalId),
        proposer: parsedLog.args.proposer,
        targets: parsedLog.args.targets,
        values: values.map((value: any) => BigNumber.from(value)),
        signatures: signatureList,
        calldatas: parsedLog.args.calldatas,
        startBlock: BigNumber.from(parsedLog.args.startBlock),
        endBlock: BigNumber.from(parsedLog.args.endBlock),
        description: parsedLog.args.description
      }
    };

    const proposal = mapProposal(proposalCreatedLog, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, transactionHash, proposalDeadline, signatureList);
    return proposal;
  }

  async getQuorum(rpc: JsonRpcTransport, blockNumber: number) : Promise<number> {
    let quorum = 0;
    try {
      const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
      const quorumResult = await contract.quorum(blockNumber);
      quorum = parseInt(ethers.utils.formatUnits(quorumResult, 18));
    } catch (err) {
      console.log("Error querying quorum value. Using 0 for now");
      console.log(err);
    }
    return quorum;
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const governor = new OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
    const allResults = [];
    const results = await governor.getProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    allResults.push(...results.items);

    if (this.protocolName === 'optimism') {
      const votingModuleResults = await governor.getProposalEventsWithVotingModule(
        await this.getChainId(),
        pagination.cursor,
        pagination.startBlock,
        pagination.endBlock
      );
      allResults.push(...votingModuleResults.items);
    }

    const events = mapProposalEvents(results.items);

    return { items: events };
  }

  async getProposalIdFromEvent(data: any) : Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const parsedEvent = JSON.parse(data);

    const contract = new Contract(
      this.governanceAddress,
      governanceAbi,
      rpc
    );

    const parsedLog = contract.interface.parseLog(parsedEvent);
    const proposalId = parsedLog.args.proposalId.toString();

    return proposalId;
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);

    const results = await governor.getAllVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const votes = mapVotes(results.items, this.decimals);

    return { items: votes, nextCursor: results.nextCursor };
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    const rpc = this.transports('rpc').network(await this.getChainId());

    const parsedEvent = JSON.parse(event);
    const contract = new Contract(
      this.governanceAddress,
      governanceAbi,
      rpc
    );
    // const parsedLog = contract.interface.parseLog(parsedEvent);
    const parsedLog = contract.interface.parseLog(parsedEvent.event.data.block.logs[0]);

    let voteEventLog: VoteCastEvents;
    if (parsedLog.args.params) {
      voteEventLog = {
        name: 'VoteCastWithParams',
        signature: parsedLog.signature,
        eventFragment: parsedLog.eventFragment,
        topic: parsedLog.topic,
        args: {
          proposalId: BigNumber.from(parsedLog.args.proposalId),
          voter: parsedLog.args.voter,
          support: parsedLog.args.support,
          weight: parsedLog.args.weight,
          reason: parsedLog.args.reason,
          params: parsedLog.args.params,
        }
      };
    } else {
      voteEventLog = {
        name: 'VoteCast',
        signature: parsedLog.signature,
        eventFragment: parsedLog.eventFragment,
        topic: parsedLog.topic,
        args: {
          proposalId: BigNumber.from(parsedLog.args.proposalId),
          voter: parsedLog.args.voter,
          support: parsedLog.args.support,
          weight: parsedLog.args.weight,
          reason: parsedLog.args.reason,
        }
      };
    }

    const vote = mapVoteEvent(voteEventLog, blockNumber, transactionHash, this.decimals);
    return vote;
  }

  async getEncodedCastVoteData({ proposalId, choice, reason }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.governanceAddress;
    const contract = new Contract(governanceAddress, governanceAbi, rpc);
    let encodedData;
    if (reason) {
      const functionSignature = contract.interface.getSighash('castVoteWithReason');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice, reason]);
    } else {
      const functionSignature = contract.interface.getSighash('castVote');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
    }

    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, adapter } = params;
    let { identifier, reason } = params;
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);
    let res;

    // If the choice is an array we use the approval voting cast vote function for optimism
    if (this.protocolName === 'optimism' && choice instanceof Array) {
      reason = reason ?? '';
      const VOTE_PARAMS_ENCODING ='VOTE_PARAMS_ENCODING(uint256[] options)';

      const paramEncoding = ethers.utils.FunctionFragment.fromString(VOTE_PARAMS_ENCODING);

      // Choices haves to be in ascending order
      const encodedParams = ethers.utils.defaultAbiCoder.encode(paramEncoding.inputs, [choice.sort()]);

      res = await contract.castVoteWithReasonAndParams(proposalId, 0, reason, encodedParams);
    } else if (reason) {
      res = await contract.castVoteWithReason(proposalId, choice, reason);
    } else {
      res = await contract.castVote(proposalId, choice);
    }
    identifier = identifier ?? 'default';

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteOpenZeppelin',
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
    const contract = new Contract(this.tokenAddress, openZeppelinTokenAbi, signer);
    const res = await contract.delegate(delegatee);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateOpenZeppelin',
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
    // If an alternate delegation address is provided use that as the source of truth
    let delegationAddress = this.tokenAddress;
    if (this.alternateDelegationAddress) {
      delegationAddress = this.alternateDelegationAddress;
    }
    const governor = new OpenZeppelinGovernanceContract(delegationAddress, this.transports);
    const results = await governor.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i, this.decimals));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());

    // If an alternate delegation address is provided use that as the source of truth
    let delegationAddress = this.tokenAddress;
    if (this.alternateDelegationAddress) {
      delegationAddress = this.alternateDelegationAddress;
    }
    const contract = new Contract(delegationAddress, openZeppelinTokenAbi, rpc);

    return await contract.delegates(address);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());

    // If an alternate delegation address is provided use that as the source of truth
    let delegationAddress = this.tokenAddress;
    if (this.alternateDelegationAddress) {
      delegationAddress = this.alternateDelegationAddress;
    }
    const contract = new Contract(delegationAddress, openZeppelinTokenAbi, rpc);

    const calls = [];
    for (const address of addresses) {
      calls.push(contract.delegates(address));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  formatTokenAmount = (balance: any) => {
    let formattedBalance = parseFloat(formatUnits(balance, this.decimals));
    if (this.isTokenERC721) {
      formattedBalance = parseInt(balance);
    }
    return formattedBalance;
  };

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, openZeppelinTokenAbi, rpc);

    const calls = addresses.map((a) => contract.balanceOf(a));

    const balances = await Promise.all(calls);
    return balances.map<BalanceInfo>((balance, idx) => {
      return { address: addresses[idx], balance: this.formatTokenAmount(balance) };
    });
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    let multiContract = new MultiContract(this.governanceAddress, governanceAbi);

    const votePowerFunction = this.alternateVotePowerFunctionName || 'getVotes';
    // Right now only optimism and arbitrum use this
    if (this.useTokenAddressForVotePower) {
      multiContract = new MultiContract(this.tokenAddress, openZeppelinTokenAbi);

      const iface = new Interface(openZeppelinTokenAbi);
      const calls = addresses.map((a) => {
        const callData = iface.encodeFunctionData(votePowerFunction, [a]);

        return rpc.call({
          to: this.tokenAddress,
          data: callData,
        });
      });
      const powers = await Promise.all(calls);
      return powers.map<VotePowerInfo>((power, idx) => {
        return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
      });
    }

    let info: VotePowerInfo[];

    if (blockHeight === undefined) {
      const latestBlock = await rpc.getBlockNumber();
      const calls = addresses.map((a) => multiContract.getVotes(a, latestBlock-5));
      const powers = await provider.all(calls);
      info = powers.map<VotePowerInfo>((power, idx) => {
        return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
      });
    } else {
      const iface = new Interface(governanceAbi);
      const calls = addresses.map((a) => {
        const callData = iface.encodeFunctionData(votePowerFunction, [a, blockHeight]);

        return rpc.call({
          to: this.governanceAddress,
          data: callData,
        });
      });
      const powers = await Promise.all(calls);
      info = powers.map<VotePowerInfo>((power, idx) => {
        return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
      });
    }

    return info;
  }

  async getContract(contractAddress: string) {
    if (this.chainId === 5) {
      const resp = await this.transports('http').getJson(
        `https://api-goerli.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
          contractAddress
      );
      return JSON.parse(resp.data.result);
    } else if (this.chainId === 10) {
      const resp = await this.transports('http').getJson(
        `https://api-optimistic.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanOptimismAPIKey}&address=` +
          contractAddress
      );
      return JSON.parse(resp.data.result);
    } else {
      const resp = await this.transports('http').getJson(
        `https://api.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
          contractAddress
      );
      console.log(resp)
      return JSON.parse(resp.data.result);
    }
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
   * @param signatures openzeppelin governor doesn't use this field
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

    // OpenZeppelin doesn't use the signatures field
    const iface = new Interface(governanceAbi);
    const encodedFunctionData = iface.encodeFunctionData('propose', [
      payload.targets,
      payload.values,
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
        action: 'createOnChainProposalOpenZeppelin',
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

  async getTransferEvents(pagination: PaginationOptions = {}): Promise<TransferEventPage> {
    const governor = new OpenZeppelinGovernanceContract(this.tokenAddress, this.transports);
    const results = await governor.getTransferEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock,
      this.isTokenERC721
    );

    const events = results.items.map((log: LogResult<TransferEvents>) => {
      // If the contract is an nft based contract assume the transfer amount is 1
      let value = formatUnits(1, 0);
      if (!this.isTokenERC721) {
        value = formatUnits(log.parsed.args.value, this.decimals);
      }

      return {
        from: log.parsed.args.from,
        to: log.parsed.args.to,
        value: value,
        txHash: log.event.transactionHash,
      };
    });

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }
}
