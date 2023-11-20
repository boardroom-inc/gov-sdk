/**
 * Manage a heterogenous one-to-many mapping from a string tag to a typed value
 * that can be augmented by a decorator
 */
export class TaggedTypeResolver<T> {
  private _things = new Map<keyof T, Map<string, T[keyof T]>>();

  constructor(things: Partial<T> = {}) {
    this.add(things);
  }

  /**
   * Set a value in the resolver. Throws if it already exists
   */
  set<K extends keyof T>(tag: K, thing: T[K], instance = 'default'): void {
    const instances = this._getInstances(tag);
    if (instances.has(instance)) {
      throw new Error(`already have entry for ${String(tag)}:${instance}`);
    }

    instances.set(instance, thing);
  }

  /**
   * Given a partial of our typed values, add it to the resolver
   */
  add(things: Partial<T>): void {
    for (const key in things) {
      this.set(key, things[key] as T[keyof T]);
    }
  }

  /**
   * Resolve a typed value out of the resolver, throws if does not exist
   */
  get<K extends keyof T>(tag: K, instance = 'default'): T[K] {
    const instances = this._getInstances(tag);
    const thing = instances.get(instance);
    if (thing === undefined) {
      throw new Error(`no entry for ${String(tag)}:${instance}`);
    }

    return thing;
  }

  /**
   * Gets a list of instance (names) for a specific tag
   */
  getInstances(tag: keyof T): string[] {
    return [...this._getInstances(tag).keys()];
  }

  /**
   * Get a list of all tags and instances
   */
  getTags(): Array<{ tag: keyof T; instance: string }> {
    const tags = [...this._things.keys()];
    const tagsAndInstances = tags.flatMap((tag) => {
      const instances = this.getInstances(tag);
      return instances.map((instance) => ({ tag, instance }));
    });
    return tagsAndInstances;
  }

  /**
   * Returns true if the resolver has a specific tag
   */
  has<K extends keyof T>(tag: K, instance = 'default'): boolean {
    return this._getInstances(tag).has(instance);
  }

  _getInstances<K extends keyof T>(tag: K): Map<string, T[K]> {
    let map = this._things.get(tag);
    if (map === undefined) {
      map = new Map();
      this._things.set(tag, map);
    }

    // casting here since we know that we have a narrower type than T[keyof T]
    // based on how this class is implemented, but its not possible to
    // statically type that AFAIK
    return map as Map<string, T[K]>;
  }
}
