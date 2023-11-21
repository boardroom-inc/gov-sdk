import { HttpTransport } from './http';
/**
 * Fetch objects from IPFS via an HTTP gateway
 */
export declare class IpfsTransport {
    private readonly http;
    private readonly gateway;
    constructor(http: HttpTransport, gateway?: string);
    /**
     * Fetch an object from IPFS
     */
    fetchJson(ipfsHash: string): Promise<any>;
    /**
     * Fetch raw data from IPFS
     */
    fetchRaw(ipfsHash: string): Promise<any>;
}
