---
stoplight-id: f4e6fa31af431
---

# Getting Started

**Boardroom GovernanceSDK**, is a protocol and blockchain agnostic governance interoperability framework. It can be used to interact with various governance protocols and data sources in a flexible and extensible manner.

The SDK manages the collection of  _protocol integrations_, which are defined by imperative *protocol registration functions*. These functions register information about a protocol and instantiate  _adapter instances_

#### Installing the SDK

The Governance SDK is a NodeJS module (with native TypeScript types) that can be installed via npm or yarn:

```js
npm i @boardroom/gov-sdk
```

#### Creating the SDK Instance

```js
import { GovernanceSDK } from '@boardroom/gov-sdk';

const sdk = new GovernanceSDK();
```

The Governance SDK can be provided with transport-specific overrides to inject things like a custom JSON RPC provider for blockchain networks or a web3 provider / signer.


#### Injecting Transports
You will want to generally at least provide an Ethereum RPC provider instance, as that powers most read-only operations such as computing snapshot voting power or reading from on-chain governance contracts.
As an example, you can use Ethers' JsonRpcProvider implementation and point it to a HTTP RPC node from a provider like Infura or Alchemy:

```js
import { GovernanceSDK, NetworkTransportResolver } from '@boardroom/gov-sdk';
import { JsonRpcProvider } from '@ethersproject/providers';


const rpc = new NetworkTransportResolver({
  1: new JsonRpcProvider(ETH_RPC_NODE)
});

const sdk = new GovernanceSDK({ transports: { rpc } });
```

#### Protocol Iteration and Introspection

The `GovernanceSDK` instance is primarily used to get access to Protocol instances. Protocols are surfaced as normalized objects that are composed of various Adapter implementations.
Iterate through all supported protocols

```js
for (const protocol of sdk.getAllProtocols()) {
  console.log(protocol.name);
}
```

You can directly get a protocol by it's cname, which is an arbitrary string identifier used to reference a protocol

```js
// this will throw if "aave" is not registered with the SDK
const aave = sdk.getProtocol('aave');

const info = await aave.adapter('token').getInfo('usd');
```

All protocol interaction happens via Adapters, which are bound units of governance functionality that a protocol may implement

```js
// this will throw if the protocol does not implement a TreasuryAdapter
const proposals = protocol.adapter('proposals');

// you can introspect the protocol to check if it implements
// a specific adapter first
if (protocol.hasAdapter('proposals')) {
  console.log(await protocol.adapter('proposals').getProposals({ limit: 5 }));
}
```