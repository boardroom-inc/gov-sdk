---
stoplight-id: hxiq6d9v7db2s
---

# Council

**Council** has their own on-chain governance architecture, Collectively reffered as Council contracts

> You can view Aave's architecture and documentation on their [@element-fi/council](https://github.com/element-fi/council) GitHub repo.

### Using the Adapter 
A new protocol which uses **Council Governance** can be added to sdk by registering it as follows 

```js
export const registerElementDAO: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'elementdao';
  register({
    cname: cname,
    name: 'Element DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const council = new CouncilAdapter(
        '0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a', // coreVotingAddress
        '0x5c6D51ecBA4D8E4F20373e3ce96a62342B125D6d', // tokenAddress
        transports,
        cname,
        [
          {
            address: '0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD',
            abi: lockingVaultABI,
            getDelegations: getLockingVaultDelegations,
          },
          {
            address: '0x6De73946eab234F1EE61256F10067D713aF0e37A',
            abi: vestingVaultABI,
            getDelegations: getVestingVaultDelegations,
          },
        ], // votingVaults with the respective delegation functions 
        'https://elementfi.s3.us-east-2.amazonaws.com/mainnet.proposals.json' //proposalsOffChainDataURL
      );
      adapters.implement('proposals', council, 'onchain');
      // ... other adapters
    },
  });
};
```
