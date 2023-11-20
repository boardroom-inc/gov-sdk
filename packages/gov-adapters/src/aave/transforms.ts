import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import {
  ProposalCreated,
  ProposalContent,
  VoteEmitted,
  NonCreatedProposalEvent,
  DelegateChangeEvents,
  AnyProposalEvent,
} from './contract-v2';
import { makeExecutablesForProposal } from '../utils';

enum DelegationType {
  VOTING_POWER,
  PROPOSITION_POWER,
}

/**
 * Map an aave ProposalCreated event into an interop Proposal model
 */
export const mapProposal = (event: ProposalCreated, content: ProposalContent, quorum: number, txHash: string): Proposal => {
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
    // aave's language
    choices: ['NAY', 'YAE'],
    startTime: { blockNumber: args.startBlock.toNumber() },
    endTime: { blockNumber: args.endBlock.toNumber() },
    content: content.description,
    proposer: args.creator,
    // aave proposal 20 has a malformed IPFS payload with a missing title, and
    // we cant leave this undefined, so if its not present create a placeholder
    // title
    title: content.title ?? `Proposal ${args.id.toString()}`,
    executables,
    quorum,
    txHash,
  };
};

/**
 * Convert an aave vote event into our interop vote model
 */
export const mapVotes = (logs: LogResult<VoteEmitted>[]): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    return {
      address: log.parsed.args.voter,
      choice: log.parsed.args.support ? 1 : 0,
      power: parseFloat(formatUnits(log.parsed.args.votingPower, 18)),
      time: { blockNumber: log.event.blockNumber },
      proposalId: log.parsed.args.id.toString(),
      txHash: log.event.transactionHash,
    };
  });

  return votes;
};

/**
 * Convert an aave proposal event into our interop event model
 */
export const mapProposalEvents = (logs: LogResult<AnyProposalEvent>[]): ProposalEvent[] => {
  const events = logs.map<ProposalEvent>((log) => {
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
  });

  return events;
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
  if (log.parsed.name === 'DelegateChanged') {
    return {
      delegator: log.parsed.args.delegator,
      fromDelegate: '',
      toDelegate: log.parsed.args.delegatee,
      amount: '',
      aaveDelegationType: DelegationType[log.parsed.args.delegationType].toString(),
      snapshotId: '',
      eventType: 'MOVED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  } else {
    return {
      delegator: log.event.address,
      fromDelegate: '',
      toDelegate: log.parsed.args.user,
      amount: formatUnits(log.parsed.args.amount, 18),
      aaveDelegationType: DelegationType[log.parsed.args.delegationType].toString(),
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};
