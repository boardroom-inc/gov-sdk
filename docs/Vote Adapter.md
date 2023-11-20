---
stoplight-id: zrwul08euhdh8
---

# Vote Adapter

A protocol integration can implement an adapter with the VoteAdapter interface to allow a user to vote on a proposal.

### Interface

```js
export interface VoteAdapter {
  castVote: (proposalId: string, choice: number) => Promise<string>;
}
```

### Usage

Casting a vote requires a proposal ID (resolved from a Proposal Adapter) and the index of the proposal choice the user has selected. After submitting, an opaque request ID string will be returned that is implementation specific.
To submit a vote for a given proposal:

```js
const protocol = sdk.getProtocol(cname);

type CastVoteData = {
  proposalId: string; //id of the proposal
  choice: number | number[] | string; // vote choice
  power: number; // Vote power of the address, this is used for showing the vote from pending votes API while the data is indexed for the API
  proposalRefId?: string; //reference id of proposal from boardroom
  identifier?: string;
  adapter?: string;
  isContractWallet?: boolean;
  reason?: string;
  web3?: Web3Provider;
  type?: ProposalType;
  isPrivate?: boolean;
};

const requestId = await protocol.adapter('vote').castVote(props: CastVoteData);
```

A protocol can have multiple vote adapter instances, to invoke a specific vote adapter instance. 

```js
const protocol = sdk.getProtocol(cname);
const adpaterInstances = protocol.adapterInstances('vote');
// Adapter instances will be an array witht he canonical name used when registering framework. Ex: onchain, snapshot

const requestId = await protocol.adapter('vote', 'onchain')
  .castVote(props: CastVoteData);
```

> You'll need a signer transport injected to the SDK for on-chain governance frameworks such as Compound.

Frameworks implementing Vote adapter

* AaveGovernanceV2Adapter
* CompoundGovernorAlphaAdapter
* CompoundGovernorBravoAdapter
* CouncilAdapter
* MakerDaoGovernorExecutiveAdapter
* MakerDaoGovernorPollingAdapter
* MolochGovernorAdapter
* NounsBuilderAdapter
* NounsGovernorAdapter
* OpenZeppelinGovernorAdapter
* SnapshotAdapter
* TornadoCashGovernorAdapter
