"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvents = exports.mapVoteEvent = exports.mapVotes = exports.mapProposal = exports.mapProposalWithVotingModule = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
var OpenZeppelinProposalState;
(function (OpenZeppelinProposalState) {
    OpenZeppelinProposalState[OpenZeppelinProposalState["Pending"] = 0] = "Pending";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Active"] = 1] = "Active";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Canceled"] = 2] = "Canceled";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Defeated"] = 3] = "Defeated";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Succeeded"] = 4] = "Succeeded";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Queued"] = 5] = "Queued";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Expired"] = 6] = "Expired";
    OpenZeppelinProposalState[OpenZeppelinProposalState["Executed"] = 7] = "Executed";
})(OpenZeppelinProposalState || (OpenZeppelinProposalState = {}));
/**
 * Given some markdown-ish payload, extract the title and content
 */
const extractTitle = (description, defaultTitle) => {
    // descriptions seem to start with a markdown header always
    const match = description.match(/^\s*(.*)\n\s*([\S\s]*)$/);
    if (!match) {
        return { title: defaultTitle, content: description };
    }
    const [, header, content] = match;
    const title = header.replace(/^\s*#\s*/, ''); // remove header
    return { title, content };
};
exports.extractTitle = extractTitle;
/**
 * Map a Optimism ProposalCreatedWithVotingModule event into a governance Proposal model
 */
const mapProposalWithVotingModule = (event, quorum, txHash, proposalDeadline) => {
    const shortenedDescription = event.args.description.slice(0, 30);
    const { title, content } = (0, exports.extractTitle)(event.args.description, `Proposal ${shortenedDescription}`);
    const { args } = event;
    const PROPOSAL_DATA_ENCODING = 'PROPOSAL_DATA_ENCODING((address[] targets,uint256[] values,bytes[] calldatas,string description)[] proposalOptions,(uint8 maxApprovals,uint8 criteria,address budgetToken,uint128 criteriaValue,uint128 budgetAmount) proposalSettings)';
    const dataArgs = ethers_1.ethers.utils.FunctionFragment.fromString(PROPOSAL_DATA_ENCODING);
    const result = ethers_1.ethers.utils.defaultAbiCoder.decode(dataArgs.inputs, args.proposalData);
    // const executables = makeExecutablesForProposal({
    //   targets: args.targets,
    //   values: args.values,
    //   signatures: args.signatures,
    //   calldatas: args.calldatas,
    // });
    const options = [];
    for (const option of result.proposalOptions) {
        options.push(option.description);
    }
    return {
        id: args.proposalId.toString(),
        blockNumber: args.startBlock.toNumber(),
        choices: options,
        type: "approvalVoting",
        startTime: { blockNumber: args.startBlock.toNumber() },
        endTime: { blockNumber: proposalDeadline.toNumber() },
        proposer: args.proposer,
        title: title,
        content: content,
        executables: [],
        quorum,
        txHash,
    };
};
exports.mapProposalWithVotingModule = mapProposalWithVotingModule;
/**
 * Map a OpenZeppelin ProposalCreated event into a governance Proposal model
 */
const mapProposal = (event, choices, quorum, txHash, proposalDeadline, signatureList) => {
    var _a;
    const shortenedDescription = event.args.description.slice(0, 30);
    const { title, content } = (0, exports.extractTitle)(event.args.description, `Proposal ${shortenedDescription}`);
    const { args } = event;
    const encodedArgs = [];
    for (const calldata of args.calldatas) {
        encodedArgs.push('0x' + calldata.slice(10));
    }
    const executables = (0, utils_1.makeExecutablesForProposal)({
        targets: args.targets,
        values: args.values,
        signatures: signatureList,
        calldatas: encodedArgs,
    });
    // Reset the calldata to the original unsliced version
    if (executables) {
        for (const executable of executables) {
            executable.calldata = args.calldatas[0];
            executables[0] = executable;
        }
    }
    let convertedValues = [];
    let index = 0;
    for (const target of args.targets) {
        const value = args.values[index] ? (_a = args.values[index]) === null || _a === void 0 ? void 0 : _a.toString() : '0';
        convertedValues.push(value);
        index++;
    }
    return {
        id: args.proposalId.toString(),
        blockNumber: args.startBlock.toNumber(),
        choices,
        startTime: { blockNumber: args.startBlock.toNumber() },
        endTime: { blockNumber: proposalDeadline.toNumber() },
        proposer: args.proposer,
        title: title,
        content: content,
        executables: executables,
        quorum,
        txHash,
        executionArgs: {
            targets: args.targets,
            values: convertedValues,
            signatures: signatureList,
            calldatas: args.calldatas,
            description: args.description,
        },
    };
};
exports.mapProposal = mapProposal;
/**
* Convert voting event logs into interop Votes
*/
const mapVotes = (logs, decimals) => {
    const votes = logs.map((log) => {
        return (0, exports.mapVoteEvent)(log.parsed, log.event.blockNumber, log.event.transactionHash, decimals);
    });
    return votes;
};
exports.mapVotes = mapVotes;
const mapVoteEvent = (event, blockNumber, txHash, decimals) => {
    let args = event.args;
    let choice = args.support;
    if (event.name === 'VoteCastWithParams') {
        let voteCast = event;
        const VOTE_PARAMS_ENCODING = 'VOTE_PARAMS_ENCODING(uint256[] options)';
        const paramEncoding = ethers_1.ethers.utils.FunctionFragment.fromString(VOTE_PARAMS_ENCODING);
        // Choices haves to be in ascending order
        const decodedParams = ethers_1.ethers.utils.defaultAbiCoder.decode(paramEncoding.inputs, voteCast.args.params);
        choice = decodedParams.options.map((option) => {
            return option.toNumber();
        });
    }
    let reason = undefined;
    try {
        reason = 'reason' in args ? args.reason : undefined;
    }
    catch (err) {
        console.log(err);
    }
    return {
        address: args.voter,
        choice,
        power: parseFloat((0, units_1.formatUnits)(args.weight, decimals)),
        time: { blockNumber: blockNumber },
        reason,
        proposalId: args.proposalId.toString(),
        txHash: txHash,
    };
};
exports.mapVoteEvent = mapVoteEvent;
/**
 * Convert an openzeppelin proposal event into our interop model
 */
const mapProposalEvents = (logs) => {
    const events = logs.map((log) => {
        let state;
        switch (log.parsed.name) {
            case 'ProposalCanceled':
                state = 'canceled';
                break;
            case 'ProposalExecuted':
                state = 'executed';
                break;
            case 'ProposalCreated':
                state = 'pending';
                break;
            case 'ProposalQueued':
                state = 'queued';
                break;
            // statically exhaustive cases, do not need default case
        }
        return {
            state,
            proposalId: log.parsed.args.proposalId.toString(),
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    });
    return events;
};
exports.mapProposalEvents = mapProposalEvents;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log, decimals) => {
    if (log.parsed.name === 'DelegateChanged') {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: log.parsed.args.fromDelegate,
            toDelegate: log.parsed.args.toDelegate,
            amount: '',
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'MOVED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
    else {
        return {
            delegator: log.event.address,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegate,
            amount: (0, units_1.formatUnits)(log.parsed.args.newBalance, decimals),
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map