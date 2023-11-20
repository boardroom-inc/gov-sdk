import { Contract, ContractInterface, ethers } from 'ethers';

export const getLockingVaultDelegations = async (addresses: string[], vaultAbi: ContractInterface, vaultAddress:string, rpc:any) => {
    const lockingVaultContract = new Contract(vaultAddress, vaultAbi, rpc);
    const lockingVaultCalls = addresses.map((address)=>{return lockingVaultContract.deposits(address)})
    const lockingVaultDelegationsArray = await Promise.all(lockingVaultCalls);
    return lockingVaultDelegationsArray.map((i,index)=>{ return { address: addresses[index], addressDelegatedTo: i[0] }}) //get first element of struct: 'who'
  }
  
export const getVestingVaultDelegations = async(addresses: string[], vaultAbi: ContractInterface, vaultAddress:string, rpc:any) => {
    const vestingVaultContract = new Contract(vaultAddress, vaultAbi, rpc);
    const vestingVaultCalls = addresses.map((address)=>{return vestingVaultContract.getGrant(address)})
    const vestingVaultDelegationsArray = await Promise.all(vestingVaultCalls);
    return vestingVaultDelegationsArray.map((i,index)=>{ return { address: addresses[index], addressDelegatedTo: i[6] }}) //get seventh element of struct: 'delegatee'
  }