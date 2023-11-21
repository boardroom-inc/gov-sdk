"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakerDaoGovernorExecutiveAdapter = void 0;
const ethers_1 = require("ethers");
const abi_dschief_json_1 = __importDefault(require("./abi-dschief.json"));
const abi_vote_delegate_json_1 = __importDefault(require("./abi-vote-delegate.json"));
const abi_vote_delegate_factory_json_1 = __importDefault(require("./abi-vote-delegate-factory.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const utils_1 = require("ethers/lib/utils");
const graphql_request_1 = require("graphql-request");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for MakerDao Governor
 */
class MakerDaoGovernorExecutiveAdapter {
    constructor(config) {
        var _a;
        this.chiefAddress = config.chiefAddress;
        this.tokenAddress = config.tokenAddress;
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
    async getTokenAddress() {
        return this.tokenAddress;
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.chiefAddress}`,
        };
    }
    async getFramework() {
        return 'makerDaoExecutive';
    }
    async getProposalCreationFunctionsSelectors() {
        return [];
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['vote'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_dschief_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_vote_delegate_json_1.default, ['lock']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getProposalCreationContractAddress() {
        return '';
    }
    async getDelegationContractAddress() {
        return this.tokenAddress;
    }
    async getVotingContractAddress() {
        return this.chiefAddress;
    }
    async getProposals(pagination = {}) {
        const http = this.transports('http');
        let start = 0;
        let nextCursor = 0;
        if (pagination && pagination.cursor) {
            start = parseInt(pagination.cursor);
            nextCursor = Math.max(start - 5, 0);
        }
        const execVotes = await http.getJson('https://vote.makerdao.com/api/executive?limit=5&start=' + start);
        const proposals = [];
        let status = '';
        for (const p of execVotes.data) {
            if (p.spellData.hasBeenCast) {
                status = 'executed';
            }
            const details = await http.getJson('https://vote.makerdao.com/api/executive/' + p.key);
            const proposal = {
                id: details.data.key,
                title: details.data.title,
                proposer: details.data.address,
                choices: ['Support'],
                externalUrl: details.data.proposalLink,
                content: details.data.about,
                blockNumber: 0,
                startTime: { timestamp: Math.floor(new Date(details.data.date).getTime() / 1000) },
                endTime: { timestamp: Math.floor(new Date(details.data.spellData.expiration).getTime() / 1000) },
                status,
            };
            proposals.push(proposal);
        }
        return { items: proposals, nextCursor: nextCursor.toString() };
    }
    async getProposalEvents(pagination = {}) {
        /**
         * Since we are using the apis in getProposals there won't be any events.
         */
        return { items: [] };
    }
    async getVotes(pagination = {}) {
        const http = this.transports('http');
        const execVotesResp = await http.getJson('https://staging-vote.vercel.app/api/executive/supporters?network=mainnet');
        const proposals = await this.getProposals();
        const execVotes = new Map(Object.entries(execVotesResp.data));
        const items = [];
        for (const prop of proposals.items) {
            const votesToAdd = execVotes.get(prop.proposer.toLowerCase());
            if (votesToAdd) {
                for (const v of votesToAdd) {
                    items.push({
                        time: { timestamp: 0 },
                        proposalId: prop.id,
                        address: v.address,
                        choice: 0,
                        power: Number(v.deposits),
                    });
                }
            }
        }
        return { items };
    }
    async getEncodedCastVoteData({ proposalId, reason, address }) {
        if (reason) {
            throw new Error('reason parameter is not supported');
        }
        const rpc = this.transports('rpc').network(await this.getChainId());
        const encoder = new ethers_1.ethers.utils.AbiCoder();
        const encodedParam = encoder.encode(['address'], [proposalId]);
        const slate = ethers_1.ethers.utils.keccak256('0x' + encodedParam.slice(-64));
        let encodedData, voteDelegateProxyAddress = '';
        const hasDelegateProxy = await this._hasDelegateProxy(rpc, address);
        if (hasDelegateProxy) {
            voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
            const contract = new ethers_1.Contract(voteDelegateProxyAddress, abi_vote_delegate_json_1.default, rpc);
            const functionSignature = contract.interface.getSighash('vote');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [slate]);
        }
        else {
            const contract = new ethers_1.Contract(this.chiefAddress, abi_dschief_json_1.default, rpc);
            const functionSignature = contract.interface.getSighash('vote');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [slate]);
        }
        return {
            encodedData,
            toContractAddress: hasDelegateProxy ? voteDelegateProxyAddress : this.chiefAddress,
        };
    }
    async castVote(params) {
        const { proposalId } = params;
        let { identifier } = params;
        const rpc = this.transports('rpc').network(await this.getChainId());
        const signer = this.transports('signer').signer;
        // Encoding info:
        // https://github.com/makerdao/governance-portal-v2/blob/develop/modules/executive/components/VoteModal/DefaultView.tsx#L123-L126
        const encoder = new ethers_1.ethers.utils.AbiCoder();
        const encodedParam = encoder.encode(['address'], [proposalId]);
        const slate = ethers_1.ethers.utils.keccak256('0x' + encodedParam.slice(-64));
        const address = await signer.getAddress();
        let res;
        if (await this._hasDelegateProxy(rpc, address)) {
            const voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
            const contract = new ethers_1.Contract(voteDelegateProxyAddress, abi_vote_delegate_json_1.default, signer);
            res = await contract.vote(slate);
        }
        else {
            const contract = new ethers_1.Contract(this.chiefAddress, abi_dschief_json_1.default, signer);
            res = await contract.vote(slate);
        }
        try {
            identifier = identifier !== null && identifier !== void 0 ? identifier : 'default';
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'castVoteMakerDaoExecutive',
                hashId: res.hash,
                proposalId: proposalId,
                userAddress: await signer.getAddress(),
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
    async delegateVotingPower(delegatee, identifier) {
        const signer = this.transports('signer').signer;
        const tokenContract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, signer);
        //all the signer's tokens will be delegated
        const balance = await tokenContract.balanceOf(await signer.getAddress());
        const formattedAmount = ethers_1.BigNumber.from(balance).toString();
        // approve delegation
        await tokenContract.approve(delegatee);
        const contract = new ethers_1.Contract(delegatee, abi_vote_delegate_json_1.default, signer);
        const res = await contract.lock(formattedAmount, { gasLimit: 195000 });
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateMakerDao',
                hashId: res.hash,
                proposalId: '',
                userAddress: await signer.getAddress(),
                identifier,
                separateAction: 'delegate',
                separateFramework: await this.getFramework(),
            });
        }
        catch (err) {
            console.log(err);
        }
        return res.hash;
    }
    async getDelegationEvents(pagination = {}) {
        const allDelegatesQuery = (0, graphql_request_1.gql) `
      {
        allDelegates {
          nodes {
            delegate
            voteDelegate
            blockTimestamp
          }
        }
      }
    `;
        const allDelegatesData = {
            query: allDelegatesQuery.toString(),
            operationName: 'allDelegates',
        };
        const http = this.transports('http');
        const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', allDelegatesData);
        const allDelegatesResp = resp.data.data;
        const allDelegates = [];
        for (const node of allDelegatesResp.allDelegates.nodes) {
            allDelegates.push(node.voteDelegate);
        }
        const mkrLockedDelegateArrayTotalsQuery = (0, graphql_request_1.gql) `
      query mkrLockedDelegateArrayTotalsV2($argAddress: [String]!, $argUnixTimeStart: Int!, $argUnixTimeEnd: Int!) {
        mkrLockedDelegateArrayTotals(
          argAddress: $argAddress
          unixtimeStart: $argUnixTimeStart
          unixtimeEnd: $argUnixTimeEnd
        ) {
          nodes {
            fromAddress
            immediateCaller
            lockAmount
            blockNumber
            blockTimestamp
            lockTotal
            callerLockTotal
            hash
          }
        }
      }
    `;
        const delegateEventsData = [];
        const now = Math.floor(Date.now() / 1000);
        const numAddressesToQuery = 100;
        for (let i = 0; i < Math.ceil(allDelegates.length / numAddressesToQuery); i++) {
            const partialAddresses = allDelegates.slice(numAddressesToQuery * i, numAddressesToQuery * (i + 1));
            const mkrLockedDelegateArrayTotalsData = {
                query: mkrLockedDelegateArrayTotalsQuery.toString(),
                variables: {
                    argAddress: partialAddresses,
                    argUnixTimeStart: 0,
                    argUnixTimeEnd: now,
                },
                operationName: 'mkrLockedDelegateArrayTotalsV2',
            };
            const delegateEventsResp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', mkrLockedDelegateArrayTotalsData);
            delegateEventsData.push(...delegateEventsResp.data.data.mkrLockedDelegateArrayTotalsV2.nodes);
        }
        const items = [];
        for (const event of delegateEventsData) {
            items.push({
                delegator: event.fromAddress,
                fromDelegate: '',
                toDelegate: event.immediateCaller,
                amount: event.lockAmount,
                aaveDelegationType: '',
                snapshotId: '',
                eventType: event.lockAmount > 0 ? 'DELEGATED' : 'UNDELEGATED',
                time: { blockNumber: event.blockNumber },
                txHash: event.hash,
            });
        }
        return { items };
    }
    async getDelegation(address) {
        // Since one address can delegate to multiple addresses this method signature doesn't work.
        throw new Error('getDelegation is not supported for the makerDao framework. Use getDelegations method instead.');
    }
    async getDelegations(addresses) {
        const results = [];
        for (const address of addresses) {
            const query = (0, graphql_request_1.gql) `
        query mkrDelegatedToV2($argAddress: String!) {
          mkrDelegatedTo(argAddress: $argAddress) {
            nodes {
              fromAddress
              immediateCaller
              lockAmount
              blockNumber
              blockTimestamp
              hash
            }
          }
        }
      `;
            const data = {
                query: query.toString(),
                variables: {
                    argAddress: address,
                },
                operationName: 'mkrDelegatedToV2',
            };
            const http = this.transports('http');
            const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', data);
            const mkrDelegatedTo = resp.data.data;
            for (const res of mkrDelegatedTo.mkrDelegatedToV2.nodes) {
                results.push({
                    address,
                    addressDelegatedTo: res.immediateCaller,
                });
            }
        }
        return results;
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        // If an address has a delegate address we want to get the vote power of the delegate address instead
        const addressListWithDelegateAddresses = [];
        for (const address of addresses) {
            if (await this._hasDelegateProxy(rpc, address)) {
                addressListWithDelegateAddresses.push(await this._getDelegateProxyAddress(rpc, address));
            }
            else {
                addressListWithDelegateAddresses.push(address);
            }
        }
        const chiefDeposits = await this._getChiefDeposits(rpc, this.chiefAddress, addressListWithDelegateAddresses, addresses, blockHeight);
        return chiefDeposits;
    }
    async _getChiefDeposits(rpc, chiefAddress, addressListWithDelegateAddresses, addresses, blockHeight) {
        const iface = new utils_1.Interface(abi_dschief_json_1.default);
        const calls = addressListWithDelegateAddresses.map((a) => {
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
exports.MakerDaoGovernorExecutiveAdapter = MakerDaoGovernorExecutiveAdapter;
//# sourceMappingURL=executive-adapter.js.map