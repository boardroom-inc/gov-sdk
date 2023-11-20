import { IconAdapter, IconInfo, TransportResolver } from '@boardroom/gov-lib';

/*

  Using alchemy's custom RPC methods

  https://docs.alchemy.com/alchemy/documentation/alchemy-api-reference/token-api#alchemy_gettokenmetadata

*/

interface GetTokenMetadataResponse {
  decimals: number;
  logo: string | null;
  name: string;
  symbol: string;
}

export class AlchemyAdapter implements IconAdapter {
  constructor(
    private readonly address: string,
    private readonly transports: TransportResolver,
    private readonly chainId?: number
  ) {}

  async getIcons(): Promise<IconInfo> {
    const { logo } = await this._getTokenMetadata();

    if (logo === null) {
      return { icons: [] };
    }

    return { icons: [{ size: 'default', url: logo }] };
  }

  async _getTokenMetadata(): Promise<GetTokenMetadataResponse> {
    const rpc = this.transports('rpc').network(this.chainId ? this.chainId : 1);
    return await rpc.send('alchemy_getTokenMetadata', [this.address]);
  }
}
