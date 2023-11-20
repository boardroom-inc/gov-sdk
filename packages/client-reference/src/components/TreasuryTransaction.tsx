import React, { FunctionComponent, useEffect, useState } from 'react';
import { Protocol } from '@boardroom/gov-sdk';

interface Props {
  protocol: Protocol;
}

/**
 * Display the total treasury balance for a protocol
 */
export const TreasuryTransaction: FunctionComponent<Props> = ({ protocol }) => {
  const [transactions, setTransactions] = useState([]);

  const fetch = async () => {
    if (!protocol.hasAdapter('treasury')) {
      setTransactions([]);
      return;
    }
    const resp = await protocol.adapter('treasury').getTransactions('usd');
    setTransactions(resp.transactions);
  };

  useEffect(() => {
    fetch();
  }, []);
    return (
      <span>
        {transactions.map((transaction) => (
          <p key={transaction.txnHash}>{transaction.value}</p>
        ))}
      </span>
    );
};
