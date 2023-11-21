import { Protocol, ProtocolRegistrationFunction, Time, Transports, TaggedTypeResolver } from '@boardroom/gov-lib';
/**
 * All configuration options for the governance SDK
 */
export interface GovernanceSDKOptions {
    /**
     * Client transport overrides
     *
     * SDK clients can inject transport instances that provide access to external
     * data sources like IPFS or a blockchain network. Transports are used by the
     * low-level protocol adapter implementations to access external data.
     *
     * A client can chose to override none, some, or all of the transport
     * instances
     */
    transports?: Partial<Transports>;
    /**
     * Protocol registraton functions
     *
     * SDK clients can provide an explict list of protocols to only integrate a
     * subset of all protocols added to the governance SDK repo. By default, all
     * protocols exported from the `@boardroom/gov-protocols` are registered.
     */
    protocols?: ProtocolRegistrationFunction[];
    snapshotApiKey?: string;
    boardroomAPIKey?: string;
    etherscanMainnetAPIKey?: string;
    etherscanOptimismAPIKey?: string;
}
/**
 * The Governance SDK
 *
 * A protocol and blockchain agnostic governance interopability framework.
 */
export declare class GovernanceSDK {
    private readonly _registry;
    readonly transports: TaggedTypeResolver<Transports>;
    readonly snapshotApiKey: string | undefined;
    readonly boardroomAPIKey: string | undefined;
    readonly etherscanMainnetAPIKey: string | undefined;
    readonly etherscanOptimismAPIKey: string | undefined;
    constructor(options?: GovernanceSDKOptions);
    /**
     * Get a protocol by its cname
     *
     * Will throw if no protocol has been registered with that cname
     */
    getProtocol(cname: string): Protocol;
    /**
     * Get an array of all registered protocols
     */
    getAllProtocols(): Protocol[];
    /**
     * Return a Time union
     *
     * Only includes blockNumber if an rpc transport was provided when
     * instantiating the SDK
     */
    getCurrentTime(network?: number): Promise<Time>;
}
