import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { AnyProposalEvent, ProposalCreated, VoteCast } from './contract';
import { DelegateChangeEvents, VoteCast as VoteCastBravo } from './contract';
/**
 * Given some markdown-ish payload, extract the title and content
 */
export declare const extractTitle: (description: string, defaultTitle: string) => {
    title: string;
    content: string;
};
/**
 * Map a interest ProposalCreated event into a governance Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], quorum: number, txHash: string) => Proposal;
/**
 * Convert voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<VoteCast | VoteCastBravo>[]) => Vote[];
/**
 * Convert a interest proposal event into our interop model
 */
export declare const mapProposalEvent: (log: LogResult<AnyProposalEvent>) => ProposalEvent;
/**
 * Convert a interest delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
/**
 * Alpha -> Bravo upgrade made it so that "support" is a number instead of a
 * bool, this will normalize either into a number
 */
export declare const compoundChoice: (support: number | boolean) => number;
