# Delegate Vote Power

1. Get the protocol instance:
Get the protocol instance using the GovernanceSDK as shown in the getting started section
```js
const protocol = sdk.getProtocol(cname);
```
2. Get the Delegation adapter instance
```js
const delegationAdapter = await protocol.adapter('delegation');
```

3. To delegate vote power to a specific address, use the `delegateVotingPower` method of the `DelegationAdapter`:
```js

const requestId = delegationAdapter.delegateVotingPower(delegateAddress, identifier);
// An opaque request ID string will be returned that is implementation specific.
```

`delegateAddress` is the Ethereum address of the delegate you want to assign your vote power to, and identifier is an optional string that can be used to identify the action in logs.


**Multiple delegation adapter instances**: If a protocol has delegation adapter instances, you can invoke a delegation adapter adapter instance by passing the canonical name of the adapter as a second argument to the adapter function.

```js

const adpaterInstances = protocol.adapterInstances('delegation');
// This will be an array of delegation adapter instances, Ex: ['snapshot', 'onchain'] 

const requestId = await protocol.adapter('delegation', 'onchain')
  .delegateVotingPower(delegateAddress);
```
In the above code snippet, we are getting all the delegation adapter instances for the protocol and then using the onchain instance to delegate vote power.