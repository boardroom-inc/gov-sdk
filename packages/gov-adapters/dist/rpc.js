"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryEventLogs = void 0;
const gov_lib_1 = require("@boardroom/gov-lib");
const orderBy_1 = __importDefault(require("lodash/orderBy"));
const uniswap_hotfix_1 = require("./uniswap-hotfix");
/**
 * Query an RPC endpoint for event logs
 *
 * TODO: this will only handle up to 10K logs in a response, and theres not a
 * way to specify a limit (just a block range).  Will need to update this to
 * accomodate reading large amounts of logs
 *
 * see: https://docs.alchemy.com/alchemy/guides/eth_getlogs#making-a-request-to-eth-get-logs
 */
const queryEventLogs = async (query, startBlock, endBlock) => {
    var _a, _b;
    // use the contract abstraction filter util to compute the event signature,
    // bit of a hack but makes it so we dont have to provide the entire sig and
    // keccak it ourselves
    const topics = query.events.flatMap((e) => { var _a; return ((_a = query.contract.filters[e]().topics) !== null && _a !== void 0 ? _a : [])[0]; });
    const cursor = (0, gov_lib_1.decodeCursor)(query.cursor);
    const fromBlock = cursor ? cursor.block - 1 : 1;
    let resp;
    if (startBlock !== undefined && endBlock !== undefined) {
        resp = await query.rpc.getLogs({
            fromBlock: startBlock,
            toBlock: endBlock,
            address: query.contract.address,
            topics: [topics, ...((_a = query.params) !== null && _a !== void 0 ? _a : [])],
        });
    }
    else {
        resp = await query.rpc.getLogs({
            fromBlock,
            toBlock: 'latest',
            address: query.contract.address,
            topics: [topics, ...((_b = query.params) !== null && _b !== void 0 ? _b : [])],
        });
    }
    // ensure event logs are alway sorted ascending
    let sorted = (0, orderBy_1.default)(resp, ['blockNumber', 'logIndex'], ['asc', 'asc']);
    // if a cursor was provided, ensure we filter out anything that as already
    // included in a previous pass
    if (cursor) {
        sorted = sorted.filter((e) => e.blockNumber > cursor.block || (e.blockNumber === cursor.block && e.logIndex > cursor.log));
    }
    // if there is at least one item, return a cursor, otherwise signal end by not
    // returning one
    let nextCursor = undefined;
    if (sorted.length > 0) {
        const lastItem = sorted[sorted.length - 1];
        nextCursor = (0, gov_lib_1.encodeCursor)({ block: lastItem.blockNumber, log: lastItem.logIndex });
    }
    // project the events into the parsed log and cursor
    const items = sorted.map((event) => {
        try {
            return {
                event,
                parsed: query.contract.interface.parseLog(event),
            };
        }
        catch (err) {
            // try again w/ the uniswap patch
            const patched = (0, uniswap_hotfix_1.uniswapEthersEventParseLogHotfix)(event.data);
            const parsed = query.contract.interface.parseLog({ ...event, data: patched });
            return { event, parsed };
        }
    });
    return { items, nextCursor };
};
exports.queryEventLogs = queryEventLogs;
//# sourceMappingURL=rpc.js.map