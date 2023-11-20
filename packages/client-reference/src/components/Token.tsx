import React, { FunctionComponent, useEffect, useState } from 'react';
import { IconInfo, Protocol, TokenInfo } from '@boardroom/gov-sdk';

interface Props {
  protocol: Protocol;
  instance?: string;
}

/**
 * Display the total treasury balance for a protocol
 */
export const Token: FunctionComponent<Props> = ({ protocol, instance = 'default' }) => {
  const [info, setInfo] = useState<TokenInfo | undefined>(undefined);
  const [icon, setIcon] = useState<IconInfo | undefined>(undefined);

  const fetchToken = async () => {
    if (!protocol.hasAdapter('token', instance)) {
      return;
    }
    const resp = await protocol.adapter('token', instance).getInfo();
    setInfo(resp);
  };

  const fetchIcon = async () => {
    if (!protocol.hasAdapter('icons', instance)) {
      return;
    }
    const resp = await protocol.adapter('icons', instance).getIcons();
    setIcon(resp);
  };

  useEffect(() => {
    fetchToken();
    fetchIcon();
  }, []);

  return (
    <>
      {icon && <img src={icon.icons[0].url} />}
      {info && (
        <>
          {info.symbol.toUpperCase()} @ {info.currentMarketPrice.amount}{' '}
          {info.currentMarketPrice.currency.toUpperCase()}{' '}
          <a href={`https://etherscan.io/address/${info.contractAddress.address}`} target="_blank">
            etherscan
          </a>
        </>
      )}
    </>
  );
};
