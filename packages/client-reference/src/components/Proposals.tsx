import { Proposal, Protocol } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
}

export const Proposals: FunctionComponent<Props> = ({ protocol, instance = 'default' }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [dupes, setDupes] = useState(0);

  const fetch = async () => {
    const resp = await protocol
      .adapter('proposals', instance)
      .getProposals({ cursor: 'eyJibG9jayI6MTc0OTU3MjEsImxvZyI6MjA2fQ==', limit: 200 });
    const filtered = resp.items.filter((i) => !proposals.find((p) => p.id === i.id));

    console.log(filtered);

    setDupes((n) => n + (resp.items.length - filtered.length));
    setProposals((props) => [...props, ...filtered]);
    setCursor((c) => resp.nextCursor ?? c);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <button onClick={() => fetch()}>fetch</button>
      {proposals.length} props fetched
      <br />
      cursor: {cursor ?? '[[none]]'}
      <br />
      dupes: {dupes}
      <div>
        <ul>
          {proposals.map((p) => (
            <div>
              <li key={p.id}>{p.title}</li>
              <li key={p.id}>{p.proposer}</li>
              <li key={p.id}>{p.content}</li>
              <li key={p.id}>{p.choices}</li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};
