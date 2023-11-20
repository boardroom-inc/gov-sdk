
import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerzechubdaoeth: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
register({
    cname: 'zechubdaoeth',
    name: 'ZecHub',
    category: ["Media"],

    adapters: (adapters) => {
        const snapshot = new SnapshotAdapter({
            spaceName: 'zechubdao.eth',
            transports,
            cname: 'zechubdaoeth',
            chainId: 1,
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
                            url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/zechubdaoeth_Jrzla0eMA.png',
                        },
                    ],
                };
            },
        });
    },
});
};
