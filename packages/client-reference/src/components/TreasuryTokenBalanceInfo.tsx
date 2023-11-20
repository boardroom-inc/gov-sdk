import React, { FunctionComponent, useEffect, useState } from 'react';
import { Protocol, TokenBalancesInfo } from '@boardroom/gov-lib';

interface Props {
  protocol: Protocol;
}

/**
 * Display the different token info for a treasury
 */
export const TreasuryTokenBalanceInfo: FunctionComponent<Props> = ({ protocol }) => {
  const [tokenBalanceInfo, setTokenBalanceInfo] = useState<Array<TokenBalancesInfo>>();

  const fetch = async () => {
    if (!protocol.hasAdapter('treasury')) {
      return;
    }
    const resp = await protocol.adapter('treasury').getTokenBalances('usd');
    const sliced = resp.tokenBalances.slice(0, 5);
    setTokenBalanceInfo(sliced);

  };

  useEffect(() => {
    fetch();
  }, []);

  if (!tokenBalanceInfo) {
    return null;
  }

  const info = tokenBalanceInfo.map((balanceInfo) => {
    const tokenInfo = Object.keys(balanceInfo).map((key) => {
      if (key !== 'tokenLogoUrl') {
        return (
          <p key={`${key} ${balanceInfo['tokenSymbol']}`}>
            {key}: {balanceInfo[key]}
          </p>
        );
      }
        return <img style={{width: '60px', height: '60px'}} key={'image'} src={balanceInfo[key]} />;
    });
      return (
        <div key={balanceInfo['tokenSymbol']} style={{ width: '200px', display: 'inline-block' }}>
          {tokenInfo}
        </div>
      );
  });
  return <>{info}</>;
};
