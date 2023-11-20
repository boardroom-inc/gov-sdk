import { Contract, ContractInterface, ethers, constants, BigNumber } from 'ethers';
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
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  decodeCursor,
  encodeCursor,
  TokenAddress,
  DelegationsGetter,
  BalanceInfo,
  CastVoteData,
  Proposal,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
  Vote,
} from '@boardroom/gov-lib';
import { CouncilCoreVotingContract, AnyProposalEvent, ProposalCreated, DelegateChangeEvents } from './coreContract';
import { VaultContract, VoteChange } from './vaultContract';
import { mapProposalEvent, mapProposal, mapVotes, mapDelegationEvents } from './transforms';
import { formatUnits } from 'ethers/lib/utils';
import { LogResult } from '../rpc';
import LockingVaultAbi from './abi-LockingVault.json';
import VestingVaultAbi from './abi-VestingVault.json';
import CoreVotingAbi from './abi-coreVoting.json';
import TokenAbi from './abi-token.json';
import {
  getFunctionsSelectorsWithInputs,
  getFunctionsSignatures,
  getSelectorsFromFunctionsSignatures,
} from './../utils';
import { Log } from 'gov-lib/node_modules/@ethersproject/providers/lib';

export const lockingVaultABI = LockingVaultAbi;
export const vestingVaultABI = VestingVaultAbi;

export type MappedProposalOffChainData = {
  proposalId: string;
  title: string;
  description: string;
  calldatas: string[];
  targets: string[];
};

export type ProposalOffChainData = {
  [proposalId: string]: {
    descriptionURL: string;
    targets: string[];
    calldatas: string[];
    title: string;
    sentenceSummary: string;
    paragraphSummary: string;
  };
};

type Cursor = {
  block: number;
  log: number;
};

type VotingVault = {
  address: string;
  abi: ContractInterface;
  getDelegations: DelegationsGetter;
};

interface CouncilAdapterConfig {
  coreVotingAddress: string;
  tokenAddress: string;
  transports: TransportResolver;
  protocolName: string;
  votingVaults: VotingVault[];
  proposalsOffChainDataURL: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

export class CouncilAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter {
  private readonly coreVotingAddress: string;
  private readonly tokenAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly votingVaults: VotingVault[];
  private readonly proposalsOffChainDataURL: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: CouncilAdapterConfig) {
    this.coreVotingAddress = config.coreVotingAddress;
    this.tokenAddress = config.tokenAddress;
    this.transports = config.transports;
    this.protocolName = config.protocolName;
    this.votingVaults = config.votingVaults;
    this.proposalsOffChainDataURL = config.proposalsOffChainDataURL;
    this.chainId = config.chainId ?? 1;
    this.boardroomAPIKey = config.boardroomAPIKey;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getSnapshotSpaceName(): Promise<string> {
    return '';
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.coreVotingAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'council';
  }

  async getTokenAddress(): Promise<TokenAddress> {
    return this.tokenAddress;
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(CoreVotingAbi, ['proposal']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['vote'];
    return getFunctionsSelectorsWithInputs(CoreVotingAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(LockingVaultAbi, ['changeDelegation', 'deposit']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return this.coreVotingAddress;
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.votingVaults[0].address;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.coreVotingAddress;
  }

  private async getProposalsOffChainData(): Promise<MappedProposalOffChainData[]> {
    const resp = await this.transports('http').fetch(this.proposalsOffChainDataURL);
    const text = await resp.text();
    // Remove the import statement and export declarations
    let content = text.replace(/import { CouncilConfig } from "src\/config\/CouncilConfig";/, '');
    content = content.replace(/export const mainnetCouncilConfig: CouncilConfig = /, '');
    //delete comments
    content = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
    //enclose keys in double quotes
    content = content.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*:/g, '$1"$2":');
    //remove trailing commas
    content = content.replace(/,(?=\s*?[\]}])/g, '');
    //remove semicolon
    content = content.replace(';', '');
    const json = JSON.parse(content);
    const proposalsData: ProposalOffChainData = json.coreVoting.proposals;

    const proposalIds = Object.keys(proposalsData);
    const mappedProposals: any = [];
    proposalIds.forEach((proposalId: string) => {
      const proposalData = proposalsData[proposalId];
      mappedProposals.push({
        title: proposalData.title,
        description: proposalData.paragraphSummary,
        proposalId: proposalId,
        calldatas: proposalData.calldatas,
        targets: proposalData.targets,
      });
    });

    return mappedProposals;
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const coreVoting = new CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
    const results = await coreVoting.getProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const proposalsOffChainData = await this.getProposalsOffChainData();

    const contract = new Contract(this.coreVotingAddress, CoreVotingAbi, rpc);
    const baseQuorum = parseInt(ethers.utils.formatUnits(await contract.baseQuorum(), 18));

    const proposals = results.items.map((item: { parsed: ProposalCreated; event: Log }) =>
      mapProposal(item.parsed, ['YES', 'NO', 'MAYBE'], proposalsOffChainData, baseQuorum, item.event.transactionHash)
    );

    return { items: proposals, nextCursor: results.nextCursor };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const coreVoting = new CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
    const results = await coreVoting.getProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const events = results.items.map((i: LogResult<AnyProposalEvent>) => mapProposalEvent(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const block = blockHeight || (await rpc.getBlockNumber());
    let totalVotePowers: number[] = new Array(addresses.length).fill(0);
    for (const votingVault of this.votingVaults) {
      const contract = new Contract(votingVault.address, votingVault.abi, rpc);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calls: any[] = addresses.map((address) => {
        return this.vaultQueryVotePower(contract, address, block);
      });
      const powers = await Promise.all(calls);
      totalVotePowers = totalVotePowers.map((power, i) => power + powers[i]);
    }
    const info = totalVotePowers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: power };
    });
    return info;
  }

  // Vault contracts throw an error when the voting power is 0.
  // This function catches that case and returns 0 instead
  private async vaultQueryVotePower(contract: Contract, address: string, block: number | undefined) {
    try {
      const votingPower = await contract.queryVotePowerView(address, block);
      return parseFloat(formatUnits(votingPower));
    } catch {
      return 0;
    }
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const coreVoting = new CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
    const results = await coreVoting.getVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const votes = mapVotes(results.items);
    return { items: votes, nextCursor: results.nextCursor };
  }

  async getDelegationEvents(pagination: PaginationOptions = {}): Promise<DelegationEventPage> {
    const chainId = await this.getChainId();

    const vaultResultsItems: LogResult<VoteChange>[] = [];
    const vaultResultsCursors: string[] = [];
    for (const votingVault of this.votingVaults) {
      const contract = new VaultContract(votingVault.address, this.transports);
      const vaultResult = await contract.getDelegationEvents(
        chainId,
        votingVault.abi,
        pagination.cursor,
        pagination.startBlock,
        pagination.endBlock
      );
      vaultResultsItems.push(...vaultResult.items);
      if (vaultResult.nextCursor) {
        vaultResultsCursors.push(vaultResult.nextCursor);
      }
    }

    vaultResultsItems.sort((a, b) => {
      return a.event.blockNumber - b.event.blockNumber || a.event.logIndex - b.event.logIndex;
    });
    const events = vaultResultsItems.map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i));
    const nextCursor = vaultResultsCursors.length ? this.getLatestCursor(vaultResultsCursors) : undefined;
    return { items: events, nextCursor: nextCursor };
  }

  private getLatestCursor(cursors: string[]) {
    const decodedCursors: Cursor[] = cursors.map((cursor) => decodeCursor(cursor) as Cursor);
    //sort cursors first by block, and then by log -- ascending order
    decodedCursors.sort((a: Cursor, b: Cursor) => {
      return a.block - b.block || a.log - b.log;
    });
    const decodedLatestCursor = decodedCursors[decodedCursors.length - 1];
    return encodeCursor(decodedLatestCursor);
  }

  async getDelegation(address: string): Promise<string> {
    // Since one address can delegate to multiple addresses this method signature doesn't work.
    throw new Error('getDelegation is not supported for the Council framework. Use getDelegations method instead.');
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const delegations = [];
    for (const votingVault of this.votingVaults) {
      const abi = votingVault.abi;
      const vaultDelegations = await votingVault.getDelegations(addresses, abi, votingVault.address, rpc);
      delegations.push(...vaultDelegations);
    }
    return delegations;
  }

  // Currently only works on the LockingVault, as that is the most used one (by a 10x factor).
  // Adding new vaults would require changes on the frontend.
  async delegateVotingPower(delegatee: string, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const signerAddress = await signer.getAddress();
    const lockingVaultContract = new Contract(this.votingVaults[0].address, LockingVaultAbi, signer);
    const currentDelegate = await lockingVaultContract.deposits(signerAddress)[0]; //get 'who' attribute
    const signerHasDelegatedBefore = currentDelegate != constants.AddressZero;
    let res;
    if (signerHasDelegatedBefore) {
      res = await lockingVaultContract.changeDelegation(delegatee);
    } else {
      const tokenContract = new Contract(this.tokenAddress, TokenAbi, signer);

      //all the signer's tokens will be delegated
      const amount = await tokenContract.balanceOf(signerAddress);
      const formattedAmount = BigNumber.from(amount).toString();
      await tokenContract.approve(signerAddress);
      res = await lockingVaultContract.deposit(signerAddress, formattedAmount, delegatee);
    }

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateCouncil',
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

  async getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.coreVotingAddress;
    const contract = new Contract(governanceAddress, CoreVotingAbi, rpc);
    const functionSignature = contract.interface.getSighash('vote');
    const votingVaultsAddresses = this.votingVaults.map((votingVault) => {
      return votingVault.address;
    });
    const encodedData = contract.interface.encodeFunctionData(functionSignature, [
      votingVaultsAddresses,
      [],
      parseInt(proposalId, 10),
      choice,
    ]);
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.coreVotingAddress, CoreVotingAbi, signer);
    const votingVaultsAddresses = this.votingVaults.map((votingVault) => {
      return votingVault.address;
    });
    const res = await contract.vote(votingVaultsAddresses, [], parseInt(proposalId, 10), choice);

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteCouncil',
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

  async getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]> {
    return [];
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalIdFromEvent(): Promise<string> {
    throw new Error('Function not defined for this adapter');
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error('Function not defined for this adapter');
  }
}
