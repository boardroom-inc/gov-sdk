import { Log } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { LogDescription } from 'ethers/lib/utils';
import { decodeCursor, encodeCursor, JsonRpcTransport, PaginatedResponse } from '@boardroom/gov-lib';
import orderBy from 'lodash/orderBy';
import { uniswapEthersEventParseLogHotfix } from './uniswap-hotfix';

/*

  This module provides general utilities for interacting with an eth-like RPC
  node that can be used by adapters that source on-chain datda

*/

interface CursorPayload {
  /** block number */
  block: number;
  /** log index */
  log: number;
}

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
export type ParsedEvent<T extends string = string, U = unknown> = Omit<LogDescription, 'args' | 'name'> & {
  name: T;
  args: U;
};

/**
 * A single result from queryEventLogs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogResult<T extends ParsedEvent> = {
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
export const queryEventLogs = async <T extends ParsedEvent>(
  query: EventLogQuery,
  startBlock?: number,
  endBlock?: number
): Promise<PaginatedResponse<LogResult<T>>> => {
  // use the contract abstraction filter util to compute the event signature,
  // bit of a hack but makes it so we dont have to provide the entire sig and
  // keccak it ourselves
  const topics = query.events.flatMap((e) => (query.contract.filters[e]().topics ?? [])[0]);

  const cursor = decodeCursor<CursorPayload>(query.cursor);
  const fromBlock = cursor ? cursor.block - 1 : 1;

  let resp;
  if (startBlock !== undefined && endBlock !== undefined) {
    resp = await query.rpc.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: query.contract.address,
      topics: [topics, ...(query.params ?? [])],
    });
  } else {
    resp = await query.rpc.getLogs({
      fromBlock,
      toBlock: 'latest',
      address: query.contract.address,
      topics: [topics, ...(query.params ?? [])],
    });
  }

  // ensure event logs are alway sorted ascending
  let sorted = orderBy(resp, ['blockNumber', 'logIndex'], ['asc', 'asc']);

  // if a cursor was provided, ensure we filter out anything that as already
  // included in a previous pass
  if (cursor) {
    sorted = sorted.filter(
      (e) => e.blockNumber > cursor.block || (e.blockNumber === cursor.block && e.logIndex > cursor.log)
    );
  }

  // if there is at least one item, return a cursor, otherwise signal end by not
  // returning one
  let nextCursor: string | undefined = undefined;
  if (sorted.length > 0) {
    const lastItem = sorted[sorted.length - 1];
    nextCursor = encodeCursor<CursorPayload>({ block: lastItem.blockNumber, log: lastItem.logIndex });
  }

  // project the events into the parsed log and cursor
  const items = sorted.map<LogResult<T>>((event) => {
    try {
      return {
        event,
        parsed: query.contract.interface.parseLog(event) as T,
      };
    } catch (err) {
      // try again w/ the uniswap patch
      const patched = uniswapEthersEventParseLogHotfix(event.data);
      const parsed = query.contract.interface.parseLog({ ...event, data: patched }) as T;
      return { event, parsed };
    }
  });

  return { items, nextCursor };
};
