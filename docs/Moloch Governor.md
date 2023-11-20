---
stoplight-id: cbqmr2ddsbyh8
---

# Moloch Governor

Moloch Governor is a set of smart contracts that allow for a simple open-source DAO framework for grants-making.

> You can view the Compound governance contracts their [@MolochVentures/moloch ](https://github.com/MolochVentures/moloch) GitHub repo.

### Using the Adapter:
A new protocol which uses **Moloch Governor** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, MolochGovernorAdapter } from '@boardroom/gov-adapters';

export const registerMolochDAO: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'molochdao';
  register({
    cname: cname,
    name: 'Moloch DAO',

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter('0x519f9662798c2e07fbd5b30c1445602320c5cf5b', transports, 1, cname);
      // ... other adapters
      adapters.implement('proposals', governor, 'onchain');
    },
  });
}
```