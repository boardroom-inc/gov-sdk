import { Static, Type } from '@sinclair/typebox';
import { ChainId, Framework, Time } from './common';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { Web3Provider } from '@ethersproject/providers';

/**
 * Request ID used to check the status of a create proposal transaction
 */
export type CreateProposalRequestId = string;
export const CreateProposalRequestId = Type.String();

export type ProposalTimeFormat = 'blockNumber' | 'timestamp';
export const ProposalTimeFormat = Type.Union([Type.Literal('blockNumber'), Type.Literal('timestamp')]);

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
  createProposal: (
    proposal: CreateProposalPayload,
    isContractWallet?: boolean,
    identifier?: string,
    web3?: Web3Provider
  ) => Promise<CreateProposalRequestId>;
  getCanonicalProposalTimeFormat: () => Promise<ProposalTimeFormat>;
  getChainId: () => Promise<ChainId>;
}

export const createProposalAdapterValidators: ResponseValidator<CreateProposalAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  createProposal: compileAdapterValidator(CreateProposalRequestId),
  getCanonicalProposalTimeFormat: compileAdapterValidator(ProposalTimeFormat),
  getChainId: compileAdapterValidator(ChainId),
};
