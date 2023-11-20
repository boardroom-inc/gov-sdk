import { Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { CallData } from './create-on-chain-proposal';

export type RequestId = string;
export const RequestId = Type.String();

export type TimeDelay = number;
export const TimeDelay = Type.Number();

export interface ExecutionPayload {
  targets: string[];
  values: number[];
  calldata: CallData[];
  descriptionHash: string;
}

/**
 * Expose a method to create a proposal and get canonical proposal time format
 */
export interface ProposalExecutionAdapter {
  queueProposal: (payload: ExecutionPayload) => Promise<RequestId>;
  executeProposal: (payload: ExecutionPayload) => Promise<RequestId>;
  cancelProposal: (payload: ExecutionPayload) => Promise<RequestId>;
  getTimeDelay: () => Promise<TimeDelay>;
}

export const proposalExecutionAdapterValidators: ResponseValidator<ProposalExecutionAdapter> = {
  queueProposal: compileAdapterValidator(RequestId),
  executeProposal: compileAdapterValidator(RequestId),
  cancelProposal: compileAdapterValidator(RequestId),
  getTimeDelay: compileAdapterValidator(TimeDelay),
};
