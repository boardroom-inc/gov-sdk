"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroXTokenStaking = void 0;
const ethers_1 = require("ethers");
const _0xTokenAbi_json_1 = __importDefault(require("./0xTokenAbi.json"));
const _0xStakedTokenAbi_json_1 = __importDefault(require("./0xStakedTokenAbi.json"));
class ZeroXTokenStaking {
    constructor(tokenAddress, stakedTokenAddress, transports, chainId) {
        this.tokenAddress = tokenAddress;
        this.stakedTokenAddress = stakedTokenAddress;
        this.transports = transports;
        this.chainId = chainId;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getAllowance(address) {
        const signer = this.transports('signer').signer;
        const tokenContract = new ethers_1.Contract(this.tokenAddress, _0xTokenAbi_json_1.default, signer);
        const allowance = await tokenContract.allowance(address, this.stakedTokenAddress);
        return ethers_1.utils.formatUnits(allowance);
    }
    async approve(amountToApprove) {
        const formatedAmount = ethers_1.utils.parseEther(amountToApprove);
        const signer = this.transports('signer').signer;
        const tokenContract = new ethers_1.Contract(this.tokenAddress, _0xTokenAbi_json_1.default, signer);
        const approveTransaction = await tokenContract.approve(this.stakedTokenAddress, formatedAmount);
        return approveTransaction.hash;
    }
    async stake(address, amountToStake) {
        const formatedAmount = ethers_1.utils.parseEther(amountToStake);
        const signer = this.transports('signer').signer;
        const stakedTokenContract = new ethers_1.Contract(this.stakedTokenAddress, _0xStakedTokenAbi_json_1.default, signer);
        const transaction = await stakedTokenContract.depositFor(address, formatedAmount);
        return transaction.hash;
    }
    async unStake(address, amountToStake) {
        const signer = this.transports('signer').signer;
        const formatedAmount = ethers_1.utils.parseEther(amountToStake);
        const stakedTokenContract = new ethers_1.Contract(this.stakedTokenAddress, _0xStakedTokenAbi_json_1.default, signer);
        const transaction = await stakedTokenContract.withdrawTo(address, formatedAmount);
        return transaction.hash;
    }
    async getStakedTokenBalance(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const stakedTokenContract = new ethers_1.Contract(this.stakedTokenAddress, _0xStakedTokenAbi_json_1.default, rpc);
        const balance = await stakedTokenContract.balanceOf(address);
        return ethers_1.utils.formatUnits(balance);
    }
    async getTokenBalance(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const tokenContract = new ethers_1.Contract(this.tokenAddress, _0xTokenAbi_json_1.default, rpc);
        const balance = await tokenContract.balanceOf(address);
        return ethers_1.utils.formatUnits(balance);
    }
}
exports.ZeroXTokenStaking = ZeroXTokenStaking;
//# sourceMappingURL=adapter.js.map