export declare type NetworkTransportInstances<T> = Record<string | number, T>;
export declare class NetworkTransportResolver<T> {
    private readonly instances;
    constructor(instances: NetworkTransportInstances<T>);
    network(chainId: string | number): T;
}
