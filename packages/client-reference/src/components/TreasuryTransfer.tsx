import React, { FunctionComponent, useEffect, useState } from 'react';
import { Protocol } from '@boardroom/gov-sdk';

interface Props {
  protocol: Protocol;
}

/**
 * Display the total treasury balance for a protocol
 */
export const TreasuryTransfer: FunctionComponent<Props> = ({ protocol }) => {
  const [transfer, setTransfer] = useState([]);

  const fetch = async () => {
    if (!protocol.hasAdapter('treasury')) {
      setTransfer([]);
      return;
    }
    const tokenBalResp = await protocol.adapter('treasury').getTokenBalances('usd');
    const treasuryAddresses = await protocol.adapter('treasury').getTreasuryAddresses();
    const resp = await protocol.adapter('treasury').getTransfers(treasuryAddresses.addresses[0], tokenBalResp.tokenBalances[0].tokenContractAddress, 'usd');
    setTransfer(resp.transfers);
  };

  useEffect(() => {
    fetch();
  }, []);
    return (
      <span>
        {transfer.map((transfer) => (
          <p key={transfer.txnHash}>{transfer.transfer.delta_quote}{transfer.transfer.transfer_type}</p>
        ))}
      </span>
    );
};
