import { ProtocolRegistry } from './registry';
import { TaggedTypeResolver } from './resolver';
import { Transports } from './transports';

/**
 * Function that is responsible for registering protocols
 */
export type ProtocolRegistrationFunction = (
  register: ProtocolRegistry['register'],
  transport: TaggedTypeResolver<Transports>['get'],
  snapshotApiKey?: string,
  boardroomAPIKey?: string,
  etherscanMainnetAPIKey?: string,
  etherscanOptimismAPIKey?: string,
) => void;

export interface FrameworkConfiguration {
  /**
   * all implemented transports on this platform
   */
  transports: Partial<Transports>;

  /**
   * all of these functions will be called in order to register protocols with
   * the framework
   */
  registrators: ProtocolRegistrationFunction[];

  snapshotApiKey?: string;

  boardroomAPIKey?: string;

  etherscanMainnetAPIKey?: string;
  etherscanOptimismAPIKey?: string;
}

/**
 * Create a new protocol registry by processing a stack of "registator"
 * functions that will be injected with transports and allowed to register
 * protocols
 */
export const createRegistry = (frameworkConfig: FrameworkConfiguration): ProtocolRegistry => {
  const registry = new ProtocolRegistry();

  // create a resolver for the provided transports
  const transportResolver = new TaggedTypeResolver<Transports>();
  transportResolver.add(frameworkConfig.transports);

  // inject all registrator functions with what they need to get wired up
  const register = registry.register.bind(registry);
  const transport = transportResolver.get.bind(transportResolver);
  for (const registrator of frameworkConfig.registrators) {
    registrator(
      register,
      transport,
      frameworkConfig.snapshotApiKey,
      frameworkConfig.boardroomAPIKey,
      frameworkConfig.etherscanMainnetAPIKey,
      frameworkConfig.etherscanOptimismAPIKey,
    );
  }

  return registry;
};
