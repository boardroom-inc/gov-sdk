import { getAdminPods, init } from '@orcaprotocol/orca-sdk';
import { PodAdapter, PodInfo, PodList, TransportResolver } from '@boardroom/gov-lib';

/**
 * An adapter to get Orca pods
 */
export class OrcaPodAdapter implements PodAdapter {
  constructor(
    private adminAddress: string,
    private readonly transports: TransportResolver,
    private readonly chainId?: number
  ) {}

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getPods(): Promise<PodList> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    init({ provider: rpc, network: await this.getChainId() });

    const adminPods = await getAdminPods(this.adminAddress);

    const podList: PodInfo[] = [];
    for (const pod of adminPods) {
      const members = await pod.getMembers();

      const podInfo: PodInfo = {
        address: pod.safe,
        ensName: pod.ensName,
        adminAddress: pod.admin,
        membersList: members,
        imageUrl: pod.imageUrl,
      };

      podList.push(podInfo);
    }

    return { podList };
  }
}
