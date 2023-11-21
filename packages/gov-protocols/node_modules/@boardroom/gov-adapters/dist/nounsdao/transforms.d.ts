import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, ProposalCreated, VoteCast } from './contract';
import { VoteCast as VoteCastBravo } from './contract';
/**
 * Given some markdown-ish payload, extract the title and content
 */
export declare const extractTitle: (description: string, defaultTitle: string) => {
    title: string;
    content: string;
};
/**
 * Map a nounsdao ProposalCreated event into a governance Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], quorum: number, txHash: string) => Proposal;
/**
 * Convert voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<VoteCast | VoteCastBravo>[]) => Vote[];
/**
 * Map NounsDAO proposal states to boardroom event formats
 */
export declare const mapProposalEvent: (log: LogResult<AnyProposalEvent>) => ProposalEvent;
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
