import { TransportResolver } from '@boardroom/gov-lib';
/**
 * msg contents for the proposal type
 */
export interface SnapshotProposal {
    version: string;
    timestamp: string;
    space: string;
    type: 'proposal';
    payload: {
        name: string;
        body: string;
        metadata: {
            strategies?: unknown[];
        };
        start: number;
        end: number;
        snapshot: number | string;
        choices: string[];
    };
}
export interface GetProposalsEntry {
    address: string;
    msg: SnapshotProposal;
}
/**
 * Response for all proposals in a space
 */
declare type GetProposalsResponse = {
    [ipfsHash: string]: GetProposalsEntry;
};
/**
 * Response for all votes for a specific proposal
 */
declare type GetVotesResponse = {
    [address: string]: {
        address: string;
        authorIpfsHash: string;
        msg: {
            version: string;
            timestamp: string;
            space: string;
            type: 'vote';
            payload: {
                choice: number;
                proposal: string;
            };
        };
        relayerIpfsHash: string;
        sig: string;
    };
};
/**
 * Response for space details
 */
interface GetSpaceResponse {
    name: string;
    network: string;
    symbol: string;
    domain: string;
    strategies: unknown[];
    members: string[];
    filters: {
        minScore?: number;
        onlyMembers?: boolean;
    };
}
/**
 * Interact with the Snapshot REST API
 */
export declare class SnapshotDataSource {
    private readonly transports;
    constructor(transports: TransportResolver);
    /**
     * Get a single proposal (reads from IPFS)
     */
    getProposal(proposalId: string): Promise<GetProposalsEntry>;
    /**
     * Get information about a specific space
     */
    getSpace(spaceName: string): Promise<GetSpaceResponse>;
    /**
     * Get all proposals for a given space
     */
    getAllProposals(spaceName: string): Promise<GetProposalsResponse>;
    /**
     * Get all votes for a specific proposal
     */
    getAllProposalVotes(spaceName: string, proposalId: string): Promise<GetVotesResponse>;
    private _get;
}
export {};
