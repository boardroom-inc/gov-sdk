"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrcaPodAdapter = void 0;
const orca_sdk_1 = require("@orcaprotocol/orca-sdk");
/**
 * An adapter to get Orca pods
 */
class OrcaPodAdapter {
    constructor(adminAddress, transports, chainId) {
        this.adminAddress = adminAddress;
        this.transports = transports;
        this.chainId = chainId;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getPods() {
        const rpc = this.transports('rpc').network(await this.getChainId());
        (0, orca_sdk_1.init)({ provider: rpc, network: await this.getChainId() });
        const adminPods = await (0, orca_sdk_1.getAdminPods)(this.adminAddress);
        const podList = [];
        for (const pod of adminPods) {
            const members = await pod.getMembers();
            const podInfo = {
                address: pod.safe,
                ensName: pod.ensName,
                adminAddress: pod.admin,
                membersList: members,
                imageUrl: pod.imageUrl,
            };
            podList.push(podInfo);
        }
        return { podList };
    }
}
exports.OrcaPodAdapter = OrcaPodAdapter;
//# sourceMappingURL=adapter.js.map