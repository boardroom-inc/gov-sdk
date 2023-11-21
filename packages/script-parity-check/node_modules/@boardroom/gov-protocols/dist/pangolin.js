"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPangolin = void 0;
const registerPangolin = (register) => {
    const cname = 'pangolin';
    register({
        cname: cname,
        name: 'Pangolin',
        category: ['Product'],
        adapters: (adapters) => {
            // Governance ,Treasury and token info on avalanch network
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pangolin_kQmagWANN.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPangolin = registerPangolin;
//# sourceMappingURL=pangolin.js.map