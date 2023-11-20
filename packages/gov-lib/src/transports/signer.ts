import { JsonRpcSigner } from '@ethersproject/providers';
import { hexlify } from '@ethersproject/bytes';

/**
 * web3 signer transport
 */
export class SignerTransport {
  constructor(readonly signer: JsonRpcSigner) {}

  async getAddress(): Promise<string> {
    return this.signer.getAddress();
  }

  async signMessage(message: string): Promise<string> {
    const address = await this.getAddress();
    const encodedMessage = hexlify(new Buffer(message, 'utf8'));

    return this.signer.provider.send('personal_sign', [encodedMessage, address]);
  }
}
