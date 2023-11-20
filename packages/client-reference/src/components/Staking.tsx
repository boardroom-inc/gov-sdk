import React, { FunctionComponent, useEffect, useState } from 'react';
import { GovernanceSDK, NetworkTransportResolver, SignerTransport } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';
import { register0xGov } from '@boardroom/gov-protocols/src/testProtocols/0xgov-test';

/**
 * Stake Tokens for a protocols
 */
export const StakingToken: FunctionComponent = () => {
  const { activateBrowserWallet, account, library } = useEthers();
  const signer = library?.getSigner();
  const [stakedBalance, setStakedBalance] = useState<string | undefined>();
  const [tokenBalance, setTokenBalance] = useState<string | undefined>();

  const sdk = new GovernanceSDK({
    transports: {
      rpc: new NetworkTransportResolver({
        1: new JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`),
        10: new JsonRpcProvider(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_OPTIMISM_KEY}`),
        137: new JsonRpcProvider('https://rpc-mainnet.matic.network', 137),
        42161: new JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ARBITRUM_KEY}`, 42161),
        5: new JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_KEY}`),
      }),
      signer: new SignerTransport(signer),
    },
    snapshotApiKey: `${process.env.SNAPSHOT_API_KEY}`,
    etherscanMainnetAPIKey: `${process.env.ETHERSCAN_MAINNET_API_KEY}`,
    etherscanOptimismAPIKey: `${process.env.ETHERSCAN_OPTIMISM_API_KEY}`,
    boardroomAPIKey: `${process.env.BOARDROOM_API_KEY}`,
  });

  useEffect(() => {
    const getBalances = async () => {
      const address = '0x8d5237037A590A2dB531F3CfB8f42605cF306f34';
      const stakingAdapter = sdk.getProtocol('0xgov-test').adapter('staking');
      console.log(stakingAdapter);
      if (address) {
        const tkBalance = await stakingAdapter.getTokenBalance(address);
        const stkBalance = await stakingAdapter.getStakedTokenBalance(address);
        setTokenBalance(tkBalance);
        setStakedBalance(stkBalance);
      }
    };

    getBalances();
  }, [signer]);

  const stakeTokens = async () => {
    const protocol = sdk.getProtocol('0xgov-test');
    console.log("trying to stake tokens")
    const address = await signer?.getAddress();
    const requestId = await protocol.adapter('staking').stake(address, '100000000000000000000000');

    console.log(requestId);
  };

  const withdrawTokens = async () => {
    const protocol = sdk.getProtocol('0xgov-test');
    const address = await signer?.getAddress();
    const requestId = await protocol.adapter('staking').unStake(address, '10000000000000000000000');

    console.log(requestId);
  };

  return (
    <>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}
      <br />
      <button onClick={stakeTokens}>Stake Tokens</button>
      <button onClick={withdrawTokens}>Withdraw Tokens</button>  
      <p>{tokenBalance} Token Balance</p>
      <p>{stakedBalance} Staked Balance</p>
    </>
  );
};
