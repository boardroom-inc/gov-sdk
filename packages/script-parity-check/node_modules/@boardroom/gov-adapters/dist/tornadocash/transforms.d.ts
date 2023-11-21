import { DelegationEvent, Proposal, ProposalEvent, ProposalPage, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { DelegateChangeEvents, ProposalCreated, Voted } from './contract';
/**
 * Map a compound ProposalCreated event into a governance Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], blockNumber: number, txHash: string) => Proposal;
/**
 * Convert voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<Voted>[]) => Vote[];
/**
 * Map Tornado Cash proposal states to boardroom event formats
 */
export declare const mapProposalEvents: (items: number[], proposals: ProposalPage) => ProposalEvent[];
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
