import { JsonRpcProvider } from '@ethersproject/providers';

import { IpfsTransport } from './ipfs';
import { TaggedTypeResolver } from '../resolver';
import { HttpTransport } from './http';
import { NetworkTransportResolver } from './network-transport';
import { SignerTransport } from './signer';

// re-exporting just for naming consistency
export { JsonRpcProvider as JsonRpcTransport } from '@ethersproject/providers';

/*

  This module "rolls up" all transport types the SDK supports

  As new transports are added, a new entry needs to be added to `Transports`
  to indicate the interface of that transport

*/

export interface Transports {
  ipfs: IpfsTransport;
  rpc: NetworkTransportResolver<JsonRpcProvider>;
  signer: SignerTransport;
  http: HttpTransport;
}

/**
 * A function that will resolve a specific transport by name
 */
export type TransportResolver = TaggedTypeResolver<Transports>['get'];
