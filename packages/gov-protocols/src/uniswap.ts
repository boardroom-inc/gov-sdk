import { ExternalLink, PaginationOptions, ProposalPage, ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CompoundGovernorAlphaAdapter,
  CompoundGovernorBravoAdapter,
  CompoundGovernorBravoContract,
  mapProposal,
  CovalentAdapter,
  SnapshotAdapter,
} from '@boardroom/gov-adapters';

class UniswapProposalAdapter extends CompoundGovernorAlphaAdapter {
  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Uniswap Governance',
      url: 'https://app.uniswap.org/#/vote',
    };
  }
}

class UniswapProposalBravoAdapter extends CompoundGovernorBravoAdapter {
  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Uniswap Governance',
      url: 'https://app.uniswap.org/#/vote',
    };
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const governor = new CompoundGovernorBravoContract(await this.getGovernanceAddress(), await this.getTransports());
    const results = await governor.getProposalCreatedEvents(1, pagination.cursor);

    const quorum = await governor.getQuorum(await this.getChainId());

    // Other adapters have much more proposal details/title/description for ids < 9 so we should continue to use those as to not overlap with that
    const proposals = results.items
      .filter((item) => item.parsed.args.id.toNumber() > 8)
      .map((item) => mapProposal(item.parsed, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, item.event.transactionHash));

    return { items: proposals, nextCursor: results.nextCursor };
  }
}

export const registerUniswap: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'uniswap';
  register({
    cname: cname,
    name: 'Uniswap',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new UniswapProposalAdapter({
        governanceAddress: '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F',
        tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });

      // uniswap swapped to a new gov contract in order reduce min power for proposal, details here:
      // https://www.fish.vote/proposal/0xA13a5a31b891F3DA7074b740B694769BD0f1bb23
      const governorV2 = new UniswapProposalAdapter({
        governanceAddress: '0xc4e172459f1e7939d522503b81afaac1014ce6f6',
        tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });

      // Uniswap swapped to governor bravo so they wouldn't have to change addresses if they changed governance variables again
      const governorBravo = new UniswapProposalBravoAdapter({
        governanceAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
        tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const snapshot = new SnapshotAdapter({
        spaceName: 'uniswap',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('uniswap', transports);
      // Treasury addresses sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
      const treasury = new CovalentAdapter(
        ['0x1a9c8182c09f50c8318d769245bea52c32be35bc', '0x4750c43867ef5f89869132eccf19b9b6c4286e1a'],
        1,
        transports
      );

      adapters.implement('createOnChainProposal', governorBravo, 'onchain');
      adapters.implement('proposals', governorBravo, 'onchain');
      adapters.implement('vote', governorBravo, 'onchain');
      adapters.implement('delegation', governorBravo, 'onchain');
      adapters.implement('votePower', governorBravo, 'onchain');
      adapters.implement('general', governorBravo, 'onchain');

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('proposals', governor, 'archive');
      adapters.implement('proposals', governorV2, 'archiveAlpha');

      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/uniswap_WSFR_6wiR.png',
              },
            ],
          };
        },
      });
    },
  });
};
