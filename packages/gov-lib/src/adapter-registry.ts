import { AdapterInstanceType } from '.';
import { validators } from './adapters';
import { Adapters } from './adapters';
import { TaggedTypeResolver } from './resolver';
import { decorateWithValidators, ResponseValidator } from './validation';

/**
 * A wrapper around a tagged type resolver for Adapters that can be passed to
 * registrating function in order to setup adapters for protocol
 * implementations
 */
export class AdapterRegistry {
  constructor(private readonly resolver: TaggedTypeResolver<Adapters>) {}

  /**
   * Register an adapter implementation
   */
  implement<K extends keyof Adapters>(tag: K, implementation: Adapters[K], instance?: AdapterInstanceType): void {
    // having to manually cast here since theres no way to statically express
    // that the implementation and adapters have the same "key space", we are
    // really just narrowing out of the union of all response validators here
    const responseValidator = validators[tag] as ResponseValidator<Adapters[K]>;
    const wrapped = decorateWithValidators(implementation, responseValidator);
    this.resolver.set(tag, wrapped, instance);
  }
}
