---
stoplight-id: x62vwp7g25fb6
---

# Nouns-Builder

**Nouns builder** allows anyone to easily deploy a DAO in minutes. Inspired by NounsDAO, Nouns builder uses a factory contract called the Manager to create custom Nouns-styled DAOs.

> You can view Nouns builder architecture and documentation on their [@ourzora/nouns-protocol](https://github.com/ourzora/nouns-protocol/tree/main/src/governance/governor) GitHub repo.

### Using the Adapter:
A new protocol which uses **Nouns Builder** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerBuilderDAO: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'builderdao';
  register({
    cname: cname,
    name: 'Builder DAO',
    category: ['Grants'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter(
        '0xe3F8d5488C69d18ABda42FCA10c177d7C19e8B1a', // governanceAddress
        '0xdf9b7d26c8fc806b1ae6273684556761ff02d422', // tokenAddress
        transports,
        cname
      );

      // ... other adapters
      adapters.implement('proposals', governance, 'onchain');
    },
  });
}
```