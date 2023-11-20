import { GovernanceSDK, NetworkTransportResolver, SignerTransport } from '@boardroom/gov-sdk';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

export const CastVote: FunctionComponent = () => {
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

  const castSnapshotVote = async () => {
    console.log("trying snapshot vote")
    const protocol = sdk.getProtocol('optimism');
    const web3 = new Web3Provider(window.ethereum);
    const requestId = await protocol.adapter('vote', 'snapshot')
      .castVote('0x4cb75f317c1e3023755390ea1020114678ae8fad1eb8e5449810d3eb3d4fb74a', 1, 0, "refId", "testing", "adapter", false, 'reason', web3, 'single-choice', true);

    console.log(requestId);
  };

  const castCompoundAlphaVote = async () => {
    const protocol = sdk.getProtocol('uniswap');
    const requestId = await protocol.adapter('vote').castVote('1', 1, 0);

    console.log(requestId);
  };

  const castCompoundBravoVote = async () => {
    const protocol = sdk.getProtocol('compound');
    const requestId = await protocol.adapter('vote').castVote('50', 1, 0);

    console.log(requestId);
  };

  const castAaveV2Vote = async () => {
    const protocol = sdk.getProtocol('aave');
    const requestId = await protocol.adapter('vote').castVote('17', 1, 0);

    console.log(requestId);
  };

  const castNounsVote = async () => {
    const protocol = sdk.getProtocol('nounsdao');
    const requestId = await protocol.adapter('vote').castVote('16', 1, 0);

    console.log(requestId);
  };

  const castTornadoVote = async () => {
    const protocol = sdk.getProtocol('tornadocash');
    const requestId = await protocol.adapter('vote').castVote('9', 1, 0);

    console.log(requestId);
  };

  const castFeiVote = async () => {
    const protocol = sdk.getProtocol('fei');
    const requestId = await protocol.adapter('vote').castVote('39581665112081986502802534892213316345924730709285669333491862723284653153838', 1, 0);

    console.log(requestId);
  };

  const castOptimismVote = async () => {
    const protocol = sdk.getProtocol('optimism');
    const requestId = await protocol.adapter('vote', 'onchain-optimism').castVote({
      proposalId: '103713749716503028671815481721039004389156473487450783632177114353117435138377',
      choice: [1, 5, 4],
      power: 0,
    });

    console.log(requestId);
  };

  const castMolochVote = async () => {
    const protocol = sdk.getProtocol('venturedao');
    const requestId = await protocol.adapter('vote').castVote('9', 1, 0);

    console.log(requestId);
  };

  const castVoteMakerExecutive = async () => {
    const protocol = sdk.getProtocol('makerdao');
    const requestId = await protocol.adapter('vote', 'onchain').castVote('0xdA607F191B2D9a76Bc7648a1a62B43bb721668e2', 0, 0);

    console.log(requestId);
  };

  const castVoteMakerPolling = async () => {
    const protocol = sdk.getProtocol('makerdao');
    const requestId = await protocol.adapter('vote', 'onchain-secondary').castVote('871', 0, 0);

    console.log(requestId);
  };

  const castCouncilVote = async () => {
    const protocol = sdk.getProtocol('elementdao');
    const requestId = await protocol.adapter('vote','onchain').castVote('0', 0);
    console.log(requestId);
  };

  return (
    <>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}

      <h2>Index Coop (Snapshot)</h2>
      <button onClick={castSnapshotVote}>Cast Vote</button>

      <h2>Uniswap (Compound Alpha)</h2>
      <button onClick={castCompoundAlphaVote}>Cast Vote</button>

      <h2>Compound (Compound Bravo)</h2>
      <button onClick={castCompoundBravoVote}>Cast Vote</button>

      <h2>Aave (Aave V2)</h2>
      <button onClick={castAaveV2Vote}>Cast Vote</button>

      <h2>NounsDao (Nouns)</h2>
      <button onClick={castNounsVote}>Cast Vote</button>

      <h2>TornadoCash (Tornado)</h2>
      <button onClick={castTornadoVote}>Cast Vote</button>

      <h2>Fei (OpenZeppelin)</h2>
      <button onClick={castFeiVote}>Cast Vote</button>

      <h2>Optimism (OpenZeppelin)</h2>
      <button onClick={castOptimismVote}>Cast Vote</button>

      <h2>VentureDao (Moloch)</h2>
      <button onClick={castMolochVote}>Cast Vote</button>

      <h2>MakerDao (MakerExecutive)</h2>
      <button onClick={castVoteMakerExecutive}>Cast Vote</button>

      <h2>MakerDao (MakerPolling)</h2>
      <button onClick={castVoteMakerPolling}>Cast Vote</button>

      <h2>ElementDAO (Council)</h2>
      <button onClick={castCouncilVote}>Cast Vote</button>
    </>
  );
};
