import { IconAdapter, IconInfo, TransportResolver } from '@boardroom/gov-lib';
interface GetTokenMetadataResponse {
    decimals: number;
    logo: string | null;
    name: string;
    symbol: string;
}
export declare class AlchemyAdapter implements IconAdapter {
    private readonly address;
    private readonly transports;
    private readonly chainId?;
    constructor(address: string, transports: TransportResolver, chainId?: number | undefined);
    getIcons(): Promise<IconInfo>;
    _getTokenMetadata(): Promise<GetTokenMetadataResponse>;
}
export {};
