import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { ProposalCreated, Voted, DelegateChangeEvents, AnyProposalEvent } from './coreContract';
import { MappedProposalOffChainData } from './adapter';
/**
 * Map a ProposalCreated event into interop Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], proposalsOffChainData: MappedProposalOffChainData[], quorum: number, txHash: string) => Proposal;
/**
 * Convert voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<Voted>[]) => Vote[];
/**
 * Convert a Council proposal event into our interop model
 */
export declare const mapProposalEvent: (log: LogResult<AnyProposalEvent>) => ProposalEvent;
/**
 * Convert a Council delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
