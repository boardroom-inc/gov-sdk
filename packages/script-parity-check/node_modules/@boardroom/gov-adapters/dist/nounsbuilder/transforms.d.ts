import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { DelegateChangeEvents, ProposalCreated, VoteCast, AnyProposalEvent } from './contract';
import { VoteCast as VoteCastBravo } from './contract';
export declare const extractTitle: (description: string, defaultTitle: string) => {
    title: string;
    content: string;
};
/**
 * Map a nounsBuilder ProposalCreated event into interop Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], blockNumber: number, quorum: number, txHash: string) => Proposal;
/**
 * Convert NounsBuilder voting event logs into interop Votes
 */
export declare const mapVotes: (logs: LogResult<VoteCast | VoteCastBravo>[]) => Vote[];
/**
 * Convert a NounsBuilder proposal event into our interop model
 */
export declare const mapProposalEvent: (log: LogResult<AnyProposalEvent>) => ProposalEvent;
/**
 * Convert a NounsBuilder delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
