import { DelegationEvent, Proposal, ProposalEvent, ProposalState, Vote } from '@boardroom/gov-lib';
import { formatUnits } from '@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { LogResult } from '../rpc';
import { AnyProposalEvent, DelegateChangeEvents, ProposalCreated, ProposalCreatedEvents, ProposalCreatedWithVotingModule, VoteCastWithParams, VoteCastEvents } from './contract';
import { makeExecutablesForProposal } from '../utils';

enum OpenZeppelinProposalState {
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
 * Map a Optimism ProposalCreatedWithVotingModule event into a governance Proposal model
 */
export const mapProposalWithVotingModule = (event: ProposalCreatedWithVotingModule, quorum: number, txHash: string, proposalDeadline: BigNumber): Proposal => {
  const shortenedDescription = event.args.description.slice(0, 30);
  const { title, content } = extractTitle(event.args.description, `Proposal ${shortenedDescription}`);
  const { args } = event;

  const PROPOSAL_DATA_ENCODING =
    'PROPOSAL_DATA_ENCODING((address[] targets,uint256[] values,bytes[] calldatas,string description)[] proposalOptions,(uint8 maxApprovals,uint8 criteria,address budgetToken,uint128 criteriaValue,uint128 budgetAmount) proposalSettings)';

  const dataArgs = ethers.utils.FunctionFragment.fromString(PROPOSAL_DATA_ENCODING);
  const result = ethers.utils.defaultAbiCoder.decode(
    dataArgs.inputs,
    args.proposalData
  );

  // const executables = makeExecutablesForProposal({
  //   targets: args.targets,
  //   values: args.values,
  //   signatures: args.signatures,
  //   calldatas: args.calldatas,
  // });

  const options = [];
  for (const option of result.proposalOptions) {
    options.push(option.description);
  }

  return {
    id: args.proposalId.toString(),
    blockNumber: args.startBlock.toNumber(),
    choices: options,
    type: "approvalVoting",
    startTime: { blockNumber: args.startBlock.toNumber() },
    endTime: { blockNumber: proposalDeadline.toNumber() },
    proposer: args.proposer,
    title: title,
    content: content,
    executables: [],
    quorum,
    txHash,
  };
};

/**
 * Map a OpenZeppelin ProposalCreated event into a governance Proposal model
 */
 export const mapProposal = (
   event: ProposalCreated,
   choices: string[],
   quorum: number,
   txHash: string,
   proposalDeadline: BigNumber,
   signatureList: string[]
 ): Proposal => {
   const shortenedDescription = event.args.description.slice(0, 30);
   const { title, content } = extractTitle(event.args.description, `Proposal ${shortenedDescription}`);
   const { args } = event;

   const encodedArgs = [];
   for (const calldata of args.calldatas) {
     encodedArgs.push('0x' + calldata.slice(10));
   }

   const executables = makeExecutablesForProposal({
     targets: args.targets,
     values: args.values,
     signatures: signatureList,
     calldatas: encodedArgs,
   });

   // Reset the calldata to the original unsliced version
   if (executables) {
    for (const executable of executables) {
      executable.calldata = args.calldatas[0];
      executables[0] = executable;
    }
   }

   let convertedValues = [];
   let index = 0;
   for (const target of args.targets) {
     const value = args.values[index] ? args.values[index]?.toString() : '0';
     convertedValues.push(value);
     index++;
   }

   return {
     id: args.proposalId.toString(),
     blockNumber: args.startBlock.toNumber(),
     choices,
     startTime: { blockNumber: args.startBlock.toNumber() },
     endTime: { blockNumber: proposalDeadline.toNumber() },
     proposer: args.proposer,
     title: title,
     content: content,
     executables: executables,
     quorum,
     txHash,
     executionArgs: {
       targets: args.targets,
       values: convertedValues,
       signatures: signatureList,
       calldatas: args.calldatas,
       description: args.description,
     },
   };
 };

 /**
 * Convert voting event logs into interop Votes
 */
export const mapVotes = (logs: LogResult<VoteCastEvents>[], decimals: number): Vote[] => {
  const votes = logs.map<Vote>((log) => {
    return mapVoteEvent(log.parsed, log.event.blockNumber, log.event.transactionHash, decimals);
  });
  return votes;
}

export const mapVoteEvent = (event: VoteCastEvents, blockNumber: number, txHash: string, decimals: number): Vote => {
  let args = event.args;

  let choice = args.support;
  if (event.name === 'VoteCastWithParams') {
    let voteCast = event as VoteCastWithParams;
    const VOTE_PARAMS_ENCODING ='VOTE_PARAMS_ENCODING(uint256[] options)';

    const paramEncoding = ethers.utils.FunctionFragment.fromString(VOTE_PARAMS_ENCODING);

    // Choices haves to be in ascending order
    const decodedParams = ethers.utils.defaultAbiCoder.decode(paramEncoding.inputs, voteCast.args.params);

    choice = decodedParams.options.map((option: BigNumber) => {
      return option.toNumber();
    });
  }
  let reason = undefined;
  try {
    reason = 'reason' in args ? args.reason : undefined;
  } catch (err) {
    console.log(err);
  }
  return {
    address: args.voter,
    choice,
    power: parseFloat(formatUnits(args.weight, decimals)),
    time: { blockNumber: blockNumber },
    reason,
    proposalId: args.proposalId.toString(),
    txHash: txHash,
  };
};

/**
 * Convert an openzeppelin proposal event into our interop model
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
      case 'ProposalCreated':
        state = 'pending';
        break;
      case 'ProposalQueued':
        state = 'queued';
        break;
      // statically exhaustive cases, do not need default case
    }

    return {
      state,
      proposalId: log.parsed.args.proposalId.toString(),
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  });

  return events;
};

/**
 * Convert a compound delegation event into our interop model
 */
export const mapDelegationEvents = (log: LogResult<DelegateChangeEvents>, decimals: number): DelegationEvent => {
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
      amount: formatUnits(log.parsed.args.newBalance, decimals),
      aaveDelegationType: '',
      snapshotId: '',
      eventType: 'DELEGATED',
      time: { blockNumber: log.event.blockNumber },
      txHash: log.event.transactionHash,
    };
  }
};
