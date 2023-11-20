---
stoplight-id: r9nfq8j7il9rf
---

# Open Zeppelin Governor

This modular system of Governor contracts allows the deployment of on-chain voting protocols similar to Compound’s Governor Alpha & Bravo and beyond, through the ability to easily customize multiple aspects of the protocol.

> You can view the Nouns governor contracts their [@OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/governance) GitHub repo.

### Using the Adapter:
A new protocol which uses **Open Zeppelin Governor** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerAngle: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'angle';
  register({
    cname: cname,
    name: 'Angle',

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter(
        '0x59153e939c5b4721543251ff3049Ea04c755373B', // governanceAddress
        '0x31429d1856aD1377A8A0079410B297e1a9e214c2', // tokenAddress
        transports,
        cname
      );
      // ... other adapters
      adapters.implement('proposals', governor, 'onchain');
    },
  });
}
```
