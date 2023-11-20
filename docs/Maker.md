---
stoplight-id: jwvqx7t50b0zc
---

# Maker

Maker Governance is a set of smart contracts that facilitate voting, proposal execution, and voting security of the Maker Protocol.

> You can view the Maker governance contracts in github org of [@DappHub](https://github.com/dapphub) GitHub repo.

### Using the Adapter:
A new protocol which uses **Maker Governance** can be added to sdk by registering it as follows 

```js
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  MakerDaoGovernorExecutiveAdapter,
  MakerDaoGovernorPollingAdapter,
} from '@boardroom/gov-adapters';

export const registerMakerDao: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'makerdao';
  register({
    cname: cname,
    name: 'Maker DAO',

    adapters: (adapters) => {
      const executiveGovernor = new MakerDaoGovernorExecutiveAdapter(
        '0x0a3f6849f78076aefaDf113F5BED87720274dDC0', // DSChief governance contract
        '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // token contract
        '0xd897f108670903d1d6070fcf818f9db3615af272', // vote delegate factory
        transports,
        cname
      );

      const pollingGovernor = new MakerDaoGovernorPollingAdapter(
        '0x0a3f6849f78076aefaDf113F5BED87720274dDC0', // DSChief governance contract
        '0xD3A9FE267852281a1e6307a1C37CDfD76d39b133', // polling contract
        '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // token contract
        '0x6FCD258af181B3221073A96dD90D1f7AE7eEc408', // voteProxyFactory address
        '0xd897f108670903d1d6070fcf818f9db3615af272', // vote delegate factory
        transports,
        cname
      );

      adapters.implement('proposals', executiveGovernor, 'onchain');
      adapters.implement('proposals', pollingGovernor, 'onchain-secondary');
    },
  }),
};

```
