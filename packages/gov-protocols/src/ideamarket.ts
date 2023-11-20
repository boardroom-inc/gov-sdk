import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
export const registerIdeamaket: ProtocolRegistrationFunction = (register) => {
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
