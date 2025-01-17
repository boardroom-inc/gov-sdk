import {
  Currency,
  CurrencyTokenBalancesInfo,
  TransportResolver,
  TreasuryAdapter,
  TokenBalancesInfo,
  Transactions,
  TransactionsResponse,
  Transfers,
  TransfersResponse,
  Addresses,
} from '@boardroom/gov-lib';
import { BigNumber } from 'ethers';
import { CovalentDataSource } from './api';

export class CovalentAdapter implements TreasuryAdapter {
  private readonly covalent: CovalentDataSource;

  private readonly filterList: string[];
  private readonly maxBalance = 20000000000; // 20 Billion

  /*
    chainId's

    Ethereum	1
    Polygon/Matic	137
    Avalanche C-Chain	43114
    Binance Smart Chain	56
    Fantom Opera	250
  */

  constructor(
    private readonly addressOrAddresses: string | string[],
    private readonly chainId: number,
    transports: TransportResolver
  ) {
    this.covalent = new CovalentDataSource(transports);
    this.filterList = [
      '0x48b07d22465bc34698d5da4f6dd8f0b7e26a0abd', // Hello
      '0xb5585afebbb9d955da797845b3e0c41b3ff047ce', // Hi
      '0xd123c11ac97e125e12bcc276da07cc3d44bfd4ed', // Biconomy
      '0x7cf56db0f7781d478d5a96f6ee8e0b5cbaaf8ad2', // Omicron
      '0xbfa0d33f3155321934e4e4334567b9b7c017c90d', // Meta
    ];
  }

  async getTreasuryAddresses(): Promise<Addresses> {
    return typeof this.addressOrAddresses === 'string'
      ? { addresses: [this.addressOrAddresses] }
      : { addresses: this.addressOrAddresses };
  }

  async getBalance(
    currency: Currency = 'usd'
  ): Promise<{
    currency: Currency;
    amount: number;
  }> {
    if (currency !== 'usd') throw new Error('unsupported currency param, CovalentAdapter only supports "usd"');
    const data = await this.covalent.getBalanceInfo(this.addressOrAddresses, this.chainId);
    const amount = data.reduce((balanceAcc, balanceInfoOfAnAddress) => {
      const filteredItems = balanceInfoOfAnAddress.items
        .filter((res) => {
          return !this.filterList.includes(res.contract_address);
        })
        .filter((res) => {
          if (res.quote < this.maxBalance) {
            return true;
          }
          console.log('WARN: Balance was too high to be included in output');
          return false;
        });
      return filteredItems.reduce((acc, token) => token.quote + acc, balanceAcc);
    }, 0);

    return {
      currency,
      amount,
    };
  }

  async getTransactions(
    currency: Currency = 'usd',
    pageNumber = 0,
    treasuryAddress = ''
  ): Promise<TransactionsResponse> {
    if (currency !== 'usd') throw new Error('unsupported currency param, CovalentAdapter only supports "usd"');
    const allTransactions: Transactions = [];

    // Default to using all the addresses, but if one is passed in then use that instead
    let treasuryAddresses = this.addressOrAddresses;
    if (treasuryAddress !== '') {
      treasuryAddresses = [treasuryAddress];
    }
    const { transactions, hasMorePages } = await this.covalent.getTransactions(
      treasuryAddresses,
      this.chainId,
      pageNumber
    );

    if (transactions) {
      transactions.forEach((addressResponse) => {
        if (addressResponse.items) {
          addressResponse.items.forEach((item) => {
            // Ensure that the addresses in the response are valid strings
            const fromAddress = item.from_address === null ? '' : item.from_address;
            const toAddress = item.to_address === null ? '' : item.to_address;
            allTransactions.push({
              address: addressResponse.address,
              chainId: this.chainId,
              txnHash: item.tx_hash,
              value: item.value,
              fromAddress: fromAddress,
              toAddress: toAddress,
              gasSpent: item.gas_spent,
              blockHeight: item.block_height,
            });
          });
        }
      });
    }
    return {
      transactions: allTransactions,
      pageNumber,
      hasMorePages,
    };
  }

  async getTransfers(
    treasuryAddress: string,
    tokenAddress: string,
    currency: Currency = 'usd',
    pageNumber = 0
  ): Promise<TransfersResponse> {
    if (currency !== 'usd') throw new Error('unsupported currency param, CovalentAdapter only supports "usd"');
    const allTransfers: Transfers = [];
    const { response, hasMorePages } = await this.covalent.getTransfers(
      treasuryAddress,
      tokenAddress,
      this.chainId,
      pageNumber
    );

    if (response.items) {
      response.items.forEach((item) => {
        item.transfers.forEach((transfer) => {
          // Ensure that parts of the results are always valid
          const fromAddress = transfer.from_address === null ? '' : transfer.from_address;
          const toAddress = transfer.to_address === null ? '' : transfer.to_address;
          const deltaQuote = transfer.delta_quote === null ? '' : transfer.delta_quote.toString();
          const transferType = transfer.transfer_type === null ? '' : transfer.transfer_type;
          allTransfers.push({
            address: response.address,
            chainId: this.chainId,
            txnHash: item.tx_hash,
            value: item.value,
            gasSpent: item.gas_spent,
            blockHeight: item.block_height,
            transfer: {
              from_address: fromAddress,
              to_address: toAddress,
              delta_quote: deltaQuote,
              transfer_type: transferType,
              contract_ticker_symbol: transfer.contract_ticker_symbol,
              contract_address: transfer.contract_address,
            },
          });
        });
      });
    }
    return {
      transfers: allTransfers,
      pageNumber,
      hasMorePages,
    };
  }

  async getTokenBalances(currency: Currency = 'usd'): Promise<CurrencyTokenBalancesInfo> {
    if (currency !== 'usd') throw new Error('unsupported currency param, CovalentAdapter only supports "usd"');
    const data = await this.covalent.getBalanceInfo(this.addressOrAddresses, this.chainId);

    /*
      Data returned by getBalanceInfo will have array of items if multiple treasury addresses are used
      These items can have duplicate entries of same symbols so making objects by contract addresses so we can
      add the values of blances and token balances to the previous tokenBalanceInfo entry
      i.e synthetix has couple of treasury addresses and both have SNX, ETH. Combining them into one entry with overall balances
    */

    const tokenBalancesByContractAddress = data.reduce((balanceInfoAccByAddress, tokenBalanceByATreasuryAddress) => {
      let previousTreasuryAddressTokensInfo = balanceInfoAccByAddress;

      const filteredItems = tokenBalanceByATreasuryAddress.items
        .filter((res) => {
          return !this.filterList.includes(res.contract_address);
        })
        .filter((res) => {
          return res.contract_name !== null;  
        })
        .filter((res) => {
          if (res.quote < this.maxBalance) {
            return true;
          }
          console.log('WARN: Balance was too high to be included in output');
          return false;
        });

      const formattedTokenBalanceInfo = filteredItems.reduce((balanceInfoAccByContractAddress, tokenBalanceInfo) => {
        if (previousTreasuryAddressTokensInfo[tokenBalanceInfo.contract_address]) {
          // this contract address already exists so modifying previous values of balance and tokenBalance

          const tokenInfoInPreviousAddress = previousTreasuryAddressTokensInfo[tokenBalanceInfo.contract_address];
          previousTreasuryAddressTokensInfo = {
            ...previousTreasuryAddressTokensInfo,
            [tokenBalanceInfo.contract_address]: {
              ...tokenInfoInPreviousAddress,
              balance: tokenBalanceInfo.quote + tokenInfoInPreviousAddress.balance,
              tokenBalance: BigNumber.from(tokenBalanceInfo.balance)
                .add(BigNumber.from(tokenInfoInPreviousAddress.tokenBalance))
                .toString(),
            },
          };

          return balanceInfoAccByContractAddress;
        }

        return {
          ...balanceInfoAccByContractAddress,
          [tokenBalanceInfo.contract_address]: {
            tokenBalance: tokenBalanceInfo.balance,
            balance: tokenBalanceInfo.quote,
            tokenContractAddress: tokenBalanceInfo.contract_address,
            tokenDecimals: tokenBalanceInfo.contract_decimals,
            tokenName: tokenBalanceInfo.contract_name,
            tokenSymbol: tokenBalanceInfo.contract_ticker_symbol,
            tokenLogoUrl: '',
          },
        };
      }, {} as Record<string, TokenBalancesInfo>);

      return { ...previousTreasuryAddressTokensInfo, ...formattedTokenBalanceInfo };
    }, {} as Record<string, TokenBalancesInfo>);

    const tokenBalances = Object.values(tokenBalancesByContractAddress);

    return {
      currency,
      tokenBalances,
    };
  }
}
