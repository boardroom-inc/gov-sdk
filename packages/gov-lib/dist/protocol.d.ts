import { Adapters } from './adapters';
import { TaggedTypeResolver } from './resolver';
export declare type CategoryTypes = 'Uncategorized' | 'Uncategorized ' | 'Protocol' | 'Investment' | 'Grants' | 'Social' | 'Collector' | 'Media' | 'Service' | 'Product';
export declare type ProtocolTypes = 'DAO' | 'SubDAO' | 'Organisation';
export declare type MetadataType = {
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
export declare class Protocol {
    /** the canonical identifier used to reference a protocol */
    readonly cname: string;
    /** the display name of this protocol */
    readonly name: string;
    /** the set of implemented resolvers for this protocol */
    private readonly _adapters;
    readonly metaDataOptions: MetadataType;
    constructor(
    /** the canonical identifier used to reference a protocol */
    cname: string, 
    /** the display name of this protocol */
    name: string, 
    /** the set of implemented resolvers for this protocol */
    _adapters: TaggedTypeResolver<Adapters>, metaDataOptions: MetadataType);
    /**
     * Resolve a speicifc adapter for this protocols. Throws if not implemented
     */
    adapter<K extends keyof Adapters>(tag: K, instance?: string): Adapters[K];
    /**
     * Return an array of instance names for a specific adapter
     */
    adapterInstances(tag: keyof Adapters): string[];
    /**
     * Returns true if this protocol implements a specific adapter
     */
    hasAdapter(tag: keyof Adapters, instance?: string): boolean;
    /**
     * Get all implemented adapters for this protocol
     */
    getAdapters(): Array<{
        adapter: keyof Adapters;
        instance: string;
    }>;
}
