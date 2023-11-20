---
stoplight-id: 5rd6dnozexlei
---

# Optimism Governor

An Optimism network based modular system of Governor contracts which allow the deployment of on-chain voting protocols similar to Compound’s Governor Alpha & Bravo and beyond.  This enables the ability to easily customize multiple aspects of the protocol. These contracts are deployed on the Optimism network creating notable differences in implementation.

### Voting Modules

The contracts also have support for customizable voting modules that can be used and swapped in, the main one in use being the approval voting module. 

This is an **extension of the base OpenZeppelin contracts** - [Browse OZ Governor](https://docs.boardroom.io/docs/governance-sdk/r9nfq8j7il9rf-open-zeppelin-governor). The approval voting module can be found here [@vote-agora/src/modules/ApprovalVotingModule.sol](https://github.com/voteagora/optimism-gov/blob/main/src/modules/ApprovalVotingModule.sol)

> You can view the Optimism Governor contracts with approval voting support based on the OpenZeppelin Contracts in their [@vote-agora/optimism-gov](https://github.com/voteagora/optimism-gov/blob/579029682805267d4c6461e3da4aece22586e819/src/OptimismGovernorV5.sol) GitHub repo.

### Using the Adapter:
A new protocol which uses **Optimism Governor** can be added to the SDK by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerOptimism: ProtocolRegistrationFunction = (register, transports, snapshotApiKey) => {
  const cname = 'optimism';
  register({
    cname: cname,
    name: 'Optimism',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter(
        '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10',
        '0x4200000000000000000000000000000000000042',
        transports,
        cname,
        10, // Use the correct Optimism network
      );
      // ... other adapters
      adapters.implement('proposals', governor, 'onchain-optimism');
    },
  });
}
```
