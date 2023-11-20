import { Static, Type } from '@sinclair/typebox';
import { PaginationOptions } from '../pagination';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ContractInterface } from 'ethers';
import { ChainId, Framework, Time, FunctionsSelectors, Address } from './common';

/**
 * Request ID used to check the status of a delegate voting power transaction
 */
export type DelegateVotingPowerRequestId = string;
export const DelegateVotingPowerRequestId = Type.String();

/**
 * Various event types
 */
export type EventType = Static<typeof EventType>;
export const EventType = Type.Union([
  Type.Literal('DELEGATED'),
  Type.Literal('UNDELEGATED'),
  Type.Literal('MOVED'),
  Type.Literal('VOTING_POWER'),
  Type.Literal('PROPOSITION_POWER'),
  Type.Literal('NONE'),
]);

/**
 * A delegation can have zero or more "events" occur at a specific time
 */
export type DelegationEvent = Static<typeof DelegationEvent>;
export const DelegationEvent = Type.Object({
  delegator: Type.String(),
  fromDelegate: Type.String(),
  toDelegate: Type.String(),
  amount: Type.String(),
  aaveDelegationType: Type.String(),
  snapshotId: Type.String(),
  eventType: EventType,
  time: Time,
  txHash: Type.String(),
});

/**
 * A paginated list of delegation events
 */
export type DelegationEventPage = Static<typeof DelegationEventPage>;
export const DelegationEventPage = Type.Object({
  items: Type.Array(DelegationEvent),
  nextCursor: Type.Optional(Type.String()),
});

/**
 * Delegation info for multiple addresses
 */
export type DelegationsInfo = Static<typeof DelegationsInfo>;
export const DelegationsInfo = Type.Object({
  address: Type.String(),
  addressDelegatedTo: Type.String(),
});

/**
 * Address of who an address is delegating to
 */
export type DelegateAddress = string;
export const DelegateAddress = Type.String();

/**
 * Address of the token used to delegate
 */
export type TokenAddress = string;
export const TokenAddress = Type.String();

export type DelegationsGetter = (
  addresses: string[],
  vaultAbi: ContractInterface,
  vaultAddress: string,
  rpc: any
) => Promise<DelegationsInfo[]>;

/**
 * Expose a method to delegate voting power to an address
 */
export interface DelegationAdapter {
  getFramework: () => Promise<Framework>;
  delegateVotingPower: (address: string, identifier?: string, amount?: number) => Promise<DelegateVotingPowerRequestId>;
  getDelegationEvents: (pagination?: PaginationOptions) => Promise<DelegationEventPage>;
  getDelegation: (address: string) => Promise<DelegateAddress>;
  getDelegations: (addresses: string[]) => Promise<DelegationsInfo[]>;
  getChainId: () => Promise<ChainId>;
  getTokenAddress: () => Promise<TokenAddress>;
  getDelegationFunctionsSelectors: () => Promise<FunctionsSelectors>;
  getDelegationContractAddress: () => Promise<Address>;
}

export const delegationAdapterValidators: ResponseValidator<DelegationAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  delegateVotingPower: compileAdapterValidator(DelegateVotingPowerRequestId),
  getDelegationEvents: compileAdapterValidator(DelegationEventPage),
  getDelegation: compileAdapterValidator(DelegateAddress),
  getDelegations: compileAdapterValidator(Type.Array(DelegationsInfo)),
  getChainId: compileAdapterValidator(ChainId),
  getTokenAddress: compileAdapterValidator(TokenAddress),
  getDelegationFunctionsSelectors: compileAdapterValidator(FunctionsSelectors),
  getDelegationContractAddress: compileAdapterValidator(Address),
};
