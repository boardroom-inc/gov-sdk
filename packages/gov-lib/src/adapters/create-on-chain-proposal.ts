import { Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';

/**
 * Request ID used to check the status of a create proposal transaction
 */
export type CreateOnChainProposalRequestId = string;
export const CreateOnChainProposalRequestId = Type.String();

export type ContractFunctions = string;
export const ContractFunctions = Type.String();

export type EncodedCallData = string;
export const EncodedCallData = Type.String();

export interface CreateOnChainProposalPayload {
  targets: string[];
  values: number[];
  signatures: string[];
  calldata: ProposalCreationCallData[];
  description: string;
  votingVaults?: string[];
  extraVaultData?: string[];
  lastCall?: number;
  choice?: number; //Council requires the proposer to vote on the proposal along with submission
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
  createOnChainProposal: (
    proposal: CreateOnChainProposalPayload,
    identifier?: string
  ) => Promise<CreateOnChainProposalRequestId>;
  getContractFunctions: (contractAddress: string) => Promise<ContractFunctions>;
  encodeCalldata: (data: CallData) => Promise<EncodedCallData>;
  getChainId: () => Promise<ChainId>;
}

export const createOnChainProposalAdapterValidators: ResponseValidator<CreateOnChainProposalAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  createOnChainProposal: compileAdapterValidator(CreateOnChainProposalRequestId),
  getContractFunctions: compileAdapterValidator(ContractFunctions),
  encodeCalldata: compileAdapterValidator(EncodedCallData),
  getChainId: compileAdapterValidator(ChainId),
};
