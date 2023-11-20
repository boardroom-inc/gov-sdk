---
stoplight-id: ywnulg34fg6ba
---

# Delegation Adapter

A protocol integration can implement an adapter with the DelegationAdapter interface to allow a user to delegate their voting power to another address .

### Interface

```js
export interface DelegationAdapter {
  delegateVotingPower: (address: string) => Promise<string>;
}
```

### Usage
To delegate vote power to a specific address:

```js
const protocol = sdk.getProtocol(cname);
// identifier is the cname of the protocol, used for logging actions
const requestId = await protocol.adapter('delegation')
  .delegateVotingPower(delegateAddress, identifier);
```

After submitting, an opaque request ID string will be returned that is implementation specific.

A protocol can have multiple delegation instances, to invoke a specific delegation instance. 

```js
const protocol = sdk.getProtocol(cname);
const adpaterInstances = protocol.adapterInstances('delegation');
// Adapter instances will be an array witht he canonical name used when registering framework. Ex: onchain, snapshot 

const requestId = await protocol.adapter('delegation', 'onchain')
  .delegateVotingPower(delegateAddress);
```



> You'll need a signer transport injected to the SDK for all delegation frameworks.

Frameworks implementing Delegation adapter
* AaveGovernanceV2Adapter
* CompoundGovernorAlphaAdapter
* CompoundGovernorBravoAdapter
* CouncilAdapter
* MakerDaoGovernorExecutiveAdapter
* MolochGovernorAdapter
* NounsBuilderAdapter
* NounsGovernorAdapter
* OpenZeppelinGovernorAdapter
* SnapshotAdapter
* TornadoCashGovernorAdapter
