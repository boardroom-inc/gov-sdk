"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteFunctionsSelectors = exports.FunctionsSelectors = exports.TransfersResponse = exports.Transfers = exports.Transfer = exports.TransactionsResponse = exports.Transactions = exports.Transaction = exports.CurrencyTokenBalancesInfo = exports.TokenBalancesInfo = exports.compareTime = exports.Time = exports.CurrencyAmount = exports.Currency = exports.ContractAddress = exports.Addresses = exports.Address = exports.AdapterInstanceType = exports.Framework = exports.Network = exports.ChainId = exports.ExternalLink = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.ExternalLink = typebox_1.Type.Object({
    url: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
});
exports.ChainId = typebox_1.Type.Number();
exports.Network = typebox_1.Type.Union([
    typebox_1.Type.Literal('ethereum'),
    typebox_1.Type.Literal('polygon-pos'),
    typebox_1.Type.Literal('binance-smart-chain'),
    typebox_1.Type.Literal('optimistic-ethereum'),
    typebox_1.Type.Literal('arbitrum-one')
    // additional chains go here.
]);
exports.Framework = typebox_1.Type.Union([
    typebox_1.Type.Literal('snapshot'),
    typebox_1.Type.Literal('aave'),
    typebox_1.Type.Literal('openZeppelin'),
    typebox_1.Type.Literal('compoundAlpha'),
    typebox_1.Type.Literal('compoundBravo'),
    typebox_1.Type.Literal('nouns'),
    typebox_1.Type.Literal('moloch'),
    typebox_1.Type.Literal('tornadoCash'),
    typebox_1.Type.Literal('makerDaoPolling'),
    typebox_1.Type.Literal('makerDaoExecutive'),
    typebox_1.Type.Literal('council'),
    typebox_1.Type.Literal('nounsBuilder'),
    // additional frameworks go here
]);
exports.AdapterInstanceType = typebox_1.Type.Union([
    typebox_1.Type.Literal('snapshot'),
    typebox_1.Type.Literal('onchain'),
    typebox_1.Type.Literal('onchain-secondary'),
    typebox_1.Type.Literal('onchain-optimism'),
    typebox_1.Type.Literal('onchain-arbitrum'),
    typebox_1.Type.Literal('archive'),
    typebox_1.Type.Literal('archiveAlpha'), // Shouldn't be used much, only here for legacy reasons
]);
exports.Address = typebox_1.Type.String();
exports.Addresses = typebox_1.Type.Object({
    addresses: typebox_1.Type.Array(typebox_1.Type.String()),
});
exports.ContractAddress = typebox_1.Type.Object({
    network: exports.Network,
    address: typebox_1.Type.String(),
});
exports.Currency = typebox_1.Type.Union([
    typebox_1.Type.Literal('usd'),
    // additional currencies go here
]);
exports.CurrencyAmount = typebox_1.Type.Object({
    currency: exports.Currency,
    amount: typebox_1.Type.Number(),
});
exports.Time = typebox_1.Type.Union([
    typebox_1.Type.Object({
        timestamp: typebox_1.Type.Integer(),
    }),
    typebox_1.Type.Object({
        blockNumber: typebox_1.Type.Integer(),
    }),
]);
/**
 * Evaluate an expression comparing the numerical values of two Times.  Throws
 * if not of the same type
 */
const compareTime = (a, b, compare) => {
    if ('blockNumber' in a && 'blockNumber' in b) {
        return Boolean(compare(a.blockNumber, b.blockNumber));
    }
    else if ('timestamp' in a && 'timestamp' in b) {
        return Boolean(compare(a.timestamp, b.timestamp));
    }
    throw new Error();
};
exports.compareTime = compareTime;
exports.TokenBalancesInfo = typebox_1.Type.Object({
    tokenBalance: typebox_1.Type.String(),
    balance: typebox_1.Type.Number(),
    tokenContractAddress: typebox_1.Type.String(),
    tokenDecimals: typebox_1.Type.Number(),
    tokenName: typebox_1.Type.String(),
    tokenSymbol: typebox_1.Type.String(),
    tokenLogoUrl: typebox_1.Type.String(),
});
exports.CurrencyTokenBalancesInfo = typebox_1.Type.Object({
    currency: exports.Currency,
    tokenBalances: typebox_1.Type.Array(exports.TokenBalancesInfo),
});
exports.Transaction = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    chainId: typebox_1.Type.Integer(),
    txnHash: typebox_1.Type.String(),
    value: typebox_1.Type.String(),
    fromAddress: typebox_1.Type.String(),
    toAddress: typebox_1.Type.String(),
    gasSpent: typebox_1.Type.Integer(),
    blockHeight: typebox_1.Type.Integer(),
});
exports.Transactions = typebox_1.Type.Array(exports.Transaction);
exports.TransactionsResponse = typebox_1.Type.Object({
    transactions: exports.Transactions,
    pageNumber: typebox_1.Type.Integer(),
    hasMorePages: typebox_1.Type.Boolean(),
});
exports.Transfer = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    chainId: typebox_1.Type.Integer(),
    txnHash: typebox_1.Type.String(),
    value: typebox_1.Type.String(),
    gasSpent: typebox_1.Type.Integer(),
    blockHeight: typebox_1.Type.Integer(),
    transfer: typebox_1.Type.Object({
        from_address: typebox_1.Type.String(),
        to_address: typebox_1.Type.String(),
        delta_quote: typebox_1.Type.String(),
        transfer_type: typebox_1.Type.String(),
        contract_ticker_symbol: typebox_1.Type.String(),
        contract_address: typebox_1.Type.String(),
    }),
});
exports.Transfers = typebox_1.Type.Array(exports.Transfer);
exports.TransfersResponse = typebox_1.Type.Object({
    transfers: exports.Transfers,
    pageNumber: typebox_1.Type.Integer(),
    hasMorePages: typebox_1.Type.Boolean(),
});
exports.FunctionsSelectors = typebox_1.Type.Array(typebox_1.Type.String());
exports.VoteFunctionsSelectors = typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Array(typebox_1.Type.String()));
//# sourceMappingURL=common.js.map