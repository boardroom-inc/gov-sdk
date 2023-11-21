"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbeanstalkbugbountyeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbeanstalkbugbountyeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'beanstalkbugbountyeth',
        name: 'Beanstalk Bug Bounty',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'beanstalkbugbounty.eth',
                transports,
                cname: 'beanstalkbugbountyeth',
                snapshotApiKey,
                boardroomAPIKey
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/beanstalkbugbountyeth_wPE-Inz9f_.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbeanstalkbugbountyeth = registerbeanstalkbugbountyeth;
//# sourceMappingURL=beanstalkbugbountyeth.js.map