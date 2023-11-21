import { JsonRpcProvider } from '@ethersproject/providers';
import { IpfsTransport } from './ipfs';
import { TaggedTypeResolver } from '../resolver';
import { HttpTransport } from './http';
import { NetworkTransportResolver } from './network-transport';
import { SignerTransport } from './signer';
export { JsonRpcProvider as JsonRpcTransport } from '@ethersproject/providers';
export interface Transports {
    ipfs: IpfsTransport;
    rpc: NetworkTransportResolver<JsonRpcProvider>;
    signer: SignerTransport;
    http: HttpTransport;
}
/**
 * A function that will resolve a specific transport by name
 */
export declare type TransportResolver = TaggedTypeResolver<Transports>['get'];
