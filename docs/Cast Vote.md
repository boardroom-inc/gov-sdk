# Cast Vote
1. Get the protocol instance:
Get the protocol instance using the GovernanceSDK as shown in the getting started section
```js
const protocol = sdk.getProtocol(cname);
```

2. Get the vote adapter instance:
Get the vote adapter instance from the protocol instance.
```Js
const voteAdapter = protocol.adapter('vote');
```

3. Cast a vote:

To cast a vote, you need to call the `castVote` function on the vote adapter instance. The function takes two arguments: proposalId and choice.
```js
const proposalId = "0xabc...123"; // replace with the ID of the proposal you want to vote on
const choice = 1; // replace with the index of the proposal choice you want to vote for
const requestId = await voteAdapter.castVote(proposalId, choice);
// The castVote function returns a Promise that resolves to an opaque request ID string that is implementation specific.
```

**Multiple vote adapter instances**:
If a protocol has multiple vote adapter instances, you can invoke a specific vote adapter instance by passing the canonical name of the adapter as a second argument to the adapter function.
```js
const adpaterInstances = protocol.adapterInstances('delegation');
// This will be an array of delegation adapter instances, Ex: ['snapshot', 'onchain'] 
const voteAdapter = protocol.adapter('vote', 'snapshot');
```
In the above code snippet, we are getting all the vote adapter instances for the protocol and then using the onchain instance to cast vote.

