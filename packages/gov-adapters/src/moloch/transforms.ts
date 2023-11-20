import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, SubmitProposal, SubmitVote } from './contract';

enum MolochProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

/**
 * Given some markdown-ish payload, extract the title and content
 */
export const extractTitle = (description: string, defaultTitle: string): { title: string; content: string } => {
  try {
    const parsed = JSON.parse(description);
    return { title: parsed.title ?? defaultTitle, content: parsed.description ?? description };
  } catch (err) {
    return { title: defaultTitle, content: description };
  }
};

/**
 * Map a Moloch SubmitProposal event into a governance Proposal model
 */
export const mapProposal = (
  event: SubmitProposal,
  choices: string[],
  blockNumber: number,
  summoningTime: number,
  periodDuration: number,
  votingPeriodLength: number,
  startingPeriod: string,
  txHash: string
): Proposal => {
  const shortenedDescription = event.args.details.slice(0, 30);
  const { title, content } = extractTitle(event.args.details, `Proposal ${shortenedDescription}`);
  const { args } = event;

  const startTimestamp = summoningTime + parseInt(startingPeriod) * periodDuration;
  const endTimestamp = summoningTime + parseInt(startingPeriod) * periodDuration + votingPeriodLength * periodDuration;

  return {
    id: args.proposalId.toString(),
    blockNumber: blockNumber,
    choices,
    startTime: { timestamp: startTimestamp },
    endTime: { timestamp: endTimestamp },
    proposer: args.applicant,
    title: title,
    content: content,
    txHash,
  };
};

/**
 * Convert voting event logs into interop Votes
 */
export const mapVotes = (logs: LogResult<SubmitVote>[], powerMap: number[]): Vote[] => {
  const votes = logs.map<Vote>((log, i) => {
    const { args } = log.parsed;

    return {
      address: args.memberAddress,
      choice: args.uintVote,
      power: parseFloat(formatUnits(powerMap[i], 0)),
      time: { blockNumber: log.event.blockNumber },
      reason: undefined,
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash
    };
  });

  return votes;
};

/**
 * Convert a moloch proposal event into our interop model
 */
export const mapProposalEvents = (log: LogResult<AnyProposalEvent>): ProposalEvent => {
  let state: ProposalState;

  switch (log.parsed.name) {
    case 'CancelProposal':
      state = 'canceled';
      break;
    case 'ProcessProposal':
      state = 'executed';
      break;
    case 'SponsorProposal':
      state = 'pending';
      break;
    case 'SubmitProposal':
      state = 'pending';
      break;
    // statically exhaustive cases, do not need default case
  }

  return {
    state,
    proposalId: log.parsed.args.proposalId.toString(),
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash
  };
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
  return {
    delegator: log.parsed.args.memberAddress,
    fromDelegate: '',
    toDelegate: log.parsed.args.newDelegateKey,
    amount: '',
    aaveDelegationType: '',
    snapshotId: '',
    eventType: 'DELEGATED',
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash,
  };
};
