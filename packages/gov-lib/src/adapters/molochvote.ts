import { Static, Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';

/**
 * Request ID used to check the status of a cast vote transaction
 */
export type CastVoteRequestId = string;
export const CastVoteRequestId = Type.String();

/**
 * Expose a method to cast a vote on a proposal
 */
export interface MolochVoteAdapter {
  getFramework: () => Promise<Framework>;
  submitVote: (proposalId: string, choice: number, identifier?: string) => Promise<CastVoteRequestId>;
  getChainId: () => Promise<ChainId>;
}

export const voteAdapterValidators: ResponseValidator<MolochVoteAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  submitVote: compileAdapterValidator(CastVoteRequestId),
  getChainId: compileAdapterValidator(ChainId),
};
