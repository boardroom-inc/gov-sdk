"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIdeamaket = void 0;
const registerIdeamaket = (register) => {
    const cname = 'ideamarket';
    register({
        cname: cname,
        name: 'Ideamarket',
        category: ['Service'],
        adapters: (adapters) => {
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ideamarket_eAdy75zfj.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerIdeamaket = registerIdeamaket;
//# sourceMappingURL=ideamarket.js.map