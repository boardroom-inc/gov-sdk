/**
 * Manage a heterogenous one-to-many mapping from a string tag to a typed value
 * that can be augmented by a decorator
 */
export declare class TaggedTypeResolver<T> {
    private _things;
    constructor(things?: Partial<T>);
    /**
     * Set a value in the resolver. Throws if it already exists
     */
    set<K extends keyof T>(tag: K, thing: T[K], instance?: string): void;
    /**
     * Given a partial of our typed values, add it to the resolver
     */
    add(things: Partial<T>): void;
    /**
     * Resolve a typed value out of the resolver, throws if does not exist
     */
    get<K extends keyof T>(tag: K, instance?: string): T[K];
    /**
     * Gets a list of instance (names) for a specific tag
     */
    getInstances(tag: keyof T): string[];
    /**
     * Get a list of all tags and instances
     */
    getTags(): Array<{
        tag: keyof T;
        instance: string;
    }>;
    /**
     * Returns true if the resolver has a specific tag
     */
    has<K extends keyof T>(tag: K, instance?: string): boolean;
    _getInstances<K extends keyof T>(tag: K): Map<string, T[K]>;
}
