"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbeanstalkfarmseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbeanstalkfarmseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'beanstalkfarmseth',
        name: 'Beanstalk Farms',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'beanstalkfarms.eth',
                transports,
                cname: 'beanstalkfarmseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/beanstalkfarmseth_xwFeFR9EMu.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbeanstalkfarmseth = registerbeanstalkfarmseth;
//# sourceMappingURL=beanstalkfarmseth.js.map