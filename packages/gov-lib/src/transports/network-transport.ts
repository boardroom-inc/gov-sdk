export type NetworkTransportInstances<T> = Record<string | number, T>;

export class NetworkTransportResolver<T> {
  constructor(private readonly instances: NetworkTransportInstances<T>) {}

  network(chainId: string | number): T {
    const thing = this.instances[`${chainId}`];
    if (thing === undefined) {
      throw new Error(`unable to resolve dependency for network ${chainId}`);
    }
    return thing;
  }
}
