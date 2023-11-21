import { TransportResolver } from '@boardroom/gov-lib';
export interface BalanceInfoResponse {
    address: string;
    items: Array<{
        quote: number;
        balance: string;
        contract_address: string;
        contract_decimals: number;
        contract_name: string;
        contract_ticker_symbol: string;
        logo_url?: string;
    }>;
}
export interface Transaction {
    address: string;
    chain_id: number;
    items: Array<{
        tx_hash: string;
        value: string;
        from_address: string;
        to_address: string;
        gas_spent: number;
        block_height: number;
    }>;
}
export interface TransactionsResponse {
    transactions: Array<Transaction>;
    hasMorePages: boolean;
    pageNumber: number;
}
export interface TransferResult {
    address: string;
    chain_id: number;
    items: Array<{
        tx_hash: string;
        value: string;
        gas_spent: number;
        block_height: number;
        transfers: Array<TransferObj>;
    }>;
}
export interface TransferObj {
    from_address: string;
    to_address: string;
    delta_quote: number;
    transfer_type: string;
    contract_ticker_symbol: string;
    contract_address: string;
}
export interface TransferResponse {
    response: TransferResult;
    hasMorePages: boolean;
    pageNumber: number;
}
export declare class CovalentDataSource {
    private readonly transports;
    constructor(transports: TransportResolver);
    getBalanceInfo(addressOrAddresses: string | string[], chain_id: number): Promise<BalanceInfoResponse[]>;
    getTransactions(addressOrAddresses: string | string[], chain_id: number, pageNumber?: number): Promise<TransactionsResponse>;
    getTransfers(treasuryAddress: string, tokenAddress: string, chain_id: number, pageNumber?: number): Promise<TransferResponse>;
}
