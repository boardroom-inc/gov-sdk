import { ChainId, Framework, Time } from './common';
import { ResponseValidator } from '../validation';
import { Web3Provider } from '@ethersproject/providers';
/**
 * Request ID used to check the status of a create proposal transaction
 */
export declare type CreateProposalRequestId = string;
export declare const CreateProposalRequestId: import("@sinclair/typebox").TString;
export declare type ProposalTimeFormat = 'blockNumber' | 'timestamp';
export declare const ProposalTimeFormat: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"blockNumber">, import("@sinclair/typebox").TLiteral<"timestamp">]>;
export interface CreateProposalPayload {
    title: string;
    content: string;
    choices: string[];
    startTime: Time;
    endTime: Time;
    blockNumber: number;
}
/**
 * Expose a method to create a proposal and get canonical proposal time format
 */
export interface CreateProposalAdapter {
    getFramework: () => Promise<Framework>;
    createProposal: (proposal: CreateProposalPayload, isContractWallet?: boolean, identifier?: string, web3?: Web3Provider) => Promise<CreateProposalRequestId>;
    getCanonicalProposalTimeFormat: () => Promise<ProposalTimeFormat>;
    getChainId: () => Promise<ChainId>;
}
export declare const createProposalAdapterValidators: ResponseValidator<CreateProposalAdapter>;
