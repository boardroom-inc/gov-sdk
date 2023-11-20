import { ProposalCreationCallData, GovernanceSDK, NetworkTransportResolver, SignerTransport } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';
import React, { FunctionComponent } from 'react';
import { defaultAbiCoder } from 'ethers/lib/utils';

export const CreateOnChainProposal: FunctionComponent = () => {
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

  // To actually create a proposal this should be run on testnet
  // then you need to replace the governance address within the adapter to a valid testnet address
  const createOnChainProposal = async () => {
    const protocol = sdk.getProtocol('0xgov');

    const calldata = {
      type: 'transfer',
      values: ['0x71E47a4429d35827e0312AA13162197C23287546', 0],
    } as ProposalCreationCallData;

    const requestId = await protocol.adapter('createOnChainProposal', 'onchain-secondary').createOnChainProposal({
      targets: ['0xFCfaf7834F134F5146dBB3274baB9bED4bAfa917'],
      values: [0],
      signatures: ['transfer'], // this is ignored for open zeppelin proposals
      calldata: [calldata],
      description: 'Test proposal #2',
    });

    console.log(requestId);
  };

  return (
    <>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}

      <h2>Compound OnChain Proposal</h2>
      <button onClick={createOnChainProposal}>Create Proposal</button>
    </>
  );
};
