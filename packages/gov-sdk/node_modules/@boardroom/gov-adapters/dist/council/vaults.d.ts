import { ContractInterface } from 'ethers';
export declare const getLockingVaultDelegations: (addresses: string[], vaultAbi: ContractInterface, vaultAddress: string, rpc: any) => Promise<{
    address: string;
    addressDelegatedTo: any;
}[]>;
export declare const getVestingVaultDelegations: (addresses: string[], vaultAbi: ContractInterface, vaultAddress: string, rpc: any) => Promise<{
    address: string;
    addressDelegatedTo: any;
}[]>;
