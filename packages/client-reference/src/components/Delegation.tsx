import { GovernanceSDK, NetworkTransportResolver, SignerTransport } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent } from 'react';

export const Delegation: FunctionComponent = () => {
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

  const delegateCompoundAlphaVotingPower = async () => {
    const protocol = sdk.getProtocol('uniswap');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateCompoundBravoVotingPower = async () => {
    const protocol = sdk.getProtocol('compound');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateAaveVotingPower = async () => {
    const protocol = sdk.getProtocol('aave');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateNounsVotingPower = async () => {
    const protocol = sdk.getProtocol('nounsdao');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateTornadoVotingPower = async () => {
    const protocol = sdk.getProtocol('tornadocash');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateENSVotingPower = async () => {
    const protocol = sdk.getProtocol('ens');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');
  };

  const delegate0xGovTestVotingPower = async () => {
    const protocol = sdk.getProtocol('0xgov');
    const requestId = await protocol
      .adapter('delegation', 'onchain-secondary')
      .delegateVotingPower('0x8d5237037A590A2dB531F3CfB8f42605cF306f34');

    console.log(requestId);
  }

  const delegateFeiVotingPower = async () => {
    const protocol = sdk.getProtocol('fei');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');

    console.log(requestId);
  };

  const delegateSnapshotVotingPower = async () => {
    const protocol = sdk.getProtocol('convexfinance');
    const requestId = await protocol
      .adapter('delegation')
      .delegateVotingPower('0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'cvx.eth');

    console.log(requestId);
  };

  const delegateMakerVotingPower = async () => {
    const protocol = sdk.getProtocol('makerdao');
    const requestId = await protocol
      .adapter('delegation', 'onchain')
      .delegateVotingPower('0x84b05B0a30B6AE620F393D1037f217e607AD1B96', 'makerdao', 5);

    console.log(requestId);
  };

  return (
    <>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}

      {/* <h2>Uniswap (Compound Alpha)</h2>
      <button onClick={delegateCompoundAlphaVotingPower}>Delegate</button>

      <h2>Compound (Compound Bravo)</h2>
      <button onClick={delegateCompoundBravoVotingPower}>Delegate</button>

      <h2>Aave (Aave V2)</h2>
      <button onClick={delegateAaveVotingPower}>Delegate</button>

      <h2>NounsDao (Nouns)</h2>
      <button onClick={delegateNounsVotingPower}>Delegate</button>

      <h2>TornadoCash (Tornado)</h2>
      <button onClick={delegateTornadoVotingPower}>Delegate</button> */}

      <h2>Ens (Openzeppelin)</h2>
      <button onClick={delegateENSVotingPower}>Delegate</button>

      <h2>Ens (Openzeppelin)</h2>
      <button onClick={delegate0xGovTestVotingPower}>Delegate</button>

      {/* <h2>Fei (Openzeppelin)</h2>
      <button onClick={delegateFeiVotingPower}>Delegate</button>

      <h2>Convex (Snapshot)</h2>
      <button onClick={delegateSnapshotVotingPower}>Delegate</button>

      <h2>MakerDao (MakerDao)</h2>
      <button onClick={delegateMakerVotingPower}>Delegate</button> */}
    </>
  );
};
