import {
  PaginationOptions,
  Proposal,
  ProposalPage,
  ProposalsAdapter,
  VoteAdapter,
  TransportResolver,
  Vote,
  VotePage,
  decodeCursor,
  encodeCursor,
  ExternalLink,
  ProposalEventPage,
  VotePowerAdapter,
  VotePowerInfo,
  ProposalTimeFormat,
  CreateProposalPayload,
  CreateProposalAdapter,
  DelegationAdapter,
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  TokenAddress,
  DelegationEvent,
  BalanceInfo,
  CastVoteData,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
} from '@boardroom/gov-lib';
import snapshotDelegatorAbi from './abi-delegator.json';
import Client712 from '@boardroom/snapshot.js/dist/sign';
import utils from '@boardroom/snapshot.js/dist/utils';
import { SnapshotGraphAPI, SnapshotGraphProposal, SnapshotGraphSpace } from './graph';
import groupBy from 'lodash/groupBy';
import { ethers, Contract, Signer } from 'ethers';
import { Interface, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import gnosisSafeAbi from '../gnosis/abi-gnosis-safe.json';
import { Provider } from 'ethers-multicall';
import { DelegateChangeEvents, SnapshotDelegatorContract } from './contract';
import { mapDelegationEvents } from './transforms';
import { LogResult } from '../rpc';
import { Strategy } from '@boardroom/snapshot.js/dist/voting/types';
import { Web3Provider } from '@ethersproject/providers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { init, encrypt } = require('@shutter-network/shutter-crypto');

// The hard coded value that Gnosis Safe contract's isValidSignature method returns if the message was signed
// https://github.com/gnosis/safe-contracts/blob/dec13f7cdab62056984343c4edfe40df5a1954dc6/contracts/handler/CompatibilityFallbackHandler.sol#L19
const GNOSIS_VALID_SIGNATURE_MAGIC_VALUE = '0x1626ba7e';
const GNOSIS_SAFE_SIGN_MESSAGE_EVENT_NAME = 'SignMsg';

/**
 * contents of our synthesized cursor
 */
interface CursorPayload {
  offset: number;
}

interface VotesCursorPayload {
  created: number;
  offset?: number;
}

interface TxnReceipt {
  ipfs: string;
  id: string;
  relayer: {
    address: string;
    receipt: string;
  };
}

/** handle some odd data that comes back from snapshot */
export const normalizeSnapshot = (snapshot: string | undefined): number => {
  // some goof balls put in absurdly large numbers for the snapshot (block)
  // number, so large it overflows a 32-bit (signed) integer. We cap at that
  // limit, which gives us a runway of over 1000 years of 15 second blocks,
  // which is likely enough for now
  const maxBlockNumber = 2147483647; // 2^31 - 1,
  const blockNumber = Math.floor(Math.min(maxBlockNumber, Number(snapshot ?? 1)));
  return blockNumber;
};

/**
 * Project snapshot's graph response into interop proposal shape
 */
export const mapGraphProposal = (ssProposal: SnapshotGraphProposal): Proposal => {
  const scores = ssProposal.scores?.map((score, index) => ({
    choice: `${index}`,
    total: `${score}`,
  }));

  return {
    id: ssProposal.id,
    title: ssProposal.title,
    proposer: ssProposal.author,
    choices: ssProposal.choices,
    content: ssProposal.body,
    externalUrl: `https://snapshot.org/#/${ssProposal.space.id}/proposal/${ssProposal.id}`,
    startTime: { timestamp: ssProposal.start },
    endTime: { timestamp: ssProposal.end },
    blockNumber: normalizeSnapshot(ssProposal.snapshot),
    type: ssProposal.type,
    scores,
    privacy: ssProposal.privacy ? ssProposal.privacy : '',
    quorum: Math.round(ssProposal.quorum),
    flagged: ssProposal.flagged,
  };
};

interface SnapshotAdapterConfig {
  spaceName: string;
  transports: TransportResolver;
  cname: string;
  chainId?: number;
  snapshotApiKey?: string;
  boardroomAPIKey?: string;
}

/**
 * Implement the proposals adapter via the snapshot API
 */
export class SnapshotAdapter
  implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, CreateProposalAdapter, DelegationAdapter {
  private readonly baseUrl: string;
  private readonly graph: SnapshotGraphAPI;
  private readonly protocolName: string;
  private readonly snapshotDelegatorAddress = '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446';

  private readonly spaceName: string;
  private readonly transports: TransportResolver;
  private readonly cname: string;
  private readonly chainId?: number;
  private readonly snapshotApiKey?: string;
  private readonly boardroomAPIKey?: string;

  constructor(config: SnapshotAdapterConfig) {
    this.spaceName = config.spaceName;
    this.transports = config.transports;
    this.cname = config.cname;
    this.chainId = config.chainId ?? 1;
    this.snapshotApiKey = config.snapshotApiKey;
    this.boardroomAPIKey = config.boardroomAPIKey;

    this.baseUrl = 'https://hub.snapshot.org/api';
    this.graph = new SnapshotGraphAPI(this.transports, this.snapshotApiKey);
    this.protocolName = this.cname;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getTokenAddress(): Promise<TokenAddress> {
    throw new Error("Snapshot adapters don't have a token address");
  }

  async getFramework(): Promise<Framework> {
    return 'snapshot';
  }

  async getSnapshotSpaceName(): Promise<string> {
    return this.spaceName;
  }

  //snapshot has no smart contract
  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    return [];
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    return {};
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    return [];
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return '';
  }

  async getDelegationContractAddress(): Promise<string> {
    return '';
  }

  async getVotingContractAddress(): Promise<string> {
    return '';
  }

  async delegateVotingPower(delegatee: string, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.snapshotDelegatorAddress, snapshotDelegatorAbi, signer);

    // If no spaceName is set then delegating enables delegation for *all* spaces
    const spaceNameBytes = ethers.utils.formatBytes32String(this.spaceName);
    const res = await contract.setDelegate(spaceNameBytes, delegatee);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateSnapshot',
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
    const governor = new SnapshotDelegatorContract(this.snapshotDelegatorAddress, this.transports);
    const results = await governor.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items
      .map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i))
      .filter((e) => {
        try {
          if (this.spaceName === ethers.utils.parseBytes32String(e.snapshotId)) {
            return true;
          }
          return false;
        } catch (err) {
          return false;
        }
      });

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.snapshotDelegatorAddress, snapshotDelegatorAbi, rpc);
    const spaceNameBytes = ethers.utils.formatBytes32String(this.spaceName);
    return await contract.delegation(address, spaceNameBytes);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.snapshotDelegatorAddress, snapshotDelegatorAbi, rpc);
    const spaceNameBytes = ethers.utils.formatBytes32String(this.spaceName);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.delegation(address, spaceNameBytes));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Snapshot.org',
      url: `https://snapshot.org/#/${this.spaceName}`,
    };
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const { cursor, limit, status, proposalIds } = pagination;
    const offset = decodeCursor<CursorPayload>(cursor)?.offset ?? 0;

    const { proposals } = await this.graph.getProposalsBySpace(this.spaceName, offset, limit, status, proposalIds);

    // next cursor is just the used offset + how many we got back
    const nextCursor = proposals.length
      ? encodeCursor<CursorPayload>({ offset: offset + proposals.length })
      : undefined;

    const mapped = proposals.map(mapGraphProposal);
    const page = { nextCursor, items: mapped };

    return page;
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalIdFromEvent(): Promise<string> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalEvents(): Promise<ProposalEventPage> {
    // snapshot does not have proposal events
    return { items: [] };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const { cursor, limit = 200, proposalIds } = pagination;
    const pCursor = decodeCursor<VotesCursorPayload>(cursor);
    const lastCreatedAt = pCursor?.created ?? 0;
    const offset = pCursor?.offset ?? 0;

    let resp;
    if (proposalIds && proposalIds.length === 1) {
      resp = await this.graph.getVotesForProposal(
        this.spaceName,
        proposalIds[0].toString(),
        lastCreatedAt,
        limit,
        offset
      );
    } else {
      resp = await this.graph.getVotes(this.spaceName, lastCreatedAt, limit, offset);
    }

    const { votes } = resp;

    // our GetVotesResponse (and code downstream of this method) assume proposal
    // is not null, but the graph schema does allow for it to be nullable. To
    // avoid having to narrow and filter in the rest of the codebase, we're
    // filtering here at the adapter implementation level
    const filteredVotesForNullProposalId = votes.filter((v) => v.proposal !== null);

    // a map from (proposal, voter) -> Vote, this is our final output
    const projectedVotes = new Map<string, Vote>();

    // Group all fetched votes by proposal so we can resolve the scores with the
    // proposal-specific network, snapshot, and strategies
    const grouped = groupBy(filteredVotesForNullProposalId, (v) => v.proposal.id);
    for (const votes of Object.values(grouped)) {
      // project all votes in this batch to interop model
      for (const vote of votes) {
        const power = vote.vp;
        if (power === undefined) {
          console.warn(
            `unresolved voter power for space:${this.spaceName} voter:${vote.voter} proposal:${vote.proposal.id}`
          );
          continue;
        }

        let voteChoice = vote.choice;
        if (vote.proposal.privacy === 'shutter' && vote.choice.toString().startsWith('0x')) {
          voteChoice = -1;
        }

        // Handle when vote choice arrays have number strings in them.
        if (Array.isArray(voteChoice)) {
          const tempArray = [];
          for (const choice of voteChoice) {
            tempArray.push(Number(choice));
          }
          voteChoice = tempArray;
        }

        const sdkVote: Vote = {
          power,
          address: vote.voter,
          proposalId: vote.proposal.id,
          choice: voteChoice,
          time: { timestamp: Number(vote.created) },
          privacy: vote.proposal.privacy,
          reason: vote.reason,
        };

        projectedVotes.set(`${vote.proposal.id}:${vote.voter}`, sdkVote);
      }
    }

    // Now w/ all the scores resolved after grouping by proposal, project the
    // originally resolved votes into our computed interop models (to preserve
    // order). We could have holes in the case of score computation not working,
    // so we cull those as well

    const sdkVotes = filteredVotesForNullProposalId
      .map((v) => projectedVotes.get(`${v.proposal.id}:${v.voter}`) ?? null)
      .filter((v): v is Vote => v !== null);

    // use the last "created" value in our cursor to resume stream next request
    let nextCursor: string | undefined = undefined;
    if (votes.length) {
      const last = votes[votes.length - 1];

      // if the timestamps are the same, we need to use offset to further the
      // stream head or it will never get past this "chunk"
      const offset = last.created === lastCreatedAt ? votes.length : 0;

      nextCursor = encodeCursor<VotesCursorPayload>({ created: last.created, offset });
    }

    return { items: sdkVotes, nextCursor };
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error('Function not defined for this adapter');
  }

  async getEncodedCastVoteData(): Promise<CastVoteEncodedResponse> {
    throw new Error('Snapshot does not support encoded cast vote data');
  }

  async castVote(params: CastVoteData): Promise<string> {
    const {
      proposalId,
      choice,
      power,
      proposalRefId,
      identifier,
      adapter,
      isContractWallet,
      reason,
      web3,
      type,
      isPrivate,
    } = params;

    if (web3 && type) {
      const [account] = await web3.listAccounts();

      let hub = 'https://hub.snapshot.org';
      if (isContractWallet) {
        console.log('Contract wallet detected');
        hub = 'https://relayer.snapshot.org';
      }
      const client = new Client712(hub);

      let receipt;
      if (isPrivate) {
        const encryptedChoice = await this._encryptChoice(JSON.stringify(choice), proposalId);
        receipt = await client.vote(web3, account, {
          space: this.spaceName,
          proposal: proposalId,
          type: type,
          choice: encryptedChoice,
          reason,
          privacy: 'shutter',
          app: 'boardroom',
        });
      } else {
        receipt = await client.vote(web3, account, {
          space: this.spaceName,
          proposal: proposalId,
          type: type,
          choice: choice,
          reason,
          app: 'boardroom',
        });
      }

      try {
        const apiCalls = Promise.all([
          this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
            protocol: this.protocolName,
            action: 'castVoteSnapshot',
            hashId: (receipt as TxnReceipt).ipfs,
            proposalId: proposalId,
            userAddress: account,
            identifier,
            separateAction: 'castVote',
            separateFramework: await this.getFramework(),
          }),

          this.transports('http').postJson(
            `https://api.boardroom.info/v1/voters/addOrUpdatePendingVote?key=${this.boardroomAPIKey}`,
            {
              cname: this.protocolName,
              choices: choice,
              address: account,
              txnHash: (receipt as TxnReceipt).ipfs,
              status: 'success',
              power,
              proposalRefId,
              adapter: adapter || 'snapshot',
            }
          ),
        ]);
        await apiCalls;
      } catch (err) {
        console.log(err);
      }

      return (receipt as TxnReceipt).ipfs;
    } else {
      throw new Error('Snapshot votes must provide a ProposalType and a Web3Provider');
    }
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const space = await this.graph.getSpace(this.spaceName);
    const info = [] as VotePowerInfo[];
    for (const address of addresses) {
      try {
        const result = await this._getScoresAtBlock(
          [address],
          this.spaceName,
          space.strategies as Strategy[],
          space.network,
          blockHeight ?? 'latest'
        );
        for (const r of result) {
          if (r.length === 2) {
            const votePowerInfo = {
              protocol: this.protocolName,
              address,
              power: r[1],
            };
            info.push(votePowerInfo);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    return info;
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const space = await this.graph.getSpace(this.spaceName);
    const info = [] as VotePowerInfo[];

    // Use all strategies except the delegation strategy as delegated power
    // does not get passed on to the account that they are delegating to.
    const strategies = space.strategies.filter((s) => s.name !== 'delegation');
    for (const address of addresses) {
      try {
        const result = await this._getScoresAtBlock(
          [address],
          this.spaceName,
          strategies as Strategy[],
          space.network,
          blockHeight ?? 'latest'
        );
        for (const r of result) {
          if (r.length === 2) {
            const votePowerInfo = {
              address,
              power: r[1],
              protocol: this.protocolName,
            };
            info.push(votePowerInfo);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    return info;
  }

  async getCanonicalProposalTimeFormat(): Promise<ProposalTimeFormat> {
    return 'timestamp';
  }

  async createProposal(
    { title, content, choices, startTime, endTime, blockNumber }: CreateProposalPayload,
    isContractWallet?: boolean,
    identifier?: string,
    web3?: Web3Provider
  ): Promise<string> {
    if (web3) {
      if ('blockNumber' in startTime || 'blockNumber' in endTime) {
        throw new Error('blockNumber time format not yet supported for proposal start/end dates');
      }

      let hub = 'https://hub.snapshot.org';
      if (isContractWallet) {
        hub = 'https://relayer.snapshot.org';
      }
      const client = new Client712(hub);

      const [account] = await web3.listAccounts();

      const receipt = await client.proposal(web3, account, {
        space: this.spaceName,
        type: 'single-choice',
        title: title,
        body: content,
        choices: choices,
        start: startTime.timestamp,
        end: endTime.timestamp,
        snapshot: blockNumber,
        plugins: JSON.stringify({}),
        discussion: '',
        app: 'boardroom',
      });

      try {
        await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'createProposalSnapshot',
          hashId: receipt,
          userAddress: account,
          identifier,
          separateAction: 'createProposal',
          separateFramework: await this.getFramework(),
        });
      } catch (err) {
        console.log(err);
      }

      return (receipt as TxnReceipt).ipfs;
    } else {
      throw new Error('Must provide Web3Provider for creating snapshot proposals');
    }
  }

  private async _getScoresAtBlock(
    addresses: string[],
    space: string,
    strategies: Strategy[],
    network: string,
    blockNumber: string | number
  ): Promise<Map<string, number>> {
    let url = `https://score.snapshot.org`;
    if (this.snapshotApiKey) {
      url = `https://score.snapshot.org/?apiKey=${this.snapshotApiKey}`;
    }

    const scores = await utils.getScores(
      space,
      strategies,
      network,
      addresses,
      blockNumber === 'latest' ? 'latest' : Number(blockNumber),
      url
    );

    // reduce the the scores from all the diff strategies into a map from
    // address -> total power
    const scoresByAddress = new Map<string, number>();
    for (const scoredStrategy of scores) {
      for (const [address, power] of Object.entries(scoredStrategy)) {
        scoresByAddress.set(address, (scoresByAddress.get(address) ?? 0) + Number(power));
      }
    }

    return scoresByAddress;
  }

  private async _getScores(addresses: string[], space: string, proposal?: string) {
    const promises = addresses.map((address) => this.graph.getScores(address, space, proposal));
    const vpArray: VotePowerInfo[] = [];

    const results = await Promise.all(promises);

    for (const result of results) {
      vpArray.push(result);
    }

    return vpArray;
  }

  // Based on snapshots implementation here https://github.com/snapshot-labs/snapshot/blob/develop/src/helpers/shutter.ts
  private async _encryptChoice(choice: string, id: string): Promise<string> {
    await init('https://snapshot.org/assets/shutter-crypto.247202d0.wasm');

    const bytesChoice = toUtf8Bytes(choice);
    const message = ethers.utils.arrayify(bytesChoice);
    const eonPublicKey = ethers.utils.arrayify(
      '0x0e6493bbb4ee8b19aa9b70367685049ff01dc9382c46aed83f8bc07d2a5ba3e6030bd83b942c1fd3dff5b79bef3b40bf6b666e51e7f0be14ed62daaffad47435265f5c9403b1a801921981f7d8659a9bd91fe92fb1cf9afdb16178a532adfaf51a237103874bb03afafe9cab2118dae1be5f08a0a28bf488c1581e9db4bc23ca'
    );

    const is32ByteString = id.substring(0, 2) === '0x';
    const proposalId = ethers.utils.arrayify(is32ByteString ? id : ethers.utils.formatBytes32String(id));

    const sigma = ethers.utils.arrayify(ethers.BigNumber.from(ethers.utils.randomBytes(32)));

    const encryptedMessage = await encrypt(message, eonPublicKey, proposalId, sigma);

    return ethers.utils.hexlify(encryptedMessage) ?? null;
  }

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    return [];
  }
}
