import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { ProposalCreated, VoteCast } from './contract-alpha';
import { AnyProposalEvent, DelegateChangeEvents, VoteCast as VoteCastBravo } from './contract-bravo';
import { makeExecutablesForProposal } from '../utils';

/**
 * Given some markdown-ish payload, extract the title and content
 */
export const extractTitle = (description: string, defaultTitle: string): { title: string; content: string } => {
  // descriptions seem to start with a markdown header always
  let match = description.match(/^\s*(.*)\n\s*([\S\s]*)$/);

  if (!match) {
    // uniswap proposal to upgrade to bravo has bad content formatting
    match = description.match(/^# (.*?) ## ([\S\s]*)/);
  }

  // if the description is only one line, we use it as title and leave the content empty
  const isOneLine = !/\r|\n/.exec(description)
  if (!match && isOneLine){
    return {title: description, content: '' };
  }
  
  if (!match) {
    return { title: defaultTitle, content: description };
  }

  const [, header, content] = match;
  const title = header.replace(/^\s*#\s*/, ''); // remove header
  return { title, content };
};

/**
 * Map a compound ProposalCreated event into a governance Proposal model
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
export const mapVotes = (logs: LogResult<VoteCast | VoteCastBravo>[], isTokenERC721?: boolean): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    const { args } = log.parsed;
    const power = isTokenERC721 ? parseInt(formatUnits(args.votes, 0)) : parseFloat(formatUnits(args.votes, 18));
    return {
      address: args.voter,
      choice: compoundChoice(args.support),
      power: power,
      time: { blockNumber: log.event.blockNumber },
      reason: 'reason' in args ? args.reason : undefined,
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash,
    };
  });

  return votes;
};

/**
 * Convert a compound proposal event into our interop model
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
    txHash: log.event.transactionHash
  };
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>, isTokenERC721?: boolean): DelegationEvent => {
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
    const amount = isTokenERC721
      ? parseInt(formatUnits(log.parsed.args.newBalance, 0))
      : parseFloat(formatUnits(log.parsed.args.newBalance, 18));
    return {
      delegator: log.event.address,
      fromDelegate: '',
      toDelegate: log.parsed.args.delegate,
      amount: amount.toString(),
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
