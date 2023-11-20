import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { DAppProvider, ChainId } from '@usedapp/core';

import { Delegation } from './components/Delegation';
import { ProtocolList } from './components/ProtocolList';
import { CastVote } from './components/CastVote';
import { CreateProposal } from './components/CreateProposal';
import { CreateOnChainProposal } from './components/CreateOnChainProposal';
import { OrcaPod } from './components/OrcaPod';

const config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
  },
};

const Root: FunctionComponent = () => (
  <DAppProvider config={config}>
    <h1>Governance SDK - Reference Client</h1>
    {/* <CastVote /> */}
    {/* <CreateProposal /> */}
    {/* <CreateOnChainProposal /> */}
    {/* <Delegation /> */}
    <ProtocolList />
    {/* <OrcaPod /> */}
  </DAppProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
