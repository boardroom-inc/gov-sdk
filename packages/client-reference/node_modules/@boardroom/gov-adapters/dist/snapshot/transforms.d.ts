import { DelegationEvent } from '@boardroom/gov-lib';
import { LogResult } from '../rpc';
import { DelegateChangeEvents } from './contract';
/**
 * Convert a compound delegation event into our interop model
 */
export declare const mapDelegationEvents: (log: LogResult<DelegateChangeEvents>) => DelegationEvent;
