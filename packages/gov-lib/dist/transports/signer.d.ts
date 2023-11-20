import { JsonRpcSigner } from '@ethersproject/providers';
/**
 * web3 signer transport
 */
export declare class SignerTransport {
    readonly signer: JsonRpcSigner;
    constructor(signer: JsonRpcSigner);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
}
