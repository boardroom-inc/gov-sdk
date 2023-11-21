"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbeanstalkfarmsbudgeteth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbeanstalkfarmsbudgeteth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'beanstalkfarmsbudgeteth',
        name: 'Beanstalk Farms Budget',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'beanstalkfarmsbudget.eth',
                transports,
                cname: 'beanstalkfarmsbudgeteth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/beanstalkfarmsbudgeteth_gJgp4nvn9B.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbeanstalkfarmsbudgeteth = registerbeanstalkfarmsbudgeteth;
//# sourceMappingURL=beanstalkfarmsbudgeteth.js.map