"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotGraphAPI = void 0;
const graphql_request_1 = require("graphql-request");
/**
 * Communicate with snapshot's Graph API
 */
class SnapshotGraphAPI {
    constructor(transports, snapshotApiKey) {
        this.transports = transports;
        this.snapshotApiKey = snapshotApiKey;
    }
    async getSpace(spaceName) {
        const graph = this._getClient();
        const query = (0, graphql_request_1.gql) `
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
        const resp = await graph.request(query, { space: spaceName });
        if (resp.space === null) {
            throw new Error(`invalid space: ${spaceName}`);
        }
        return resp.space;
    }
    /**
     * Get proposals for a specific space
     */
    async getProposalsBySpace(spaceName, offset = 0, limit = 100, status, proposalIds) {
        const graph = this._getClient();
        const query = (0, graphql_request_1.gql) `
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
        const resp = await graph.request(query, { space: spaceName, offset, limit, state: status, id_in: proposalIds });
        return resp;
    }
    /**
     * Get votes for a specific proposal in a space
     */
    async getVotesForProposal(spaceName, proposal, lastCreatedAt, limit, offset) {
        const graph = this._getClient();
        const query = (0, graphql_request_1.gql) `
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
        const resp = await graph.request(query, { space: spaceName, proposal, lastCreatedAt, limit, offset });
        return resp;
    }
    /**
     * Get votes across all proposals in a space
     */
    async getVotes(spaceName, lastCreatedAt = 0, limit = 100, offset = 0) {
        const graph = this._getClient();
        const query = (0, graphql_request_1.gql) `
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
        const resp = await graph.request(query, { space: spaceName, lastCreatedAt, limit, offset });
        return resp;
    }
    async getScores(voter, space, proposal) {
        const graph = this._getClient();
        const query = (0, graphql_request_1.gql) `
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
    _getClient() {
        const http = this.transports('http');
        if (this.snapshotApiKey) {
            const options = {
                fetch: http.fetch,
                headers: {
                    'x-api-key': this.snapshotApiKey,
                },
            };
            return new graphql_request_1.GraphQLClient('https://hub.snapshot.org/graphql', options);
        }
        return new graphql_request_1.GraphQLClient('https://hub.snapshot.org/graphql', {
            fetch: http.fetch,
        });
    }
}
exports.SnapshotGraphAPI = SnapshotGraphAPI;
//# sourceMappingURL=graph.js.map