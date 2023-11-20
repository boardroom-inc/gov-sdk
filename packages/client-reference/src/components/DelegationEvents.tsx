import { DelegationEvent, JsonRpcTransport, Protocol } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  rpc?: JsonRpcTransport;
}

export const DelegationEvents: FunctionComponent<Props> = ({ protocol, instance = 'default', rpc }) => {
  const [events, setEvents] = useState<DelegationEvent[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();

  const fetch = async () => {
    let latestBlock = await rpc.getBlockNumber();
    const maxBlocksToQuery = 2000;
    let delegationEventsNotFound = true;
    let resp;
    let items;
    while (delegationEventsNotFound) {
      resp = await protocol.adapter('delegation', instance).getDelegationEvents({
        cursor: undefined,
        limit: 10,
        startBlock: latestBlock - maxBlocksToQuery,
        endBlock: latestBlock,
      });
      latestBlock = latestBlock - maxBlocksToQuery;
      if (resp.items.length > 0 || latestBlock < 14000000) {
        delegationEventsNotFound = false;
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
      {events.length} delegation events fetched
      <br />
      cursor: {cursor ?? '[[none]]'}
      <div>
        <ul>
          {events.map((d) => (
            <li
              key={`${d.delegator} ${d.amount} ${d.fromDelegate} ${d.toDelegate} ${d.aaveDelegationType} ${d.eventType} ${d.txHash}`}
            >
              {d.delegator} - {d.eventType} - {d.amount} - {d.fromDelegate} - {d.toDelegate} - {d.txHash}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
