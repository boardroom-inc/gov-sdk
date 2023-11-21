import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';
/**
 * Request ID used to check the status of a create proposal transaction
 */
export declare type CreateOnChainProposalRequestId = string;
export declare const CreateOnChainProposalRequestId: import("@sinclair/typebox").TString;
export declare type ContractFunctions = string;
export declare const ContractFunctions: import("@sinclair/typebox").TString;
export declare type EncodedCallData = string;
export declare const EncodedCallData: import("@sinclair/typebox").TString;
export interface CreateOnChainProposalPayload {
    targets: string[];
    values: number[];
    signatures: string[];
    calldata: ProposalCreationCallData[];
    description: string;
    votingVaults?: string[];
    extraVaultData?: string[];
    lastCall?: number;
    choice?: number;
    emergency?: boolean;
}
export interface ProposalCreationCallData {
    type: string;
    values: any[];
}
export interface CallData {
    types: string[];
    values: any[];
}
/**
 * Expose a method to create a proposal and get canonical proposal time format
 */
export interface CreateOnChainProposalAdapter {
    getFramework: () => Promise<Framework>;
    createOnChainProposal: (proposal: CreateOnChainProposalPayload, identifier?: string) => Promise<CreateOnChainProposalRequestId>;
    getContractFunctions: (contractAddress: string) => Promise<ContractFunctions>;
    encodeCalldata: (data: CallData) => Promise<EncodedCallData>;
    getChainId: () => Promise<ChainId>;
}
export declare const createOnChainProposalAdapterValidators: ResponseValidator<CreateOnChainProposalAdapter>;
