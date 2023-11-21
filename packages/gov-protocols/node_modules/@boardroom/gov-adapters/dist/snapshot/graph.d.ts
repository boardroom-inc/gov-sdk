import { TransportResolver, VotePowerInfo } from '@boardroom/gov-lib';
/** snapshot graph API proposal entity */
export interface SnapshotGraphProposal {
    id: string;
    author: string;
    /** timestamp */
    created: number;
    type: string;
    title: string;
    body: string;
    choices: string[];
    /** timestamp */
    start: number;
    /** timestamp */
    end: number;
    /**
     * block number
     * @example "10401005"
     */
    snapshot: string;
    space: {
        id: string;
    };
    /** @example "1" */
    network: string;
    strategies: Array<{
        name: string;
        params: unknown;
    }>;
    scores?: number[];
    privacy: string;
    quorum: number;
    flagged: boolean;
}
/** snapshot graph API vote entity */
export interface SnapshotGraphVote {
    /** timestamp */
    created: number;
    proposal: {
        id: string;
        snapshot: string;
        network: string;
        strategies: Array<{
            name: string;
            params: string;
        }>;
        privacy: string;
    };
    voter: string;
    /** 1-based index */
    choice: number | Array<number> | Record<number, number>;
    reason: string;
    vp: number;
}
/** snapshot graph API space entity */
export interface SnapshotGraphSpace {
    id: string;
    strategies: Array<{
        name: string;
        params: unknown;
    }>;
    network: string;
}
export interface GetProposalsResponse {
    proposals: SnapshotGraphProposal[];
}
export interface GetVotesResponse {
    votes: SnapshotGraphVote[];
}
/**
 * Communicate with snapshot's Graph API
 */
export declare class SnapshotGraphAPI {
    private readonly transports;
    private readonly snapshotApiKey?;
    constructor(transports: TransportResolver, snapshotApiKey?: string | undefined);
    getSpace(spaceName: string): Promise<SnapshotGraphSpace>;
    /**
     * Get proposals for a specific space
     */
    getProposalsBySpace(spaceName: string, offset?: number, limit?: number, status?: string, proposalIds?: Array<String>): Promise<GetProposalsResponse>;
    /**
     * Get votes for a specific proposal in a space
     */
    getVotesForProposal(spaceName: string, proposal: string, lastCreatedAt: number, limit: number, offset: number): Promise<GetVotesResponse>;
    /**
     * Get votes across all proposals in a space
     */
    getVotes(spaceName: string, lastCreatedAt?: number, limit?: number, offset?: number): Promise<GetVotesResponse>;
    getScores(voter: string, space: string, proposal?: string): Promise<VotePowerInfo>;
    private _getClient;
}
