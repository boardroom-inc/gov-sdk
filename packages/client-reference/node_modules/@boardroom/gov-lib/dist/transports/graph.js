"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphTransport = void 0;
const graphql_request_1 = require("graphql-request");
/**
 * Make requests to a graphQL endpoint
 */
class GraphTransport {
    /**
     * Query a graphQL end point
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async query(endpoint, graphQuery, variables = {}) {
        return await (0, graphql_request_1.request)(endpoint, graphQuery, variables);
    }
}
exports.GraphTransport = GraphTransport;
//# sourceMappingURL=graph.js.map