"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakerDaoGovernorPollingAdapter = void 0;
const ethers_1 = require("ethers");
const abi_dschief_json_1 = __importDefault(require("./abi-dschief.json"));
const abi_polling_json_1 = __importDefault(require("./abi-polling.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const abi_vote_proxy_json_1 = __importDefault(require("./abi-vote-proxy.json"));
const abi_vote_proxy_factory_json_1 = __importDefault(require("./abi-vote-proxy-factory.json"));
const abi_vote_delegate_factory_json_1 = __importDefault(require("./abi-vote-delegate-factory.json"));
const abi_vote_delegate_json_1 = __importDefault(require("./abi-vote-delegate.json"));
const utils_1 = require("ethers/lib/utils");
const graphql_request_1 = require("graphql-request");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for MakerDao Governor
 */
class MakerDaoGovernorPollingAdapter {
    constructor(config) {
        var _a;
        this.chiefAddress = config.chiefAddress;
        this.pollingAddress = config.pollingAddress;
        this.tokenAddress = config.tokenAddress;
        this.voteProxyFactoryAddress = config.voteProxyFactoryAddress;
        this.voteDelegateFactoryAddress = config.voteDelegateFactoryAddress;
        this.transports = config.transports;
        this.protocolName = config.protocolName;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.boardroomAPIKey = config.boardroomAPIKey;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getSnapshotSpaceName() {
        return '';
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.pollingAddress}`,
        };
    }
    async getFramework() {
        return 'makerDaoPolling';
    }
    async getProposalCreationFunctionsSelectors() {
        return [];
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['vote'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_polling_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        return [];
    }
    async getProposalCreationContractAddress() {
        return '';
    }
    async getDelegationContractAddress() {
        return '';
    }
    async getVotingContractAddress() {
        return this.pollingAddress;
    }
    async getProposals(pagination = {}) {
        const query = (0, graphql_request_1.gql) `
    query activePolls($first: Int, $before: Cursor, $last: Int, $after: Cursor, $offset: Int, $filter: ActivePollsRecordFilter) {
        edges {
          node {
            creator
            pollId
            blockCreated
            startDate
            endDate
            multiHash
            url
          }
          cursor
        }
    }
    `;
        let cursor = null;
        if (pagination.cursor) {
            cursor = pagination.cursor;
        }
        const data = {
            "query": query.toString(),
            "variables": {
                "first": 10,
                "after": cursor
            },
            "operationName": "activePolls"
        };
        const http = this.transports('http');
        const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', data);
        const proposalData = resp.data.data;
        const proposals = [];
        let nextCursor = null;
        for (const p of proposalData.activePolls.edges) {
            let proposalUrl = p.node.url;
            if (p.node.url.includes('github.com')) {
                proposalUrl = proposalUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
            }
            if (p.node.url.includes('%3F')) {
                proposalUrl = proposalUrl.replace('%3F', '');
            }
            if (p.node.url.includes('%3A')) {
                proposalUrl = proposalUrl.replace('%3A', ' -');
            }
            if (p.node.url.includes('.md.md')) {
                proposalUrl = proposalUrl.replace('.md.md', '.md');
            }
            if (p.node.url.includes('Reduce%20the%20Box%20Parameter%20-%20%20September%2014%2C%202020.md') ||
                p.node.url.includes('Increase%20the%20Dust%20Parameter%20for%20ETH-B%20Vault%20Type%20-%20March%2015%2C%202021.md')) {
                continue;
            }
            const pollData = await http.fetch(proposalUrl);
            const pollText = await pollData.text();
            const [start, pollInfo, ...content] = pollText.split('---');
            if (!pollInfo) {
                console.log(proposalUrl);
                throw new Error('pollText was malformed');
            }
            const title = pollInfo.match(/title:.*/);
            if (!title) {
                console.log(pollText);
                throw new Error('Could not extract title from poll text');
            }
            else {
                if (title[0].startsWith("title: ")) {
                    title[0] = title[0].substring(7);
                }
            }
            const optionSnippet = pollInfo.match(/options:((.|\n)*)/);
            if (!optionSnippet) {
                console.log(pollText);
                throw new Error('Could not extract options from poll text');
            }
            const optionArray = [...optionSnippet[1].matchAll(/\d: (.*)/g)];
            if (!optionArray) {
                console.log(pollText);
                throw new Error('Could not extract options from option snippet');
            }
            const choices = optionArray.map((o) => o[1]);
            let type = 'single-choice';
            const scores = [];
            try {
                const propData = await http.getJson('https://vote.makerdao.com/api/polling/tally/' + p.node.pollId.toString());
                if (propData.response.status === 200) {
                    if (propData.data.parameters.inputFormat.type === 'rank-free') {
                        type = 'ranked-choice';
                    }
                    for (const vote of propData.data.votesByAddress) {
                        scores.push({
                            choice: vote.ballot[0].toString(),
                            total: parseFloat(vote.mkrSupport).toFixed(4),
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
            const proposal = {
                id: p.node.pollId.toString(),
                title: title[0],
                proposer: p.node.creator,
                externalUrl: proposalUrl,
                content: content.join(),
                choices: choices,
                blockNumber: p.node.blockCreated,
                type: type,
                scores: scores,
                startTime: { timestamp: p.node.startDate },
                endTime: { timestamp: p.node.endDate },
            };
            proposals.push(proposal);
            nextCursor = p.cursor;
        }
        if (nextCursor === null) {
            nextCursor = cursor;
        }
        return { items: proposals, nextCursor: nextCursor };
    }
    async getProposalEvents(pagination = {}) {
        /**
         * Since we are using the apis in getProposals there won't be any events.
         */
        return { items: [] };
    }
    async getVotes(pagination = {}) {
        // To periodically get votes proposalIds in the pagination options should be used.
        // https://vote.makerdao.com/api/polling/tally/800 where 800 is the pollId
        const http = this.transports('http');
        const items = [];
        if (pagination.proposalIds) {
            for (const pollId of pagination.proposalIds) {
                const voteResponse = await http.getJson('https://vote.makerdao.com/api/polling/tally/' + pollId);
                if (voteResponse.response.status === 200) {
                    const votes = voteResponse.data.votesByAddress;
                    for (const vote of votes) {
                        items.push({
                            address: vote.voter,
                            choice: vote.ballot,
                            power: parseFloat(parseFloat(vote.mkrSupport).toFixed(4)),
                            time: { timestamp: 0 },
                            proposalId: pollId.toString(),
                        });
                    }
                }
            }
        }
        return { items };
    }
    async getEncodedCastVoteData({ proposalId, choice, address }) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        let encodedData, voteDelegateProxyAddress = '';
        const hasDelegateProxy = await this._hasDelegateProxy(rpc, address);
        if (hasDelegateProxy) {
            voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
            const contract = new ethers_1.Contract(voteDelegateProxyAddress, abi_vote_delegate_json_1.default, rpc);
            const functionSignature = contract.interface.getSighash('votePoll');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
        }
        else {
            const contract = new ethers_1.Contract(this.pollingAddress, abi_polling_json_1.default, rpc);
            const functionSignature = contract.interface.getSighash('vote');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
        }
        return {
            encodedData,
            toContractAddress: hasDelegateProxy ? voteDelegateProxyAddress : this.pollingAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice } = params;
        let { identifier } = params;
        const signer = this.transports('signer').signer;
        const rpc = this.transports('rpc').network(await this.getChainId());
        const address = await signer.getAddress();
        let res;
        if (await this._hasDelegateProxy(rpc, address)) {
            const voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
            const contract = new ethers_1.Contract(voteDelegateProxyAddress, abi_vote_delegate_json_1.default, signer);
            res = await contract.votePoll(proposalId, choice);
        }
        else {
            const contract = new ethers_1.Contract(this.pollingAddress, abi_polling_json_1.default, signer);
            res = await contract.vote(proposalId, choice);
        }
        try {
            identifier = identifier !== null && identifier !== void 0 ? identifier : 'default';
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'castVoteMakerDaoPolling',
                hashId: res.hash,
                proposalId: proposalId,
                userAddress: address,
                identifier,
                separateAction: 'castVote',
                separateFramework: await this.getFramework(),
            });
        }
        catch (err) {
            console.log(err);
        }
        return res.hash;
    }
    async _hasDelegateProxy(rpc, address) {
        const iface = new utils_1.Interface(abi_vote_delegate_factory_json_1.default);
        const callData = iface.encodeFunctionData('isDelegate', [address]);
        const result = await rpc.call({
            to: this.voteDelegateFactoryAddress,
            data: callData,
        });
        // If the decoded result is a 1 that means it does have a delegate proxy
        return ethers_1.ethers.utils.hexValue(ethers_1.BigNumber.from(result).toHexString()) === '0x1';
    }
    async _getDelegateProxyAddress(rpc, address) {
        const iface = new utils_1.Interface(abi_vote_delegate_factory_json_1.default);
        const callData = iface.encodeFunctionData('delegates', [address]);
        const result = await rpc.call({
            to: this.voteDelegateFactoryAddress,
            data: callData,
        });
        const delegateProxyAddress = '0x' + result.substring(result.length - 40);
        return delegateProxyAddress;
    }
    async getVotePower(addresses, blockHeight) {
        /**
         * https://dux.makerdao.network/how-to-calculate-polling-results
         * The voting power associated with each vote is based on the total MKR balance of the voter at the block that the poll ends on.
         * Below are the calculations for total MKR balance:
    
         * If the voter has an active vote proxy(*), sum up the following balances:
         * MKR tokens stored in the hot wallet
         * MKR tokens stored in the cold wallet (unless cold wallet is the same as hot wallet)
         * MKR tokens deposited into chiefs (1.1 and 1.2) by their active vote proxy
         * MKR tokens deposited into chiefs (1.1 and 1.2) by their hot wallet
         * MKR tokens deposited into chiefs (1.1 and 1.2) by their cold wallet (unless cold wallet is the same as hot wallet)
         * MKR in the vote proxy contract (this should be 0, since any MKR sent directly to a vote proxy is unrecoverable)
    
         * If the voter does not have an active vote proxy, sum up the following balances:
         * MKR tokens stored in the address
         * MKR tokens deposited into chiefs (1.1 and 1.2) by the address
         */
        const rpc = this.transports('rpc').network(await this.getChainId());
        // If an address has a delegate address we want to get the vote power of the delegate address instead
        const addressListWithDelegateAddresses = [];
        const addressDelegateMap = new Map();
        for (const address of addresses) {
            if (await this._hasDelegateProxy(rpc, address)) {
                addressListWithDelegateAddresses.push(await this._getDelegateProxyAddress(rpc, address));
                addressDelegateMap.set(await this._getDelegateProxyAddress(rpc, address), address);
            }
            else {
                addressListWithDelegateAddresses.push(address);
                addressDelegateMap.set(address, address);
            }
        }
        const tokensInWallet = await this._getBalanceOf(rpc, this.tokenAddress, addressListWithDelegateAddresses, blockHeight);
        const chiefDeposits = await this._getChiefDeposits(rpc, this.chiefAddress, addressListWithDelegateAddresses, blockHeight);
        const resultsOfProxyCheck = await this._hasProxy(rpc, addressListWithDelegateAddresses);
        const addressesWithProxy = resultsOfProxyCheck.filter((a) => a.power === 1).map((a) => a.address);
        const addressesWithoutProxy = resultsOfProxyCheck.filter((a) => a.power === 0).map((a) => a.address);
        const info = [];
        if (addressesWithoutProxy.length > 0) {
            for (const address of addressesWithoutProxy) {
                const tokens = tokensInWallet.filter((a) => a.address === address);
                const chiefDeposit = chiefDeposits.filter((a) => a.address === address);
                const power = tokens[0].power + chiefDeposit[0].power;
                info.push({ protocol: this.protocolName, address: addressDelegateMap.get(address), power });
            }
        }
        if (addressesWithProxy.length > 0) {
            const coldProxyContracts = await this._getWalletMap(rpc, addressesWithProxy, 'coldMap');
            const hotProxyContracts = await this._getWalletMap(rpc, addressesWithProxy, 'hotMap');
            for (const address of addressesWithProxy) {
                const coldProxyContract = coldProxyContracts.filter((a) => a.address === address);
                const hotProxyContract = hotProxyContracts.filter((a) => a.address === address);
                let coldWallet;
                let hotWallet;
                if (coldProxyContract.length === 1 && coldProxyContract[0].wallet !== '0x0') {
                    coldWallet = await this._getWalletFromVoteProxy(rpc, coldProxyContract[0].wallet, 'cold');
                    hotWallet = await this._getWalletFromVoteProxy(rpc, coldProxyContract[0].wallet, 'hot');
                }
                if (hotProxyContract.length === 1 && hotProxyContract[0].address !== '0x0' && coldProxyContract.length === 1) {
                    coldWallet = await this._getWalletFromVoteProxy(rpc, hotProxyContract[0].wallet, 'cold');
                    hotWallet = await this._getWalletFromVoteProxy(rpc, hotProxyContract[0].wallet, 'hot');
                }
                if (coldWallet && hotWallet) {
                    // use hot/cold/proxy addresses to query dsChief for tokens now
                    const addressesToQuery = [hotProxyContract[0].wallet, hotWallet[0].wallet];
                    if (coldProxyContract[0].address !== hotProxyContract[0].address) {
                        addressesToQuery.push(coldProxyContract[0].wallet);
                        addressesToQuery.push(coldWallet[0].wallet);
                    }
                    const proxyChiefDeposits = await this._getChiefDeposits(rpc, this.chiefAddress, addressesToQuery, blockHeight);
                    let power = 0;
                    const tokens = tokensInWallet.filter((a) => a.address === address);
                    const chiefDeposit = chiefDeposits.filter((a) => a.address === address);
                    // Sum all the relevant powers
                    power += tokens[0].power;
                    if (coldWallet[0].wallet !== chiefDeposit[0].address) {
                        power += chiefDeposit[0].power;
                    }
                    for (const deposit of proxyChiefDeposits) {
                        power += deposit.power;
                    }
                    info.push({ protocol: this.protocolName, address: addressDelegateMap.get(address), power });
                }
            }
        }
        return info;
    }
    async _hasProxy(rpc, addresses) {
        const iface = new utils_1.Interface(abi_vote_proxy_factory_json_1.default);
        const calls = addresses.map((a) => {
            const callData = iface.encodeFunctionData('hasProxy', [a]);
            return rpc.call({
                to: this.voteProxyFactoryAddress,
                data: callData,
            });
        });
        const callResults = await Promise.all(calls);
        const parsedResults = callResults.map((value, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseInt(value) };
        });
        return parsedResults;
    }
    async _getWalletFromVoteProxy(rpc, address, functionName) {
        const iface = new utils_1.Interface(abi_vote_proxy_json_1.default);
        const callData = iface.encodeFunctionData(functionName);
        const call = rpc.call({
            to: address,
            data: callData,
        });
        const callResults = await Promise.all([call]);
        const parsedResults = callResults.map((value, idx) => {
            if (value === '0x') {
                return { address, wallet: value };
            }
            value = '0x' + value.substring(value.length - 40);
            return { address, wallet: ethers_1.BigNumber.from(value).toHexString() }; //ethers.utils.hexValue(BigNumber.from(value).toHexString())
        });
        return parsedResults;
    }
    async _getWalletMap(rpc, addresses, functionName) {
        const iface = new utils_1.Interface(abi_vote_proxy_factory_json_1.default);
        const calls = addresses.map((a) => {
            const callData = iface.encodeFunctionData(functionName, [a]);
            return rpc.call({
                to: this.voteProxyFactoryAddress,
                data: callData,
            });
        });
        const callResults = await Promise.all(calls);
        const parsedResults = callResults.map((value, idx) => {
            return { address: addresses[idx], wallet: ethers_1.ethers.utils.hexValue(ethers_1.BigNumber.from(value).toHexString()) };
        });
        return parsedResults;
    }
    async _getChiefDeposits(rpc, chiefAddress, addresses, blockHeight) {
        const iface = new utils_1.Interface(abi_dschief_json_1.default);
        addresses = addresses.filter((a) => a != '0x0');
        const calls = addresses.map((a) => {
            const callData = iface.encodeFunctionData('deposits', [a]);
            if (blockHeight === undefined) {
                return rpc.call({
                    to: chiefAddress,
                    data: callData,
                });
            }
            else {
                return rpc.call({
                    to: chiefAddress,
                    data: callData,
                }, blockHeight);
            }
        });
        const powers = await Promise.all(calls);
        const info = powers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
        });
        return info;
    }
    async _getBalanceOf(rpc, tokenAddress, addresses, blockHeight) {
        const iface = new utils_1.Interface(abi_token_json_1.default);
        const calls = addresses.map((a) => {
            const callData = iface.encodeFunctionData('balanceOf', [a]);
            if (blockHeight === undefined) {
                return rpc.call({
                    to: tokenAddress,
                    data: callData,
                });
            }
            else {
                return rpc.call({
                    to: tokenAddress,
                    data: callData,
                }, blockHeight);
            }
        });
        const powers = await Promise.all(calls);
        const info = powers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
        });
        return info;
    }
    async getBalance(addresses, blockHeight) {
        return [];
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
    async getProposalIdFromEvent() {
        throw new Error("Function not defined for this adapter");
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
}
exports.MakerDaoGovernorPollingAdapter = MakerDaoGovernorPollingAdapter;
//# sourceMappingURL=polling-adapter.js.map