import { HttpTransport } from './http';

/**
 * Fetch objects from IPFS via an HTTP gateway
 */
export class IpfsTransport {
  constructor(
    private readonly http: HttpTransport,
    private readonly gateway: string = `https://gateway.pinata.cloud/ipfs/`
  ) {}

  /**
   * Fetch an object from IPFS
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchJson(ipfsHash: string): Promise<any> {
    const url = `${this.gateway}${ipfsHash}`;

    // cache IPFS requests for a long time
    const { data } = await this.http.getJson(url, 60 * 60 * 24);
    return data;
  }

  /**
   * Fetch raw data from IPFS
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fetchRaw(ipfsHash: string): Promise<any> {
    const url = `${this.gateway}${ipfsHash}`;

    const data = await (await this.http.fetch(url)).text();
    return data;
  }
}
