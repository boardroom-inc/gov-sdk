import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ClearDelegate = ParsedEvent<'ClearDelegate', {
    delegator: string;
    id: string;
    delegate: string;
}>;
export declare type SetDelegate = ParsedEvent<'SetDelegate', {
    delegator: string;
    id: string;
    delegate: string;
}>;
export declare type DelegateChangeEvents = ClearDelegate | SetDelegate;
export declare class SnapshotDelegatorContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
}
