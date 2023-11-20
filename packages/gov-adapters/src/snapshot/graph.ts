import { TransportResolver, VotePowerInfo } from '@boardroom/gov-lib';
import { BigNumber } from 'ethers';
import { gql, GraphQLClient } from 'graphql-request';

/*

  This module implements a simple client for Snapshot's Graph API

  https://docs.snapshot.org/graphql-api

*/

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
  strategies: Array<{ name: string; params: unknown }>;
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
export class SnapshotGraphAPI {
  constructor(private readonly transports: TransportResolver, private readonly snapshotApiKey?: string) {}

  async getSpace(spaceName: string): Promise<SnapshotGraphSpace> {
    const graph = this._getClient();
    const query = gql`
      query getSpace($space: String!) {
        space(id: $space) {
          strategies {
            name
            network
            params
          }
          network
        }
      }
    `;

    const resp: { space: SnapshotGraphSpace | null } = await graph.request(query, { space: spaceName });

    if (resp.space === null) {
      throw new Error(`invalid space: ${spaceName}`);
    }

    return resp.space;
  }

  /**
   * Get proposals for a specific space
   */
  async getProposalsBySpace(spaceName: string, offset = 0, limit = 100, status?: string, proposalIds?: Array<String>): Promise<GetProposalsResponse> {
    const graph = this._getClient();

  const query = gql`
      query getProposals($space: String!, $offset: Int!, $limit: Int!, $state: String, $id_in: [String]) {
        # fetch paginated list of proposal
        proposals(where: { space: $space, state: $state, id_in: $id_in }, orderBy: "created", orderDirection: asc, first: $limit, skip: $offset) {
          id
          author
          created
          type
          title
          body
          choices
          start
          end
          quorum
          space {
            id
          }
          network
          snapshot
          strategies {
            name
            network
            params
          },
          scores
          privacy
          flagged
        }
      }
    `;

    const resp: GetProposalsResponse = await graph.request(query, { space: spaceName, offset, limit, state: status, id_in: proposalIds});
    return resp;
  }

  /**
   * Get votes for a specific proposal in a space
   */
  async getVotesForProposal(spaceName: string, proposal: string, lastCreatedAt: number, limit: number, offset: number): Promise<GetVotesResponse> {
      const graph = this._getClient();
      const query = gql`
        query getVotes($space: String!, $proposal: String!, $lastCreatedAt: Int!, $limit: Int!, $offset: Int!) {
          # fetch paginated votes (across an entire space)
          votes(
            where: {
              space: $space,
              proposal: $proposal,
              created_gte: $lastCreatedAt
            }
            orderBy: "created"
            orderDirection: asc
            first: $limit
            skip: $offset
          ) {
            proposal {
              id
              network
              snapshot
              strategies {
                name
                network
                params
              }
              privacy
            }
            voter
            choice
            created
            reason
            vp
          }
        }
      `;
  
      const resp: GetVotesResponse = await graph.request(query, { space: spaceName, proposal, lastCreatedAt, limit, offset });
    
      return resp;
    }

  /**
   * Get votes across all proposals in a space
   */
  async getVotes(spaceName: string, lastCreatedAt = 0, limit = 100, offset = 0): Promise<GetVotesResponse> {
    const graph = this._getClient();
    const query = gql`
      query getVotes($space: String!, $lastCreatedAt: Int!, $limit: Int!, $offset: Int!) {
        # fetch paginated votes (across an entire space)
        votes(
          where: { space: $space, created_gte: $lastCreatedAt }
          orderBy: "created"
          orderDirection: asc
          first: $limit
          skip: $offset
        ) {
          proposal {
            id
            network
            snapshot
            strategies {
              name
              network
              params
            }
            privacy
          }
          voter
          choice
          created
          reason
          vp
        }
      }
    `;

    const resp: GetVotesResponse = await graph.request(query, { space: spaceName, lastCreatedAt, limit, offset });

    return resp;
  }

  async getScores(voter: string, space: string, proposal?: string): Promise<VotePowerInfo> {
    const graph = this._getClient();
    const query = gql`
      query getScores($voter: String!, $space: String!, $proposal: String) {
        vp(voter: $voter, space: $space, proposal: $proposal) {
          vp
        }
      }
    `;

    const resp = await graph.request(query, { voter, space, proposal });

    return {
      address: voter,
      protocol: space,
      power: resp.vp.vp,
    };
  }

  private _getClient(): GraphQLClient {
    const http = this.transports('http');
    if (this.snapshotApiKey) {
      const options = {
        fetch: http.fetch,
        headers: {
          'x-api-key': this.snapshotApiKey,
        },
      };
      return new GraphQLClient('https://hub.snapshot.org/graphql', options);
    }

    return new GraphQLClient('https://hub.snapshot.org/graphql', {
      fetch: http.fetch,
    });
  }
}
