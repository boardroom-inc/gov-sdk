import { StakingTokenAdapter, TransportResolver, TransactionHash } from '@boardroom/gov-lib';
import { Contract, utils } from 'ethers';

import ZeroXTokenAbi from './0xTokenAbi.json';
import StakedTokenAbi from './0xStakedTokenAbi.json';

export class ZeroXTokenStaking implements StakingTokenAdapter {
  constructor(
    private tokenAddress: string,
    private stakedTokenAddress: string,
    private readonly transports: TransportResolver,
    private readonly chainId?: number
  ) {}

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getAllowance(address: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const tokenContract = new Contract(this.tokenAddress, ZeroXTokenAbi, signer);
    const allowance = await tokenContract.allowance(address, this.stakedTokenAddress);
    return utils.formatUnits(allowance);
  }

  async approve(amountToApprove: string): Promise<TransactionHash> {
    const formatedAmount = utils.parseEther(amountToApprove);
    const signer = this.transports('signer').signer;
    const tokenContract = new Contract(this.tokenAddress, ZeroXTokenAbi, signer);
    const approveTransaction = await tokenContract.approve(this.stakedTokenAddress, formatedAmount);
    return approveTransaction.hash;
  }

  async stake(address: string, amountToStake: string): Promise<TransactionHash> {
    const formatedAmount = utils.parseEther(amountToStake);
    const signer = this.transports('signer').signer;
    const stakedTokenContract = new Contract(this.stakedTokenAddress, StakedTokenAbi, signer);
    const transaction = await stakedTokenContract.depositFor(address, formatedAmount);

    return transaction.hash;
  }

  async unStake(address: string, amountToStake: string): Promise<TransactionHash> {
    const signer = this.transports('signer').signer;
    const formatedAmount = utils.parseEther(amountToStake);
    const stakedTokenContract = new Contract(this.stakedTokenAddress, StakedTokenAbi, signer);
    const transaction = await stakedTokenContract.withdrawTo(address, formatedAmount);

    return transaction.hash;
  }

  async getStakedTokenBalance(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const stakedTokenContract = new Contract(this.stakedTokenAddress, StakedTokenAbi, rpc);
    const balance = await stakedTokenContract.balanceOf(address);
    return utils.formatUnits(balance);
  }

  async getTokenBalance(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const tokenContract = new Contract(this.tokenAddress, ZeroXTokenAbi, rpc);
    const balance = await tokenContract.balanceOf(address);
    return utils.formatUnits(balance);
  }
}
