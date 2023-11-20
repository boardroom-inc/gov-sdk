import { Validators } from '../validation';
import { IconAdapter, iconAdapterValidators } from './icon';
import { ProposalsAdapter, proposalsAdapterValidators } from './proposals';
import { TokenAdapter, tokenAdapterValidators } from './token-info';
import { TreasuryAdapter, treasuryAdapterValidators } from './treasury';
import { VoteAdapter, voteAdapterValidators } from './vote';
import { DelegationAdapter, delegationAdapterValidators } from './delegation';
import { VotePowerAdapter, votePowerAdapterValidators } from './vote-power';
import { CreateProposalAdapter, createProposalAdapterValidators } from './create-proposal';
import { CreateOnChainProposalAdapter, createOnChainProposalAdapterValidators } from './create-on-chain-proposal';
import { PodAdapter, podAdapterValidators } from './pod';
import { GeneralAdapter, generalAdapterValidators } from './general';
import { ProposalExecutionAdapter, proposalExecutionAdapterValidators } from './proposal-execution';
import { StakingTokenAdapter, stakingAdapterValidators } from './staking-token';
/*

  This module "rolls up" all adapter types the gov SDK supports.

  As new adapters are added, an entry needs to be added to `Adapters` that
  points the TypeScript interface of the adapter, and an entry needs to be
  added to `validators` that points to the corresponding response validator
  map

*/

/**
 * All adapter types
 */
export interface Adapters {
  treasury: TreasuryAdapter;
  proposals: ProposalsAdapter;
  token: TokenAdapter;
  icons: IconAdapter;
  vote: VoteAdapter;
  delegation: DelegationAdapter;
  createProposal: CreateProposalAdapter;
  createOnChainProposal: CreateOnChainProposalAdapter;
  proposalExecution: ProposalExecutionAdapter;
  votePower: VotePowerAdapter;
  pod: PodAdapter;
  general: GeneralAdapter;
  staking: StakingTokenAdapter;
}

/**
 * All validators
 */
export const validators: Validators<Adapters> = {
  treasury: treasuryAdapterValidators,
  proposals: proposalsAdapterValidators,
  token: tokenAdapterValidators,
  icons: iconAdapterValidators,
  vote: voteAdapterValidators,
  delegation: delegationAdapterValidators,
  createProposal: createProposalAdapterValidators,
  createOnChainProposal: createOnChainProposalAdapterValidators,
  proposalExecution: proposalExecutionAdapterValidators,
  votePower: votePowerAdapterValidators,
  pod: podAdapterValidators,
  general: generalAdapterValidators,
  staking: stakingAdapterValidators,
};
