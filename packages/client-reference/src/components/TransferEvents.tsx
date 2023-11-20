import { JsonRpcTransport, Protocol, TransferEvent } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  rpc?: JsonRpcTransport;
}

export const TransferEvents: FunctionComponent<Props> = ({ protocol, instance = 'default', rpc }) => {
  const [events, setEvents] = useState<TransferEvent[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();

  const fetch = async () => {
    let latestBlock = await rpc.getBlockNumber();
    const maxBlocksToQuery = 2000;
    let transferEventsNotFound = true;
    let resp;
    let items;
    while (transferEventsNotFound) {
      resp = await protocol.adapter('general', instance).getTransferEvents({
        cursor: undefined,
        limit: 10,
        startBlock: latestBlock - maxBlocksToQuery,
        endBlock: latestBlock,
      });
      latestBlock = latestBlock - maxBlocksToQuery;
      if (resp.items.length > 0 || latestBlock < 14000000) {
        transferEventsNotFound = false;
        items = resp.items.slice(0, 5);
      }
      if (protocol.cname === 'makerdao') {
        break;
      }
    }

    setEvents((props) => [...props, ...items]);
    setCursor((c) => resp.nextCursor ?? c);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <button onClick={() => fetch()}>fetch</button>
      {events.length} transfer events fetched
      <br />
      cursor: {cursor ?? '[[none]]'}
      <div>
        <ul>
          {events.map((e) => (
            <li key={`${e.from} ${e.to} ${e.txHash} ${e.value}`}>
              {e.from} - {e.to} - {e.txHash} - {e.value}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
