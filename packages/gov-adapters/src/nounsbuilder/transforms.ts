import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { DelegateChangeEvents, ProposalCreated, VoteCast, AnyProposalEvent } from './contract';
import { VoteCast as VoteCastBravo } from './contract';
import { makeExecutablesForProposal } from '../utils';

export const extractTitle = (description: string, defaultTitle: string): { title: string; content: string } => {
  const match = description.match(/^.*&&[\S\s]*$/);
  if (!match) {
    return { title: defaultTitle, content: description };
  }
  const [title, ...rest] = description.split('&&');
  // in case there's more than 1 instance of '&&', we only treat the first one as
  // separator between title and content
  const content = rest.join('&&');
  return { title, content };
};

/**
 * Map a nounsBuilder ProposalCreated event into interop Proposal model
 */
export const mapProposal = (event: ProposalCreated, choices: string[], blockNumber: number, quorum: number, txHash: string): Proposal => {
  const { title, content } = extractTitle(event.args.description, `Proposal ${event.args.proposalId.toString()}`);
  const { args } = event;

  const executables = makeExecutablesForProposal({
    targets: args.targets,
    values: args.values,
    signatures: args.signatures,
    calldatas: args.calldatas,
  });

  return {
    id: args.proposalId.toString(),
    blockNumber: blockNumber,
    choices,
    startTime: { timestamp: args.proposal[5] }, //voteStart field
    endTime: { timestamp: args.proposal[6] }, //voteEnd field
    proposer: args.proposal[0],
    title,
    content,
    executables,
    quorum,
    txHash
  };
};

/**
 * Convert NounsBuilder voting event logs into interop Votes
 */

export const mapVotes = (logs: LogResult<VoteCast | VoteCastBravo>[]): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    const { args } = log.parsed;
    return {
      address: args.voter,
      choice: parseFloat(formatUnits(args.support, 0)),
      power: parseFloat(formatUnits(args.weight, 0)),
      time: { blockNumber: log.event.blockNumber },
      reason: 'reason' in args ? args.reason : undefined,
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash
    };
  });

  return votes;
};

/**
 * Convert a NounsBuilder proposal event into our interop model
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
    case 'ProposalVetoed':
      state = 'canceled';
      break;
    case 'ProposalCreated':
      state = 'pending';
      break;
    // statically exhaustive cases, do not need default case
  }
  return {
    state,
    proposalId: log.parsed.args.proposalId,
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash
  };
};

/**
 * Convert a NounsBuilder delegation event into our interop model
 */

export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
  if (log.parsed.name === 'DelegateChanged') {
    return {
      delegator: log.parsed.args.delegator,
      fromDelegate: log.parsed.args.from,
      toDelegate: log.parsed.args.to,
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
      amount: log.parsed.args.newTotalVotes.toString(),
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};
