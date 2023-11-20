import { ProposalEvent, Protocol } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
}

export const ProposalEvents: FunctionComponent<Props> = ({ protocol, instance = 'default' }) => {
  const [events, setEvents] = useState<ProposalEvent[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [dupes, setDupes] = useState(0);

  const fetch = async () => {
    const resp = await protocol.adapter('proposals', instance).getProposalEvents({ cursor, limit: 10 });
    const filtered = resp.items.filter(
      (i) => !events.find((p) => p.proposalId === i.proposalId && p.state === i.state)
    );
    setDupes((n) => n + (resp.items.length - filtered.length));
    setEvents((props) => [...props, ...filtered]);
    setCursor((c) => resp.nextCursor ?? c);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <button onClick={() => fetch()}>fetch</button>
      {events.length} proposal events fetched
      <br />
      cursor: {cursor ?? '[[none]]'}
      <br />
      dupes: {dupes}
      <div>
        <ul>
          {events.map((p) => (
            <li key={`${p.proposalId} ${p.state}`}>
              {p.proposalId} - {p.state}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
