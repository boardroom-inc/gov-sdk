import { DelegationEvent, Proposal, ProposalEvent, Vote } from '@boardroom/gov-lib';
import { BigNumber } from 'ethers';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, ProposalCreated, ProposalCreatedWithVotingModule, VoteCastEvents } from './contract';
/**
 * Given some markdown-ish payload, extract the title and content
 */
export declare const extractTitle: (description: string, defaultTitle: string) => {
    title: string;
    content: string;
};
/**
 * Map a Optimism ProposalCreatedWithVotingModule event into a governance Proposal model
 */
export declare const mapProposalWithVotingModule: (event: ProposalCreatedWithVotingModule, quorum: number, txHash: string, proposalDeadline: BigNumber) => Proposal;
/**
 * Map a OpenZeppelin ProposalCreated event into a governance Proposal model
 */
export declare const mapProposal: (event: ProposalCreated, choices: string[], quorum: number, txHash: string, proposalDeadline: BigNumber, signatureList: string[]) => Proposal;
/**
* Convert voting event logs into interop Votes
*/
export declare const mapVotes: (logs: LogResult<VoteCastEvents>[], decimals: number) => Vote[];
export declare const mapVoteEvent: (event: VoteCastEvents, blockNumber: number, txHash: string, decimals: number) => Vote;
/**
 * Convert an openzeppelin proposal event into our interop model
 */
export declare const mapProposalEvents: (logs: LogResult<AnyProposalEvent>[]) => ProposalEvent[];
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>, decimals: number) => DelegationEvent;
