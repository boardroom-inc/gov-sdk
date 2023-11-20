---
stoplight-id: n4p5m86bkmz90
---

# Compound Governor Alpha

Compound's Governor Alpha is a set of smart contracts that allow for on-chain snapshotting of token balances via a custom ERC-20 contract and on-chain submission, voting, and execution of proposals.

> You can view the Compound governance contracts their [@compound-finance/compound-protocol](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) GitHub repo.

### Using the Adapter:
A new protocol which uses **Compound Governor Alpha** can be added to sdk by registering it as follows 

```js
import { ExternalLink, ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorAlphaAdapter } from '@boardroom/gov-adapters';

export const registerCompound: ProtocolRegistrationFunction = (register, transports) => {
  const cname = "compound";
    register({
    cname: cname,
    name: 'Compound',

    adapters: (adapters) => {
      const alpha = new CompoundAlpha(
        '0xc0dA01a04C3f3E0be433606045bB7017A7323E38', // governance address
        '0xc00e94Cb662C3520282E6f5717214004A7f26888', // token address
        transports,
        cname
      );
      // ... other adapters
      adapters.implement('proposals', alpha, 'onchain-alpha');  
    }
 });
}
```
