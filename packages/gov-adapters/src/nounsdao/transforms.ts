import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, ProposalCreated, VoteCast } from './contract';
import { VoteCast as VoteCastBravo } from './contract';
import { makeExecutablesForProposal } from '../utils';

enum NounsDAOProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
  Vetoed,
}

/**
 * Given some markdown-ish payload, extract the title and content
 */
export const extractTitle = (description: string, defaultTitle: string): { title: string; content: string } => {
  // descriptions seem to start with a markdown header always
  const match = description.match(/^\s*(.*)\n\s*([\S\s]*)$/);

  if (!match) {
    return { title: defaultTitle, content: description };
  }

  const [, header, content] = match;
  const title = header.replace(/^\s*#\s*/, ''); // remove header
  return { title, content };
};

/**
 * Map a nounsdao ProposalCreated event into a governance Proposal model
 */
export const mapProposal = (event: ProposalCreated, choices: string[], quorum: number, txHash: string): Proposal => {
  const { title, content } = extractTitle(event.args.description, `Proposal ${event.args.id.toString()}`);
  const { args } = event;
  const executables = makeExecutablesForProposal({
    targets: args.targets,
    values: args.values,
    signatures: args.signatures,
    calldatas: args.calldatas,
  });

  return {
    id: args.id.toString(),
    blockNumber: args.startBlock.toNumber(),
    choices,
    startTime: { blockNumber: args.startBlock.toNumber() },
    endTime: { blockNumber: args.endBlock.toNumber() },
    proposer: args.proposer,
    title,
    content,
    executables,
    quorum,
    txHash,
  };
};

/**
 * Convert voting event logs into interop Votes
 */
export const mapVotes = (logs: LogResult<VoteCast | VoteCastBravo>[]): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    const { args } = log.parsed;
    return {
      address: args.voter,
      choice: args.support,
      // TODO: this should probably be something that is configurable on the
      // adapter level, but defaults to 18.
      // For nounsdao this is 0 because the vote power is already base 10
      power: parseFloat(formatUnits(args.votes, 0)),
      time: { blockNumber: log.event.blockNumber },
      reason: 'reason' in args ? args.reason : undefined,
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash
    };
  });

  return votes;
};

/**
 * Map NounsDAO proposal states to boardroom event formats
 */
export const mapProposalEvent = (log: LogResult<AnyProposalEvent>): ProposalEvent => {
  let state: ProposalState;
  switch (log.parsed.name) {
    case 'ProposalExecuted':
      state = 'executed';
      break;
    case 'ProposalQueued':
      state = 'queued';
      break;
    case 'ProposalCanceled':
      state = 'canceled';
      break;
    case 'ProposalCreated':
      state = 'pending';
      break;
    // statically exhaustive cases, do not need default case
  }
  return {
    state,
    proposalId: log.parsed.args.id.toString(),
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash
  };
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
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
  } else {
    return {
      delegator: log.event.address,
      fromDelegate: '',
      toDelegate: log.parsed.args.delegate,
      amount: log.parsed.args.newBalance.toString(),
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};
