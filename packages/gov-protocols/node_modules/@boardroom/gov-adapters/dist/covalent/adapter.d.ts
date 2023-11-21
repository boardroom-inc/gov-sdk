import { Currency, CurrencyTokenBalancesInfo, TransportResolver, TreasuryAdapter, TransactionsResponse, TransfersResponse, Addresses } from '@boardroom/gov-lib';
export declare class CovalentAdapter implements TreasuryAdapter {
    private readonly addressOrAddresses;
    private readonly chainId;
    private readonly covalent;
    private readonly filterList;
    private readonly maxBalance;
    constructor(addressOrAddresses: string | string[], chainId: number, transports: TransportResolver);
    getTreasuryAddresses(): Promise<Addresses>;
    getBalance(currency?: Currency): Promise<{
        currency: Currency;
        amount: number;
    }>;
    getTransactions(currency?: Currency, pageNumber?: number, treasuryAddress?: string): Promise<TransactionsResponse>;
    getTransfers(treasuryAddress: string, tokenAddress: string, currency?: Currency, pageNumber?: number): Promise<TransfersResponse>;
    getTokenBalances(currency?: Currency): Promise<CurrencyTokenBalancesInfo>;
}
