import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, SubmitProposal, SubmitVote } from './contract';
/**
 * Given some markdown-ish payload, extract the title and content
 */
export declare const extractTitle: (description: string, defaultTitle: string) => {
    title: string;
    content: string;
};
/**
 * Map a Moloch SubmitProposal event into a governance Proposal model
 */
export declare const mapProposal: (event: SubmitProposal, choices: string[], blockNumber: number, summoningTime: number, periodDuration: number, votingPeriodLength: number, startingPeriod: string, txHash: string) => Proposal;
/**
 * Convert voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<SubmitVote>[], powerMap: number[]) => Vote[];
/**
 * Convert a moloch proposal event into our interop model
 */
export declare const mapProposalEvents: (log: LogResult<AnyProposalEvent>) => ProposalEvent;
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
