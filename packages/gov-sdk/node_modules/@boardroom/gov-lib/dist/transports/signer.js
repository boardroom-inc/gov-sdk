"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerTransport = void 0;
const bytes_1 = require("@ethersproject/bytes");
/**
 * web3 signer transport
 */
class SignerTransport {
    constructor(signer) {
        this.signer = signer;
    }
    async getAddress() {
        return this.signer.getAddress();
    }
    async signMessage(message) {
        const address = await this.getAddress();
        const encodedMessage = (0, bytes_1.hexlify)(new Buffer(message, 'utf8'));
        return this.signer.provider.send('personal_sign', [encodedMessage, address]);
    }
}
exports.SignerTransport = SignerTransport;
//# sourceMappingURL=signer.js.map