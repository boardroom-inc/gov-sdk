import React, { FunctionComponent, useEffect, useState } from 'react';
import { Protocol } from '@boardroom/gov-sdk';

interface Props {
  protocol: Protocol;
}

/**
 * Display the total treasury balance for a protocol
 */
export const TreasuryBalance: FunctionComponent<Props> = ({ protocol }) => {
  const [balance, setBalance] = useState('');

  const fetch = async () => {
    if (!protocol.hasAdapter('treasury')) {
      setBalance('n/a');
      return;
    }
    const resp = await protocol.adapter('treasury').getBalance('usd');
    setBalance(`$${Math.round(resp.amount)}`);
  };

  useEffect(() => {
    fetch();
  }, []);
  return <>{balance}</>;
};
