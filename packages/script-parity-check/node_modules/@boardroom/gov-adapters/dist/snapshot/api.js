"use strict";
/*

  This module implements a data source that uses the http transport to make
  requests the snapshot.org REST API

  https://docs.snapshot.org/hub-api

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotDataSource = void 0;
/**
 * Interact with the Snapshot REST API
 */
class SnapshotDataSource {
    constructor(transports) {
        this.transports = transports;
    }
    /**
     * Get a single proposal (reads from IPFS)
     */
    async getProposal(proposalId) {
        const file = await this.transports('ipfs').fetchJson(proposalId); // hella cached
        const msg = JSON.parse(file.msg);
        return { address: file.address, msg };
        return msg;
    }
    /**
     * Get information about a specific space
     */
    async getSpace(spaceName) {
        // cache space data a bit more aggressively
        const resp = await this._get(`spaces/${spaceName}`, 60);
        return resp;
    }
    /**
     * Get all proposals for a given space
     */
    async getAllProposals(spaceName) {
        const resp = await this._get(`${spaceName}/proposals`, 5);
        return resp;
    }
    /**
     * Get all votes for a specific proposal
     */
    async getAllProposalVotes(spaceName, proposalId) {
        const resp = await this._get(`${spaceName}/proposal/${proposalId}`, 5);
        return resp;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async _get(path, maxAgeInSeconds = 0) {
        const url = `https://hub.snapshot.org/api/${path}`;
        const { data } = await this.transports('http').getJson(url, maxAgeInSeconds);
        return data;
    }
}
exports.SnapshotDataSource = SnapshotDataSource;
//# sourceMappingURL=api.js.map