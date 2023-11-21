import { AdapterInstanceType } from '.';
import { Adapters } from './adapters';
import { TaggedTypeResolver } from './resolver';
/**
 * A wrapper around a tagged type resolver for Adapters that can be passed to
 * registrating function in order to setup adapters for protocol
 * implementations
 */
export declare class AdapterRegistry {
    private readonly resolver;
    constructor(resolver: TaggedTypeResolver<Adapters>);
    /**
     * Register an adapter implementation
     */
    implement<K extends keyof Adapters>(tag: K, implementation: Adapters[K], instance?: AdapterInstanceType): void;
}
