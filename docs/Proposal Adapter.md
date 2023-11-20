---
stoplight-id: q78z5vj4tkxk4
---

# Proposal Adapter

A protocol integration can implement an adapter with the `ProposalsAdapter` interface to provide information about governance proposals and submitted votes

# Interface
```js
export interface PaginationOptions {
  cursor?: string; // returned as part of proposals API or through getProposals method of adapter
  startBlock?: number;
  endBlock?: number;
  limit?: number // used in snapshot adapter, to limit the number of proposals returned
  proposalIds?: string[]; // used in snapshot adapter
}

export type Time = { timestamp: number } | { blockNumber: number };

export interface Proposal {
  id: string,
  title: string,
  proposer: string,
  externalUrl?: string,
  content: string,
  choices?: string,
  blockNumber: number,
  startTime: Time,
  endTime: Time,
  type?: string,
  scores?: {
    choice: string,
    total: string,
  }[],
  status?: string,
  summary?: string,
  privacy?: string,
}

export interface Vote {
  time: Time;
  proposalId: string;
  address: string;
  choice: number;
  power: number;
  reason?: string;
}


export interface ProposalPage {
  items: Proposal[];
  nextCursor?: string;
}

export interface VotePage {
  items: Vote[];
  nextCursor?: string;
}

export interface ProposalsAdapter {
  getProposals: (pagination?: PaginationOptions) => Promise<ProposalPage>;
  getVotes: (pagination?: PaginationOptions) => Promise<VotePage>;
}

```

### Usage:
To query this information from the Governance SDK:

```js
const protocol = sdk.getProtocol(cname);

// fetch the first page of proposals
const proposals = await protocol.adapter('proposals').getProposals();

// fetch a page of proposals starting from a specific cursor
const proposals = await protocol.adapter('proposals').getProposals({ cursor });

// fetch a page of proposals starting from a specific cursor for onchain instance
const proposals = await protocol.adapter('proposals', 'onchain').getProposals({ cursor });

// get the first page of votes across all proposals for snapshot
const votes = await protocol.adapter('proposals', 'snapshot').getVotes();
```

### Pagination

The getProposals and getVotes methods are both paginated. Not all  actually implement pagination as it may not be possible with the downstream data source, but pagination options can always be passed in to the adapters safely.
You can use some of the built-in utilities to stream or buffer any paginated methods in the SDK:

```js
import { bufferAsyncIterable, iteratePaginatedResponse } from '@boardroom/gov-sdk';

// create an async iterator that will iterate through all items across all pages
const proposals = iteratePaginatedResponse(
  (cursor) => protocol.adapter('proposals', instance).getProposals({ cursor }));

// stream all proposals for further processing
for await (const proposal of proposals) {
  // ... further processing
}

// or buffer all items into an array
const allProposals = await bufferAsyncIterable(proposals);
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


