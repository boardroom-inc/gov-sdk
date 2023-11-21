import { ResponseValidator } from '../validation';
import { CallData } from './create-on-chain-proposal';
export declare type RequestId = string;
export declare const RequestId: import("@sinclair/typebox").TString;
export declare type TimeDelay = number;
export declare const TimeDelay: import("@sinclair/typebox").TNumber;
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
export declare const proposalExecutionAdapterValidators: ResponseValidator<ProposalExecutionAdapter>;
