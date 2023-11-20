import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { AnyProposalEvent, ProposalCreated, VoteCast } from './contract';
import { DelegateChangeEvents, VoteCast as VoteCastBravo } from './contract';

/**
 * Given some markdown-ish payload, extract the title and content
 */
export const extractTitle = (description: string, defaultTitle: string): { title: string; content: string } => {
  // descriptions seem to start with a markdown header always
  const match = description.match(/^\s*#{1,6}\s.*$/m);
  if (match) {
    const header = match[0];
    const content = description.substring(header.length).replace(/\0/g, '');
    const title = header.replace(/^\s*#\s*/, ''); // remove header
    return { title, content };
  }

  // if the description is only one line, we use it as title and leave the content empty
  const isOneLine = !/\r|\n/.exec(description);
  if (isOneLine) {
    return { title: description, content: '' };
  }

  return { title: defaultTitle, content: description };
};

/**
 * Map a interest ProposalCreated event into a governance Proposal model
 */
export const mapProposal = (event: ProposalCreated, choices: string[], quorum: number, txHash: string): Proposal => {
  let title,
    content = '';
  try {
    const { title: t, content: c } = extractTitle(event.args.description, `Proposal ${event.args.id.toString()}`);
    title = t;
    content = c;
  } catch (e) {
    title = `Proposal ${event.args.id.toString()}`;
  }

  const { args } = event;
  return {
    id: args.id.toString(),
    blockNumber: args.startBlock.toNumber(),
    choices,
    startTime: { blockNumber: args.startBlock.toNumber() },
    endTime: { blockNumber: args.endBlock.toNumber() },
    proposer: args.proposer,
    title,
    content,
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
      choice: compoundChoice(args.support),
      // TODO: this should probably be something that is configurable on the
      // adapter level, but defaults to 18
      power: parseFloat(formatUnits(args.votes, 18)),
      time: { blockNumber: log.event.blockNumber },
      reason: 'reason' in args ? args.reason : undefined,
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash,
    };
  });

  return votes;
};

/**
 * Convert a interest proposal event into our interop model
 */
export const mapProposalEvent = (log: LogResult<AnyProposalEvent>): ProposalEvent => {
  let state: ProposalState;

  switch (log.parsed.name) {
    case 'ProposalCanceled':
      state = 'canceled';
      break;
    case 'ProposalExecuted':
      state = 'executed';
      break;
    case 'ProposalQueued':
      state = 'queued';
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
    txHash: log.event.transactionHash,
  };
};

/**
 * Convert a interest delegation event into our interop model
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
      amount: formatUnits(log.parsed.args.newBalance, 18),
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};

/**
 * Alpha -> Bravo upgrade made it so that "support" is a number instead of a
 * bool, this will normalize either into a number
 */
export const compoundChoice = (support: number | boolean): number => {
  if (typeof support === 'number') {
    return support;
  }
  return support ? 1 : 0;
};
