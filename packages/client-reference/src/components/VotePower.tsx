import { JsonRpcTransport, Protocol } from '@boardroom/gov-sdk';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  protocol: Protocol;
  instance?: string;
  votePowerAddress?: string;
  rpc?: JsonRpcTransport;
}

export const VotePower: FunctionComponent<Props> = ({ protocol, instance, votePowerAddress, rpc }) => {
  // const { account } = useEthers();
  const account = votePowerAddress;
  const [power, setPower] = useState<number | null>(null);

  const fetch = async () => {

    if (!account || !protocol.hasAdapter('votePower', instance)) {
      return;
    }
    const latestBlock = await rpc.getBlockNumber();
    // Subtract 5 because this version of ethers has issues with vote power and the very latest block.
    // Updating ethers can remove that need.
    const scores = await protocol.adapter('votePower', instance).getVotePower([votePowerAddress], latestBlock - 5);
    console.log(scores);
    const found = scores.find((s) => s.address === account);

    if (found) {
      setPower(found.power);
    }
  };

  useEffect(() => {
    fetch();
  }, [account]);
  return (
    <>
      <div>
        {instance} power: {power ?? '-'}
      </div>
      <br />
    </>
  );
};
