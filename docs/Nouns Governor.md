---
stoplight-id: 5rbescu47rkdd
---

# Nouns Governor

Nouns Governor is a set of smart contracts that allow for on-chain snapshotting of token balances via a custom ERC-721 contract and on-chain submission, voting, and execution of proposals.

> You can view the Nouns governor contracts their [@nounsDAO/nouns-monorepo](https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-contracts/contracts/governance) GitHub repo.

### Using the Adapter:
A new protocol which uses **Nouns Governor** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsGovernorAdapter } from '@boardroom/gov-adapters';

export const registerNounsDAO: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'nounsdao';
  register({
    cname: cname,
    name: 'Nouns DAO',

    adapters: (adapters) => {
      const governance = new NounsGovernorAdapter(
        '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d', // governanceAddress
        '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03', // tokenAddress
        transports,
        cname
      );

      // ... other adapters
      adapters.implement('proposals', governance, 'onchain');
    },
  });
}
```
