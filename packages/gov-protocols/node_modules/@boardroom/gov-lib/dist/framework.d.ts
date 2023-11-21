import { ProtocolRegistry } from './registry';
import { TaggedTypeResolver } from './resolver';
import { Transports } from './transports';
/**
 * Function that is responsible for registering protocols
 */
export declare type ProtocolRegistrationFunction = (register: ProtocolRegistry['register'], transport: TaggedTypeResolver<Transports>['get'], snapshotApiKey?: string, boardroomAPIKey?: string, etherscanMainnetAPIKey?: string, etherscanOptimismAPIKey?: string) => void;
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
export declare const createRegistry: (frameworkConfig: FrameworkConfiguration) => ProtocolRegistry;
