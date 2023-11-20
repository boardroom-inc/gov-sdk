import { Validators } from '../validation';
import { IconAdapter } from './icon';
import { ProposalsAdapter } from './proposals';
import { TokenAdapter } from './token-info';
import { TreasuryAdapter } from './treasury';
import { VoteAdapter } from './vote';
import { DelegationAdapter } from './delegation';
import { VotePowerAdapter } from './vote-power';
import { CreateProposalAdapter } from './create-proposal';
import { CreateOnChainProposalAdapter } from './create-on-chain-proposal';
import { PodAdapter } from './pod';
import { GeneralAdapter } from './general';
import { ProposalExecutionAdapter } from './proposal-execution';
import { StakingTokenAdapter } from './staking-token';
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
export declare const validators: Validators<Adapters>;
