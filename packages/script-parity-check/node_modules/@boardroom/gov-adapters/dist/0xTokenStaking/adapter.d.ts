import { StakingTokenAdapter, TransportResolver, TransactionHash } from '@boardroom/gov-lib';
export declare class ZeroXTokenStaking implements StakingTokenAdapter {
    private tokenAddress;
    private stakedTokenAddress;
    private readonly transports;
    private readonly chainId?;
    constructor(tokenAddress: string, stakedTokenAddress: string, transports: TransportResolver, chainId?: number | undefined);
    getChainId(): Promise<number>;
    getAllowance(address: string): Promise<string>;
    approve(amountToApprove: string): Promise<TransactionHash>;
    stake(address: string, amountToStake: string): Promise<TransactionHash>;
    unStake(address: string, amountToStake: string): Promise<TransactionHash>;
    getStakedTokenBalance(address: string): Promise<string>;
    getTokenBalance(address: string): Promise<string>;
}
