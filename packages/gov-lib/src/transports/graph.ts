import { request } from 'graphql-request';

/**
 * Make requests to a graphQL endpoint
 */
export class GraphTransport {
  /**
   * Query a graphQL end point
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(endpoint: string, graphQuery: string, variables: Record<string, unknown> = {}): Promise<unknown> {
    return await request(endpoint, graphQuery, variables);
  }
}
