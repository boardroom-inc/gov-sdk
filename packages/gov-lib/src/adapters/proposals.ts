import { Type, Static } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';

import { PaginationOptions } from '../pagination';
import { ResponseValidator } from '../validation';
import { ChainId, ExternalLink, Framework, Time, FunctionsSelectors, Address } from './common';

/**
 * A state that a proposal can be in
 */
export type ProposalState = Static<typeof ProposalState>;
export const ProposalState = Type.Union([
  Type.Literal('pending'),
  Type.Literal('active'),
  Type.Literal('closed'),
  Type.Literal('canceled'),
  Type.Literal('queued'),
  Type.Literal('executed'),
]);

/**
 * A proposal can have zero or more "events" occur at a specific time
 */
export type ProposalEvent = Static<typeof ProposalEvent>;
export const ProposalEvent = Type.Object({
  proposalId: Type.String(),
  state: ProposalState,
  time: Time,
  txHash: Type.String(),
});

/**
 * A paginated list of proposal events
 */
export type ProposalEventPage = Static<typeof ProposalEventPage>;
export const ProposalEventPage = Type.Object({
  items: Type.Array(ProposalEvent),
  nextCursor: Type.Optional(Type.String()),
});

/**
 * A single proposal entity
 */
export type Proposal = Static<typeof Proposal>;
export const Proposal = Type.Object({
  id: Type.String(),
  title: Type.String(),
  proposer: Type.String(),
  externalUrl: Type.Optional(Type.String()),
  content: Type.String(),
  choices: Type.Array(Type.String()),
  blockNumber: Type.Number(),
  startTime: Time,
  endTime: Time,
  type: Type.Optional(Type.String()),
  scores: Type.Optional(
    Type.Array(
      Type.Object({
        choice: Type.String(),
        total: Type.String(),
      })
    )
  ),
  status: Type.Optional(Type.String()),
  summary: Type.Optional(Type.String()),
  privacy: Type.Optional(Type.String()),
  executables: Type.Optional(
    Type.Array(
      Type.Object({
        target: Type.String(),
        signature: Type.Optional(Type.String()),
        calldata: Type.String(),
        value: Type.Optional(Type.Number()),
        params: Type.Optional(Type.Record(Type.String(), Type.String())),
      })
    )
  ),
  quorum: Type.Optional(Type.Integer()),
  txHash: Type.Optional(Type.String()),
  executionArgs: Type.Optional(
    Type.Object({
      targets: Type.Array(Type.String()),
      values: Type.Array(Type.Optional(Type.String())),
      signatures: Type.Optional(Type.Array(Type.String())),
      calldatas: Type.Array(Type.String()),
      description: Type.String(),
    })
  ),
  votingModule: Type.Optional(Type.String()),
  flagged: Type.Optional(Type.Boolean()),
});

/**
 * A paginated list of proposals
 */
export type ProposalPage = Static<typeof ProposalPage>;
export const ProposalPage = Type.Object({
  items: Type.Array(Proposal),
  nextCursor: Type.Optional(Type.String()),
});


/**
 * A single vote cast on a proposal
 */
export type Vote = Static<typeof Vote>;
export const Vote = Type.Object({
  time: Time,
  proposalId: Type.String(),
  address: Type.String(),
  choice: Type.Optional(Type.Union([
    Type.Integer(), 
    Type.Array(Type.Number()), 
    Type.Record(
      Type.Number(),
      Type.Number()
    ),
  ])),
  power: Type.Number(),
  reason: Type.Optional(Type.String()),
  privacy: Type.Optional(Type.String()),
  txHash: Type.Optional(Type.String()),
});

/**
 * A page of votes cast for a proposal
 */
export type VotePage = Static<typeof VotePage>;
export const VotePage = Type.Object({
  items: Type.Array(Vote),
  nextCursor: Type.Optional(Type.String()),
});

/**
 * Adapter for a protocol that has queryable proposals
 */
export interface ProposalsAdapter {
  getFramework: () => Promise<Framework>;
  getProposals: (pagination?: PaginationOptions) => Promise<ProposalPage>;
  getProposalEvents: (pagination?: PaginationOptions) => Promise<ProposalEventPage>;
  getVotes: (pagination?: PaginationOptions) => Promise<VotePage>;
  getExternalLink: () => Promise<ExternalLink>;
  getChainId: () => Promise<ChainId>;
  getProposalCreationFunctionsSelectors: () => Promise<FunctionsSelectors>;
  getProposalCreationContractAddress: () => Promise<Address>;
  getSnapshotSpaceName: () => Promise<string>;
  getProposalFromEvent: (blockNumber: number, transactionHash: string, event: string) => Promise<Proposal>;
  getProposalIdFromEvent: (event: string) => Promise<string>;
  getVoteFromEvent: (blockNumber: number, transactionHash: string, event: string) => Promise<Vote>;
}

export const proposalsAdapterValidators: ResponseValidator<ProposalsAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  getProposals: compileAdapterValidator(ProposalPage),
  getProposalEvents: compileAdapterValidator(ProposalEventPage),
  getVotes: compileAdapterValidator(VotePage),
  getExternalLink: compileAdapterValidator(ExternalLink),
  getChainId: compileAdapterValidator(ChainId),
  getProposalCreationFunctionsSelectors: compileAdapterValidator(FunctionsSelectors),
  getProposalCreationContractAddress: compileAdapterValidator(Address),
  getSnapshotSpaceName: compileAdapterValidator(Type.String()),
  getProposalFromEvent: compileAdapterValidator(Proposal),
  getProposalIdFromEvent: compileAdapterValidator(Type.String()),
  getVoteFromEvent: compileAdapterValidator(Vote),
};
