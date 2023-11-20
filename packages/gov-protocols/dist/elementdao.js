"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerElementDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerElementDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'elementdao';
    register({
        cname: cname,
        name: 'Element DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const council = new gov_adapters_1.CouncilAdapter({
                coreVotingAddress: '0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a',
                tokenAddress: '0x5c6D51ecBA4D8E4F20373e3ce96a62342B125D6d',
                transports,
                protocolName: cname,
                votingVaults: [
                    {
                        address: '0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD',
                        abi: gov_adapters_1.lockingVaultABI,
                        getDelegations: gov_adapters_1.getLockingVaultDelegations,
                    },
                    {
                        address: '0x6De73946eab234F1EE61256F10067D713aF0e37A',
                        abi: gov_adapters_1.vestingVaultABI,
                        getDelegations: gov_adapters_1.getVestingVaultDelegations,
                    },
                ],
                proposalsOffChainDataURL: 'https://raw.githubusercontent.com/element-foundation/council-kit/main/apps/council-ui/src/config/mainnet.ts',
                boardroomAPIKey,
            });
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'elfi.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x82eF450FB7f06E3294F2f19ed1713b255Af0f541', 1, transports);
            adapters.implement('proposals', council, 'onchain');
            adapters.implement('vote', council, 'onchain');
            adapters.implement('votePower', council, 'onchain');
            adapters.implement('delegation', council, 'onchain');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/elementdao.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerElementDAO = registerElementDAO;
//# sourceMappingURL=elementdao.js.map