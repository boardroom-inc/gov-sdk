import {
  createRegistry,
  HttpTransport,
  IpfsTransport,
  Protocol,
  ProtocolRegistrationFunction,
  ProtocolRegistry,
  Time,
  Transports,
  TaggedTypeResolver,
} from '@boardroom/gov-lib';
import { protocols } from '@boardroom/gov-protocols';

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

  // key used for snashot api's used from Snapshot.utils.[api's]
  snapshotApiKey?: string;

  // Key to interact with the boardroom API
  boardroomAPIKey?: string;

  // Etherscan API keys
  etherscanMainnetAPIKey?: string;
  etherscanOptimismAPIKey?: string;
}

/**
 * The Governance SDK
 *
 * A protocol and blockchain agnostic governance interopability framework.
 */
export class GovernanceSDK {
  private readonly _registry: ProtocolRegistry;
  public readonly transports: TaggedTypeResolver<Transports>;
  public readonly snapshotApiKey: string | undefined;
  public readonly boardroomAPIKey: string | undefined;
  public readonly etherscanMainnetAPIKey: string | undefined;
  public readonly etherscanOptimismAPIKey: string | undefined;

  constructor(options: GovernanceSDKOptions = {}) {
    // default transports
    const http = new HttpTransport();
    const ipfs = new IpfsTransport(http);
    const transports: Partial<Transports> = {
      ipfs,
      http,
      ...options.transports,
    };

    this._registry = createRegistry({
      registrators: options.protocols ?? protocols,
      transports,
      snapshotApiKey: options.snapshotApiKey,
      boardroomAPIKey: options.boardroomAPIKey,
      etherscanMainnetAPIKey: options.etherscanMainnetAPIKey,
      etherscanOptimismAPIKey: options.etherscanOptimismAPIKey,
    });

    this.transports = new TaggedTypeResolver(transports);

    this.snapshotApiKey = options.snapshotApiKey;
    this.boardroomAPIKey = options.boardroomAPIKey;
    this.etherscanMainnetAPIKey = options.etherscanMainnetAPIKey;
    this.etherscanOptimismAPIKey = options.etherscanOptimismAPIKey;
  }

  /**
   * Get a protocol by its cname
   *
   * Will throw if no protocol has been registered with that cname
   */
  getProtocol(cname: string): Protocol {
    return this._registry.get(cname);
  }

  /**
   * Get an array of all registered protocols
   */
  getAllProtocols(): Protocol[] {
    return [...this._registry.all()];
  }

  /**
   * Return a Time union
   *
   * Only includes blockNumber if an rpc transport was provided when
   * instantiating the SDK
   */
  async getCurrentTime(network = 1): Promise<Time> {
    const timestamp = Date.now() / 1000;

    if (this.transports.has('rpc')) {
      const blockNumber = await this.transports.get('rpc').network(network).getBlockNumber();
      return { timestamp, blockNumber };
    }

    return { timestamp };
  }
}
