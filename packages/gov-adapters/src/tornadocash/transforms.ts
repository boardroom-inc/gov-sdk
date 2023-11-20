import { DelegationEvent, Proposal, ProposalEvent, ProposalPage, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { DelegateChangeEvents, ProposalCreated, Voted } from './contract';

enum TornadoCashProposalState {
  Pending,
  Active,
  Defeated,
  Timelocked,
  AwaitingExecution,
  Executed,
  Expired,
}

/**
 * Map a compound ProposalCreated event into a governance Proposal model
 */
export const mapProposal = (event: ProposalCreated, choices: string[], blockNumber: number, txHash: string): Proposal => {
  const { args } = event;

  let title = '';
  let description = '';
  try {
    const parsedDescription = JSON.parse(args.description);
    title = parsedDescription.title;
    description = parsedDescription.description;
  } catch (err) {
    title = `Proposal ${args.id}`;
  }

  return {
    id: args.id.toString(),
    blockNumber: blockNumber,
    choices,
    startTime: { timestamp: args.startTime.toNumber() },
    endTime: { timestamp: args.endTime.toNumber() },
    proposer: args.proposer,
    title: title,
    content: description,
    txHash
  };
};

/**
 * Convert voting event logs into interop Votes
 */
export const mapVotes = (logs: LogResult<Voted>[]): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    const { args } = log.parsed;
    return {
      address: args.voter,
      choice: args.support ? 1 : 0,
      power: parseFloat(formatUnits(args.votes, 18)),
      time: { blockNumber: log.event.blockNumber },
      proposalId: args.proposalId.toString(),
      txHash: log.event.transactionHash
    };
  });

  return votes;
};

/**
 * Map Tornado Cash proposal states to boardroom event formats
 */
export const mapProposalEvents = (items: number[], proposals: ProposalPage): ProposalEvent[] => {
  const results = [] as ProposalEvent[];

  let i = 0;
  for (const proposal of proposals.items) {
    let state: ProposalState;

    switch (TornadoCashProposalState[items[i]]) {
      case 'Executed':
        state = 'executed';
        break;
      case 'Pending':
        state = 'pending';
        break;
      case 'Active':
        state = 'active';
        break;
      case 'Defeated':
      case 'Expired':
        state = 'closed';
        break;
      case 'AwaitingExecution':
      case 'Timelocked':
        state = 'queued';
        break;
      default:
        state = 'active';
    }

    results.push({
      state: state,
      proposalId: proposal.id,
      time: proposal.endTime,
      txHash: proposal.txHash ? proposal.txHash : ''
    });

    i++;
  }

  return results;
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
  if (log.parsed.name === 'Delegated') {
    return {
      delegator: log.parsed.args.account,
      fromDelegate: '',
      toDelegate: log.parsed.args.to,
      amount: '',
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  } else {
    return {
      delegator: log.event.address,
      fromDelegate: log.parsed.args.from,
      toDelegate: '',
      amount: '',
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'UNDELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};
