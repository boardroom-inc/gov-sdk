---
stoplight-id: ehnpw9tb2j2ad
---

# Aave Governance v2

Aave has their own on-chain governance architecture, collectively referred to as the **Aave Governance V2** contracts.

> You can view Aave's architecture and documentation on their [@aave/governance-v2](https://github.com/aave/governance-v2) GitHub repo.

### Using the Adapter:
A new protocol which uses **Aave Governance V2** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { AaveGovernanceV2Adapter } from '@boardroom/gov-adapters';

export const registerAave: ProtocolRegistrationFunction = (register, transports) => {
  register({
    cname: 'aave',
    name: 'Aave',
    adapters: (adapters) => {
      const governance = new AaveGovernanceV2Adapter(
        {
          governance: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
          token: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
          strategy: '0xb7e383ef9B1E9189Fc0F71fb30af8aa14377429e',
        },
        transports,
        cname
    );
      adapters.implement('proposals', governance);
      adapters.implement('votes', governance);
      // ... other adapters
    },
  });
};

```
