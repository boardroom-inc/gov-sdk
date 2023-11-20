import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { LogResult } from '../rpc';
import { ProposalCreated, Voted, DelegateChangeEvents, AnyProposalEvent } from './coreContract';
import {  MappedProposalOffChainData } from './adapter';
import { makeExecutablesForProposal } from '../utils';

/**
 * Map a ProposalCreated event into interop Proposal model
 */
export const mapProposal = (
  event: ProposalCreated,
  choices: string[],
  proposalsOffChainData: MappedProposalOffChainData[],
  quorum: number,
  txHash: string
): Proposal => {
  const { args } = event;
  const proposalId = args.proposalId.toString();
  const offChainData = proposalsOffChainData.find((proposal) => {
    return proposal.proposalId === proposalId;
  });

  const executables = makeExecutablesForProposal({
    targets: offChainData?.targets || [],
    values: [],
    calldatas: offChainData?.calldatas || [],
  });

  const title = offChainData?.title || `Proposal ${proposalId}`;
  const content = offChainData?.description || '';
  return {
    id: proposalId,
    blockNumber: args.created.toNumber(),
    choices,
    startTime: { blockNumber: args.created.toNumber() },
    endTime: { blockNumber: args.expiration.toNumber() },
    proposer: '', // The events don't record the proposer
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

export const mapVotes = (logs: LogResult<Voted>[]): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    const { args } = log.parsed;
    return {
      address: args.voter,
      choice: args.vote.castBallot,
      power: parseFloat(formatUnits(args.vote.votingPower, 18)),
      time: { blockNumber: log.event.blockNumber },
      reason: '', //reasons aren't stored onchain
      proposalId: args.proposalId.toString(),
    };
  });
  return votes;
};

/**
 * Convert a Council proposal event into our interop model
 */
export const mapProposalEvent = (log: LogResult<AnyProposalEvent>): ProposalEvent => {
  let state: ProposalState;

  switch (log.parsed.name) {
    case 'ProposalExecuted':
      state = 'executed';
      break;
    case 'ProposalCreated':
      state = 'pending';
      break;
    // statically exhaustive cases, do not need default case
  }

  return {
    state,
    proposalId: log.parsed.args.proposalId.toString(),
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash,
  };
};

/**
 * Convert a Council delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>): DelegationEvent => {
  const amount = formatUnits(log.parsed.args.amount);
  const interopDelegationEvent: DelegationEvent = {
    aaveDelegationType: '',
    snapshotId: '',
    time: { blockNumber: log.event.blockNumber },
    txHash: log.event.transactionHash,
    delegator: log.parsed.args.from,
    fromDelegate: log.parsed.args.from,
    toDelegate: log.parsed.args.to,
    eventType: 'NONE',
    amount: amount,
  };
  if (parseFloat(amount) >= 0) {
    interopDelegationEvent.eventType = 'DELEGATED';
  } else if (parseFloat(amount) < 0) {
    interopDelegationEvent.eventType = 'MOVED';
  }

  return interopDelegationEvent;
};
