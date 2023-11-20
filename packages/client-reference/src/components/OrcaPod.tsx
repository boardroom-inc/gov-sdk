import { GovernanceSDK, NetworkTransportResolver, SignerTransport } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent } from 'react';

export const OrcaPod: FunctionComponent = () => {
  const { activateBrowserWallet, account, library } = useEthers();
  const signer = library?.getSigner();

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

  const getENSPods = async () => {
    const protocol = sdk.getProtocol('ens');
    const result = await protocol.adapter('pod').getPods();

    console.log(result);
  };

  return (
    <>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}

      <h2>ENS Pods</h2>
      <button onClick={getENSPods}>Get Pod</button>
    </>
  );
};
