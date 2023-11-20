/*

  This module implements a data source that uses the http transport to make
  requests the snapshot.org REST API

  https://docs.snapshot.org/hub-api

*/

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
type GetProposalsResponse = {
  [ipfsHash: string]: GetProposalsEntry;
};

/**
 * Response for all votes for a specific proposal
 */
type GetVotesResponse = {
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
export class SnapshotDataSource {
  constructor(private readonly transports: TransportResolver) {}

  /**
   * Get a single proposal (reads from IPFS)
   */
  async getProposal(proposalId: string): Promise<GetProposalsEntry> {
    const file = await this.transports('ipfs').fetchJson(proposalId); // hella cached
    const msg = JSON.parse(file.msg);
    return { address: file.address, msg };
    return msg;
  }

  /**
   * Get information about a specific space
   */
  async getSpace(spaceName: string): Promise<GetSpaceResponse> {
    // cache space data a bit more aggressively
    const resp = await this._get(`spaces/${spaceName}`, 60);
    return resp;
  }

  /**
   * Get all proposals for a given space
   */
  async getAllProposals(spaceName: string): Promise<GetProposalsResponse> {
    const resp = await this._get(`${spaceName}/proposals`, 5);
    return resp;
  }

  /**
   * Get all votes for a specific proposal
   */
  async getAllProposalVotes(spaceName: string, proposalId: string): Promise<GetVotesResponse> {
    const resp = await this._get(`${spaceName}/proposal/${proposalId}`, 5);
    return resp;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _get(path: string, maxAgeInSeconds = 0): Promise<any> {
    const url = `https://hub.snapshot.org/api/${path}`;
    const { data } = await this.transports('http').getJson(url, maxAgeInSeconds);
    return data;
  }
}
