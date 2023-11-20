import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';

export const registerPangolin: ProtocolRegistrationFunction = (register) => {
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
