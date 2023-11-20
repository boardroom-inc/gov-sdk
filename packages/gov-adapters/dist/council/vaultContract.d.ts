import { BigNumber, ContractInterface } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type VoteChange = ParsedEvent<'VoteChange', {
    from: string;
    to: string;
    amount: BigNumber;
}>;
export declare type DelegateChangeEvents = VoteChange;
export declare class VaultContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, vaultAbi: ContractInterface, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
}
