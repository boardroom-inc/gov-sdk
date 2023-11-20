---
stoplight-id: xhg90b9klkcgu
---

# Compound Governor Bravo

Compound's Governor Bravo is a set of smart contracts that allow for on-chain snapshotting of token balances via a custom ERC-20 contract and on-chain submission, voting, and execution of proposals.

> You can view the Compound governance contracts their [@compound-finance/compound-protocol](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) GitHub repo.

### Using the Adapter:
A new protocol which uses **Compound Governor Bravo** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorBravoAdapter } from '@boardroom/gov-adapters';

export const register: ProtocolRegistrationFunction = (register, transports) => {
  register({
    cname: 'compound',
    name: 'Compound',
    adapters: (adapters) => {
      const bravo = new CompoundBravo(
        '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        transports,
        cname
      );

      // ... other adapters
      adapters.implement('proposals', bravo, 'onchain');
    },
  });
};
```

