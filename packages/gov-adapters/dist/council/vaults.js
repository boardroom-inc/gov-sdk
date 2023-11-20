"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVestingVaultDelegations = exports.getLockingVaultDelegations = void 0;
const ethers_1 = require("ethers");
const getLockingVaultDelegations = async (addresses, vaultAbi, vaultAddress, rpc) => {
    const lockingVaultContract = new ethers_1.Contract(vaultAddress, vaultAbi, rpc);
    const lockingVaultCalls = addresses.map((address) => { return lockingVaultContract.deposits(address); });
    const lockingVaultDelegationsArray = await Promise.all(lockingVaultCalls);
    return lockingVaultDelegationsArray.map((i, index) => { return { address: addresses[index], addressDelegatedTo: i[0] }; }); //get first element of struct: 'who'
};
exports.getLockingVaultDelegations = getLockingVaultDelegations;
const getVestingVaultDelegations = async (addresses, vaultAbi, vaultAddress, rpc) => {
    const vestingVaultContract = new ethers_1.Contract(vaultAddress, vaultAbi, rpc);
    const vestingVaultCalls = addresses.map((address) => { return vestingVaultContract.getGrant(address); });
    const vestingVaultDelegationsArray = await Promise.all(vestingVaultCalls);
    return vestingVaultDelegationsArray.map((i, index) => { return { address: addresses[index], addressDelegatedTo: i[6] }; }); //get seventh element of struct: 'delegatee'
};
exports.getVestingVaultDelegations = getVestingVaultDelegations;
//# sourceMappingURL=vaults.js.map