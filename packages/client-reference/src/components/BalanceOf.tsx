import { JsonRpcTransport, Protocol } from '@boardroom/gov-sdk';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  address?: string;
  rpc?: JsonRpcTransport;
}

export const BalanceOf: FunctionComponent<Props> = ({ protocol, instance, address, rpc }) => {
  const [balance, setBalance] = useState<number | null>(null);

  const fetch = async () => {
    if (!address || !protocol.hasAdapter('votePower', instance)) {
      return;
    }
    const latestBlock = await rpc.getBlockNumber();
    // Subtract 5 because this version of ethers has issues with vote power and the very latest block.
    // Updating ethers can remove that need.
    const scores = await protocol.adapter('votePower', instance).getBalance([address]);
    const found = scores.find((s) => s.address === address);
    console.log(scores);
    if (found) {
      setBalance(found.balance);
    }
  };

  useEffect(() => {
    fetch();
  }, [address]);
  return (
    <>
      <div>
        {instance} balance: {balance ?? '-'}
      </div>
      <br />
    </>
  );
};
