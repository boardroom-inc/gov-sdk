import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { ProposalCreated, ProposalContent, VoteEmitted, DelegateChangeEvents, AnyProposalEvent } from './contract-v2';
/**
 * Map an aave ProposalCreated event into an interop Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, content: ProposalContent, quorum: number, txHash: string) => Proposal;
/**
 * Convert an aave vote event into our interop vote model
 */
export declare const mapVotes: (logs: LogResult<VoteEmitted>[]) => Vote[];
/**
 * Convert an aave proposal event into our interop event model
 */
export declare const mapProposalEvents: (logs: LogResult<AnyProposalEvent>[]) => ProposalEvent[];
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
