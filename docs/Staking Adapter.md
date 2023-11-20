---
stoplight-id: bw0wmiz88u0ss
---

# Staking Adapter

A protocol integration can implement an adapter with the Staking Adapter interface to allow a user to Stake/Deposit or Unstake/Withdraw Assets 

### Interface

```js
export interface StakingTokenAdapter {
  getAllowance: (address: string) => Promise<Allowance>;
  approve: (amountToApprove: string) => Promise<TransactionHash>;
  stake: (address: string, amountToStake: string) => Promise<TransactionHash>;
  unStake: (address: string, amountToUnStake: string) => Promise<TransactionHash>;
  getStakedTokenBalance: (address: string) => Promise<string>;
  getTokenBalance: (address: string) => Promise<string>;
  getChainId: () => Promise<ChainId>;
}
```
### Usage

Staking or Unstaking assets require address of the signer and the amount to stake or unstake. After submitting, both the methods return transaction hash.    

```js
const protocol = sdk.getProtocol(cname);

const txnHash = await protocol.adapter('staking').stake(address, amountToStake);
const txnHash = await protocol.adapter('staking').unStake(address, amountToStake);
```

Staking Adapter exposes few public methods which can be used for helping to take user actions

```js
 const protocol = sdk.getProtocol(cname);

// returns allowance approved by the address for staking
const allowedLimitForStaking = await protocol.adapter('staking').getAllowance(address); 

// returns transaction hash
// can be used if address needs to increase allowance for staking
const txnHash = await protocol.adapter('staking').approve(amountToApprove); 

// returns the chainId on which the contract is deployed for interaction 
const chainId = await protocol.adapter('staking').getChainId();

// returns promise of staked token balance
const chainId = await protocol.adapter('staking').getStakedTokenBalance(address);

// returns promise of token balance
const chainId = await protocol.adapter('staking').getTokenBalance(address);
