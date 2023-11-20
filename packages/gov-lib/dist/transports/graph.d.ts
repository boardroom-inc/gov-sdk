/**
 * Make requests to a graphQL endpoint
 */
export declare class GraphTransport {
    /**
     * Query a graphQL end point
     */
    query(endpoint: string, graphQuery: string, variables?: Record<string, unknown>): Promise<unknown>;
}
