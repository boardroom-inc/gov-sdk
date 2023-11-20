import { JsonRpcTransport, Protocol, Vote } from '@boardroom/gov-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  rpc?: JsonRpcTransport;
}

export const Votes: FunctionComponent<Props> = ({ protocol, instance = 'default', rpc}) => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [dupes, setDupes] = useState(0);

  const fetch = async () => {

    // let resp = await protocol.adapter('proposals', instance).getVotes({ cursor, limit: 5 });

    const event = `{
      data: '0x0c13e3532a82fecb45bf10e6f55cfa3b8dc763d6afcbd5db9273e02061efebb1000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000d42e37789ab4b1b4d5bc00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000',
      topics: [
        '0xb8e138887d0aa13bab447e82de9d5c1777041ecd21ca36ba824ff1e6c07ddda4',
        '0x000000000000000000000000d1015efa96441d2326f8194e7b1f5fe8425b84f8'
      ],
      index: 63,
      account: { address: '0x2d3222cf6322977dc81bbe8b1fbcd9c9c9e456dd' },
      transaction: {
        hash: '0xd361c2066e6a68a9b88e4a898bee69fdefdf3f022e0887bf8412a6b1615f19ec',
        nonce: 38,
        index: 22,
        from: { address: '0xd1015efa96441d2326f8194e7b1f5fe8425b84f8' },
        to: { address: '0x2d3222cf6322977dc81bbe8b1fbcd9c9c9e456dd' },
        value: '0x0',
        gasPrice: '0x59682f09',
        maxFeePerGas: '0x59682f0f',
        maxPriorityFeePerGas: '0x59682f00',
        gas: 76560,
        status: 1,
        gasUsed: 76560,
        cumulativeGasUsed: 3114711,
        effectiveGasPrice: '0x59682f09',
        createdContract: null
      }
    }`

   const vote = await protocol.adapter('proposals', instance).getVoteFromEvent(1, "someHash", event);
   console.log(vote)

   return;


    let latestBlock = await rpc.getBlockNumber();
    // latestBlock = 100015772;
    const maxBlocksToQuery = 2000;
    let resp;
    let items;

    let votesNotFound = true;
    while (votesNotFound) {
      resp = await protocol.adapter('proposals', instance).getVotes({
        cursor: undefined,
        limit: 10,
        startBlock: latestBlock - maxBlocksToQuery,
        endBlock: latestBlock,
      });
      latestBlock = latestBlock - maxBlocksToQuery;
      latestBlock = latestBlock - maxBlocksToQuery;
      if (resp.items.length > 0 || latestBlock < 14000000) {
        votesNotFound = false;
        // items = resp.items.slice(0, 5);
        items = resp.items
      }
    }
    console.log(items)
    const filtered = resp.items.filter(
      (i) => !votes.find((p) => p.address.toLowerCase() === i.address.toLowerCase() && p.proposalId === i.proposalId)
    );
    const sliced = filtered.slice(0, 5);
    setDupes((n) => n + (resp.items.length - filtered.length));
    setVotes((props) => [...props, ...sliced]);
    setCursor(resp.nextCursor);
  };

  useEffect(() => {
    fetch();
  }, []);

  const renderChoices = (choice: number | Array<number> | Record<number, number>) => {
    return <span>Choice: {JSON.stringify(choice)}</span>
  }

  return (
    <>
      <button onClick={() => fetch()}>fetch</button>
      {votes.length} votes fetched
      <br />
      cursor: {cursor ?? '[[none]]'}
      <br />
      dupes: {dupes}
      <div>
        <ul>
          {votes.map((p) => (
            <li key={`${p.proposalId}:${p.address}`}>
              {p.address} @ {p.proposalId}
              <br />
              {renderChoices(p.choice)} @ power={p.power}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
