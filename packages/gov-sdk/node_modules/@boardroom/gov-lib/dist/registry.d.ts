import { AdapterRegistry } from './adapter-registry';
import { Protocol, ProtocolTypes, CategoryTypes } from './protocol';
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
export declare class ProtocolRegistry {
    private _protocols;
    /**
     * Registers a new protocol and its adpaters
     */
    register(info: ProtocolRegistration): void;
    /**
     * Get a specific protocol by its cname, throws if not found
     */
    get(cname: string): Protocol;
    /**
     * Iterate through all protocol
     */
    all(): IterableIterator<Protocol>;
}
