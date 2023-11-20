"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbeanstalkdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbeanstalkdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'beanstalkdaoeth',
        name: 'Beanstalk DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'beanstalkdao.eth',
                transports,
                cname: 'beanstalkdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/beanstalkdaoeth_FnMLGFLk0.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbeanstalkdaoeth = registerbeanstalkdaoeth;
//# sourceMappingURL=beanstalkdaoeth.js.map