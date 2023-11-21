"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
const icon_1 = require("./icon");
const proposals_1 = require("./proposals");
const token_info_1 = require("./token-info");
const treasury_1 = require("./treasury");
const vote_1 = require("./vote");
const delegation_1 = require("./delegation");
const vote_power_1 = require("./vote-power");
const create_proposal_1 = require("./create-proposal");
const create_on_chain_proposal_1 = require("./create-on-chain-proposal");
const pod_1 = require("./pod");
const general_1 = require("./general");
const proposal_execution_1 = require("./proposal-execution");
const staking_token_1 = require("./staking-token");
/**
 * All validators
 */
exports.validators = {
    treasury: treasury_1.treasuryAdapterValidators,
    proposals: proposals_1.proposalsAdapterValidators,
    token: token_info_1.tokenAdapterValidators,
    icons: icon_1.iconAdapterValidators,
    vote: vote_1.voteAdapterValidators,
    delegation: delegation_1.delegationAdapterValidators,
    createProposal: create_proposal_1.createProposalAdapterValidators,
    createOnChainProposal: create_on_chain_proposal_1.createOnChainProposalAdapterValidators,
    proposalExecution: proposal_execution_1.proposalExecutionAdapterValidators,
    votePower: vote_power_1.votePowerAdapterValidators,
    pod: pod_1.podAdapterValidators,
    general: general_1.generalAdapterValidators,
    staking: staking_token_1.stakingAdapterValidators,
};
//# sourceMappingURL=index.js.map