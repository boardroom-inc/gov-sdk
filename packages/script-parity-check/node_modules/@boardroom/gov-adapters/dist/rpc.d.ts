import { Log } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { LogDescription } from 'ethers/lib/utils';
import { JsonRpcTransport, PaginatedResponse } from '@boardroom/gov-lib';
/**
 * Query options
 */
export interface EventLogQuery {
    contract: Contract;
    rpc: JsonRpcTransport;
    events: string[];
    params?: (string | string[])[];
    cursor?: string;
}
/**
 * A parsed event log description is the etheres LogDescription type narrowed
 * to a specific set of args and string-as-const name (for narrowing in
 * business logic)
 */
export declare type ParsedEvent<T extends string = string, U = unknown> = Omit<LogDescription, 'args' | 'name'> & {
    name: T;
    args: U;
};
/**
 * A single result from queryEventLogs
 */
export declare type LogResult<T extends ParsedEvent> = {
    event: Log;
    parsed: T;
};
/**
 * Query an RPC endpoint for event logs
 *
 * TODO: this will only handle up to 10K logs in a response, and theres not a
 * way to specify a limit (just a block range).  Will need to update this to
 * accomodate reading large amounts of logs
 *
 * see: https://docs.alchemy.com/alchemy/guides/eth_getlogs#making-a-request-to-eth-get-logs
 */
export declare const queryEventLogs: <T extends ParsedEvent<string, unknown>>(query: EventLogQuery, startBlock?: number | undefined, endBlock?: number | undefined) => Promise<PaginatedResponse<LogResult<T>>>;
