import { TransportResolver } from '@boardroom/gov-lib';

/*

  treasuryinfo via https://www.covalenthq.com/

  https://www.covalenthq.com/docs/api/#get-/v1/{chain_id}/address/{address}/balances_v2/

*/

const PROTOCOL = 'https';
const DOMAIN = 'api.covalenthq.com';
const API_VERSION = 'v1';
const API_KEY = 'ckey_49da45d0a3234757a78e826b4c4';
const PAGE_SIZE = 1000;

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

export class CovalentDataSource {
  constructor(private readonly transports: TransportResolver) {}
  async getBalanceInfo(addressOrAddresses: string | string[], chain_id: number): Promise<BalanceInfoResponse[]> {
    const arrayOfAddresses = typeof addressOrAddresses === 'string' ? [addressOrAddresses] : addressOrAddresses;

    const balancesInfoArray = await Promise.all(
      arrayOfAddresses.map(async (address) => {
        const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${address}/balances_v2/?&key=${API_KEY}`;
        const resp = await this.transports('http').getJson(url, 120); // caching for a while
        return resp.data.data;
      })
    );
    return balancesInfoArray;
  }

  async getTransactions(
    addressOrAddresses: string | string[],
    chain_id: number,
    pageNumber = 0
  ): Promise<TransactionsResponse> {
    const arrayOfAddresses = typeof addressOrAddresses === 'string' ? [addressOrAddresses] : addressOrAddresses;
    let hasMorePages = false;
    const transactionsArray = await Promise.all(
      arrayOfAddresses.map(async (address) => {
        const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${address}/transactions_v2/?&key=${API_KEY}&page-number=${pageNumber}&page-size=${PAGE_SIZE}&sort={block_signed_at:1}`;
        console.log("Getting transactions from: " + url)
        const resp = await this.transports('http').getJson(url, 120); // caching for a while
        // Certain addresses are not supported by covalent due to too much activity or being a gas address
        if (resp.response.status === 406 || resp.response.status === 501) {
          return [];
        }
        hasMorePages = !hasMorePages ? resp.data.data.pagination.has_more : hasMorePages;
        return resp.data.data;
      })
    );
    return {
      transactions: transactionsArray,
      hasMorePages,
      pageNumber,
    };
  }

  async getTransfers(
    treasuryAddress: string,
    tokenAddress: string,
    chain_id: number,
    pageNumber = 0
  ): Promise<TransferResponse> {
    const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${treasuryAddress}/transfers_v2/?&key=${API_KEY}&page-number=${pageNumber}&contract-address=${tokenAddress}&page-size=${PAGE_SIZE}&sort={block_signed_at:1}`;
    console.log("Getting transfers from: " + url)
    const resp = await this.transports('http').getJson(url, 120); // caching for a while
    let transfers = {
      address: treasuryAddress,
      chain_id: chain_id,
      items: []
    };
    let hasMorePages = false;
    // Certain addresses are not supported by covalent due to too much activity or being a gas address
    if (resp.response.status !== 406 && resp.response.status !== 501) {
      transfers = resp.data.data;
      if (resp.data.data.pagination === null) {
        hasMorePages = resp.data.data.pagination.has_more ? true : false;
      }
    }
    return {
      response: transfers,
      hasMorePages,
      pageNumber,
    };
  }
}
