import { Adapters } from './adapters';
import { TaggedTypeResolver } from './resolver';

export type CategoryTypes =
  | 'Uncategorized'
  | 'Uncategorized '
  | 'Protocol'
  | 'Investment'
  | 'Grants'
  | 'Social'
  | 'Collector'
  | 'Media'
  | 'Service'
  | 'Product';

export type ProtocolTypes = 'DAO' | 'SubDAO' | 'Organisation';

export type MetadataType = {
  /** the display category of this protocol */
  category?: CategoryTypes[];
  /** the Type of a protocol */
  type?: ProtocolTypes;

  /** field to enable or disable a protocol in backend so that it doesn't show up in API , default = true*/
  isEnabled?: boolean;

  /** Adresses associated with protocol, used for returning activity of protocols */
  associatedAddresses?: string[];

  /** Protocols cnames associated with */
  associatedProtocols?: string[];
};

/**
 * The client-side protocol abstraction
 */
export class Protocol {
  constructor(
    /** the canonical identifier used to reference a protocol */
    public readonly cname: string,

    /** the display name of this protocol */
    public readonly name: string,

    /** the set of implemented resolvers for this protocol */
    private readonly _adapters: TaggedTypeResolver<Adapters>,

    public readonly metaDataOptions: MetadataType
  ) {}

  /**
   * Resolve a speicifc adapter for this protocols. Throws if not implemented
   */
  adapter<K extends keyof Adapters>(tag: K, instance?: string): Adapters[K] {
    return this._adapters.get(tag, instance);
  }

  /**
   * Return an array of instance names for a specific adapter
   */
  adapterInstances(tag: keyof Adapters): string[] {
    return this._adapters.getInstances(tag);
  }

  /**
   * Returns true if this protocol implements a specific adapter
   */
  hasAdapter(tag: keyof Adapters, instance?: string): boolean {
    return this._adapters.has(tag, instance);
  }

  /**
   * Get all implemented adapters for this protocol
   */
  getAdapters(): Array<{ adapter: keyof Adapters; instance: string }> {
    const tags = this._adapters.getTags();
    return tags.map((t) => ({ adapter: t.tag, instance: t.instance }));
  }
}
