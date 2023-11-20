import { GovernanceSDK, NetworkTransportResolver, Time } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Token } from './Token';
import { Proposals } from './Proposals';
import { ProposalEvents } from './ProposalEvents';
import { Votes } from './Votes';
import { Delegations } from './Delegations';
import { DelegationEvents } from './DelegationEvents';
import { TreasuryBalance } from './TreasuryBalance';
import { TreasuryTokenBalanceInfo } from './TreasuryTokenBalanceInfo';
import { useEthers } from '@usedapp/core';
import { VotePower } from './VotePower';
import { TreasuryTransaction } from './TreasuryTransaction';
import { TreasuryTransfer } from './TreasuryTransfer';
import { Icon } from './Icons';
import { BalanceOf } from './BalanceOf';
import { TransferEvents } from './TransferEvents';
import { CreateOnChainProposal } from './CreateOnChainProposal';
import { Delegation } from './Delegation';
import { StakingToken } from './Staking';

export const ProtocolList: FunctionComponent = () => {
  const { activateBrowserWallet, account } = useEthers();
  const [time, setTime] = useState<Time | undefined>();

  const sdk = new GovernanceSDK({
    transports: {
      rpc: new NetworkTransportResolver({
        1: new JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`),
        10: new JsonRpcProvider(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_OPTIMISM_KEY}`),
        137: new JsonRpcProvider('https://rpc-mainnet.matic.network', 137),
        42161: new JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ARBITRUM_KEY}`, 42161),
        5: new JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_KEY}`),
      }),
    },
    snapshotApiKey: `${process.env.SNAPSHOT_API_KEY}`,
    etherscanMainnetAPIKey: `${process.env.ETHERSCAN_MAINNET_API_KEY}`,
    etherscanOptimismAPIKey: `${process.env.ETHERSCAN_OPTIMISM_API_KEY}`,
    boardroomAPIKey: `${process.env.BOARDROOM_API_KEY}`,
  });

  const fetchTime = async () => {
    setTime(await sdk.getCurrentTime());
  };

  useEffect(() => {
    fetchTime();
  }, []);

  // Add the cnames of any protocols to test here

  const protocolsToTest = ['ens'];

  // Framework instance to test with. (default/snapshot/onchain)
  const instancesToTest = ['onchain'];
  // Add address that should have voting power here
  const votePowerAddress = '0x8d5237037A590A2dB531F3CfB8f42605cF306f34';
  // For alternate chains the chain id here will need to be changed for testing
  const jsonRpc = sdk.transports.get('rpc').network(1);

  const protocols = sdk
    .getAllProtocols()
    // misc protocols with various combos of frameworks to test
    .filter((p) => protocolsToTest.includes(p.cname));

  return (
    <>
      <h2>Protocols</h2>
      {!account && <button onClick={() => activateBrowserWallet()}>Connect</button>}
      <table>
        <thead>
          <tr>
            <th>cname</th>
            <th>Name</th>
            <th>Token Info</th>
            <th>Vote Power</th>
            <th>BalanceOf</th>
            <th>Proposals</th>
            <th>ProposalEvents</th>
            <th>Delegations</th>
            <th>DelegationEvents</th>
            <th>TransferEvents</th>
            <th>Votes</th>
            <th>Treasury balance</th>
            <th>Treasury tokens info</th>
            {/* <th>Treasury transactions</th>
            <th>Treasury token transfers</th> */}
          </tr>
        </thead>
        <tbody>
          {protocols.map((p) => (
            <tr key={p.cname}>
              <td>{p.cname}</td>
              <td>{p.name}</td>
              <td>
                {p
                  .adapterInstances('token')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <Token key={instance} protocol={p} instance={instance} />
                    </Fragment>
                  ))}
              </td>
              {
                <td>
                  {p
                    .adapterInstances('icons')
                    .filter((instance) => instancesToTest.includes(instance))
                    .map((instance) => (
                      <Fragment key={instance}>
                        <Icon key={instance} protocol={p} instance={instance} />
                      </Fragment>
                    ))}
                </td>
                /* <td>
                {p
                  .adapterInstances('votePower')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <VotePower protocol={p} instance={instance} votePowerAddress={votePowerAddress} rpc={jsonRpc} />
                    </Fragment>
                  ))}
              </td>
              <td>
                {p
                  .adapterInstances('delegation')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <Delegation />
                    </Fragment>
                  ))}
              </td>
              <td>
                {p
                  .adapterInstances('votePower')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <BalanceOf protocol={p} instance={instance} address={votePowerAddress} rpc={jsonRpc} />
                    </Fragment>
                  ))}
              </td> */
              }
              <td>
                {p
                  .adapterInstances('proposals')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <Proposals protocol={p} instance={instance} />
                    </Fragment>
                  ))}
              </td>
              {/* <td>
                {p
                  .adapterInstances('proposals')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <CreateOnChainProposal />
                    </Fragment>
                  ))}
              </td> */}
              {/* <td>
                <Fragment key="staking">
                  <StakingToken />
                </Fragment>
              </td> */}
              {/* <td>
                {p
                  .adapterInstances('proposals')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <Fragment key={instance}>
                      <ProposalEvents protocol={p} instance={instance} />
                    </Fragment>
                  ))}
              </td> */}
              {/* {
                <td>
                  {p
                    .adapterInstances('delegation')
                    .filter((instance) => instancesToTest.includes(instance))
                    .map((instance) => (
                      <Fragment key={instance}>
                        <Delegations protocol={p} instance={instance} delegationAddress={votePowerAddress} />
                      </Fragment>
                    ))}
                </td>
              }
              {
                <td>
                  {p
                    .adapterInstances('delegation')
                    .filter((instance) => instancesToTest.includes(instance))
                    .map((instance) => (
                      <Fragment key={instance}>
                        <DelegationEvents protocol={p} instance={instance} rpc={jsonRpc} />
                      </Fragment>
                    ))}
                </td>
              }
              {
                <td>
                  {p
                    .adapterInstances('general')
                    .filter((instance) => instancesToTest.includes(instance))
                    .map((instance) => (
                      <Fragment key={instance}>
                        <TransferEvents protocol={p} instance={instance} rpc={jsonRpc} />
                      </Fragment>
                    ))}
                </td>
              } */}
              {
                <td>
                  {p
                    .adapterInstances('vote')
                    .filter((instance) => instancesToTest.includes(instance))
                    .map((instance) => (
                      <Fragment key={instance}>
                        <Votes protocol={p} instance={instance} rpc={jsonRpc} />
                      </Fragment>
                    ))}
                </td>
              }
              {/* <td>
                {p
                  .adapterInstances('treasury')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <TreasuryBalance key={instance} protocol={p} />
                  ))}
              </td> */}
              {/* <td>
                {p
                  .adapterInstances('treasury')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <TreasuryTokenBalanceInfo key={instance} protocol={p} />
                  ))}
              </td> */}
              {/* <td>
                {p
                  .adapterInstances('treasury')
                  .filter((instance) => instancesToTest.includes(instance))
                  .map((instance) => (
                    <TreasuryTransaction key={instance} protocol={p} />
                  ))}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
