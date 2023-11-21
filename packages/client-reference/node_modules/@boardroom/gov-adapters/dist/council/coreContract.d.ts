import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    proposalId: BigNumber;
    created: BigNumber;
    execution: BigNumber;
    expiration: BigNumber;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    proposalId: BigNumber;
}>;
export declare type AnyProposalEvent = ProposalExecuted | ProposalCreated;
export declare type Voted = ParsedEvent<'Voted', {
    voter: string;
    proposalId: BigNumber;
    /** 0 = YES, 1 = NO, 2 = MAYBE */
    vote: {
        castBallot: number;
        votingPower: BigNumber;
    };
}>;
export declare type VoteChange = ParsedEvent<'VoteChange', {
    from: string;
    to: string;
    amount: BigNumber;
}>;
export declare type DelegateChangeEvents = VoteChange;
export declare class CouncilCoreVotingContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    getProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    getProposalEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    getVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<Voted>>>;
}
