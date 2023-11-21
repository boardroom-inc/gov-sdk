import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';
/**
 * Request ID used to check the status of a cast vote transaction
 */
export declare type CastVoteRequestId = string;
export declare const CastVoteRequestId: import("@sinclair/typebox").TString;
/**
 * Expose a method to cast a vote on a proposal
 */
export interface MolochVoteAdapter {
    getFramework: () => Promise<Framework>;
    submitVote: (proposalId: string, choice: number, identifier?: string) => Promise<CastVoteRequestId>;
    getChainId: () => Promise<ChainId>;
}
export declare const voteAdapterValidators: ResponseValidator<MolochVoteAdapter>;
