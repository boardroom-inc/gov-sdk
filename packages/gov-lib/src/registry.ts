import { AdapterRegistry } from './adapter-registry';
import { Adapters } from './adapters';
import { Protocol, ProtocolTypes, CategoryTypes } from './protocol';
import { TaggedTypeResolver } from './resolver';

/**
 * Information provided during protocol registration
 */
export interface ProtocolRegistration {
  cname: string;
  name: string;
  category?: CategoryTypes[];
  type?: ProtocolTypes;
  isEnabled?: boolean;
  associatedAddresses?: string[];
  associatedProtocols?: string[];
  adapters?: (adapters: AdapterRegistry) => void;
}

/**
 * Manage registered protocols
 */
export class ProtocolRegistry {
  private _protocols: Map<string, Protocol> = new Map();

  /**
   * Registers a new protocol and its adpaters
   */
  register(info: ProtocolRegistration): void {
    if (this._protocols.has(info.cname)) {
      // Check if protocol cname exists
      throw new Error();
    }
    // if the protocol implements adapters, create the new tagged type resolver
    // and pass it into the adapters function to wire up all implemented
    // adapters
    const adapters = new TaggedTypeResolver<Adapters>();
    if (info.adapters) {
      const adapterRegistry = new AdapterRegistry(adapters);
      info.adapters(adapterRegistry);
    }
    if (!info.category) {
      info.category = ['Uncategorized'];
    }

    if (info.isEnabled === undefined) {
      info.isEnabled = true;
    }

    if (!info.type) {
      info.type = 'DAO';
    }

    if (!info.associatedAddresses) {
      info.associatedAddresses = [];
    }

    if (!info.associatedProtocols) {
      info.associatedProtocols = [];
    }

    // add it to the protocol map
    const protocol = new Protocol(info.cname, info.name, adapters, {
      category: info.category,
      type: info.type,
      isEnabled: info.isEnabled,
      associatedAddresses: info.associatedAddresses,
      associatedProtocols: info.associatedProtocols,
    });

    this._protocols.set(info.cname, protocol);
  }

  /**
   * Get a specific protocol by its cname, throws if not found
   */
  get(cname: string): Protocol {
    const protocol = this._protocols.get(cname);
    if (!protocol) {
      throw new Error();
    }

    return protocol;
  }

  /**
   * Iterate through all protocol
   */
  *all(): IterableIterator<Protocol> {
    yield* this._protocols.values();
  }
}
