import { PodAdapter, PodList, TransportResolver } from '@boardroom/gov-lib';
/**
 * An adapter to get Orca pods
 */
export declare class OrcaPodAdapter implements PodAdapter {
    private adminAddress;
    private readonly transports;
    private readonly chainId?;
    constructor(adminAddress: string, transports: TransportResolver, chainId?: number | undefined);
    getChainId(): Promise<number>;
    getPods(): Promise<PodList>;
}
