import { Web3Provider } from '@ethersproject/providers';
import { ProposalType } from '@boardroom/snapshot.js/dist/sign/types';
import { ResponseValidator } from '../validation';
import { ChainId, Framework, Address, VoteFunctionsSelectors } from './common';
/**
 * Request ID used to check the status of a cast vote transaction
 */
export declare type CastVoteRequestId = string;
export declare const CastVoteRequestId: import("@sinclair/typebox").TString;
export declare type CastVoteData = {
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
export declare type CastVoteEncodedResponse = {
    encodedData: string;
    toContractAddress: string;
};
export declare type CastVoteEncodedData = {
    proposalId: string;
    choice: number;
    address: string;
    reason?: string;
};
export declare const CastVoteEncodedResponse: import("@sinclair/typebox").TObject<{
    encodedData: import("@sinclair/typebox").TString;
    toContractAddress: import("@sinclair/typebox").TString;
}>;
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
export declare const voteAdapterValidators: ResponseValidator<VoteAdapter>;
