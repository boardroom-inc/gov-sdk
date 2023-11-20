import { Web3Provider } from '@ethersproject/providers';
import { Type } from '@sinclair/typebox';
import { ProposalType } from '@boardroom/snapshot.js/dist/sign/types';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId, Framework, Address, VoteFunctionsSelectors } from './common';


/**
 * Request ID used to check the status of a cast vote transaction
 */
export type CastVoteRequestId = string;
export const CastVoteRequestId = Type.String();

export type CastVoteData = {
  proposalId: string;
  choice: number | number[] | string;
  power: number;
  proposalRefId?: string;
  identifier?: string;
  adapter?: string;
  isContractWallet?: boolean;
  reason?: string;
  web3?: Web3Provider;
  type?: ProposalType;
  isPrivate?: boolean;
};

export type CastVoteEncodedResponse = {
  encodedData: string;
  toContractAddress: string;
};

export type CastVoteEncodedData = {
  proposalId: string;
  choice: number;
  address: string;
  reason?: string;
};

export const CastVoteEncodedResponse = Type.Object({
  encodedData: Type.String(),
  toContractAddress: Type.String(),
});

/**
 * Expose a method to cast a vote on a proposal
 */
export interface VoteAdapter {
  getFramework: () => Promise<Framework>;
  castVote: (props: CastVoteData) => Promise<CastVoteRequestId>;
  getChainId: () => Promise<ChainId>;
  getVotingFunctionsSelectors: () => Promise<VoteFunctionsSelectors>;
  getVotingContractAddress: () => Promise<Address>;
  getEncodedCastVoteData: (props: CastVoteEncodedData) => Promise<CastVoteEncodedResponse>;
}

export const voteAdapterValidators: ResponseValidator<VoteAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  castVote: compileAdapterValidator(CastVoteRequestId),
  getChainId: compileAdapterValidator(ChainId),
  getVotingFunctionsSelectors: compileAdapterValidator(VoteFunctionsSelectors),
  getVotingContractAddress: compileAdapterValidator(Address),
  getEncodedCastVoteData: compileAdapterValidator(CastVoteEncodedResponse),
};
