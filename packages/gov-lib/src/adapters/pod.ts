import { Type, Static } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId } from './common';

/**
 * Pod info
 */
export type PodInfo = Static<typeof PodInfo>;
export const PodInfo = Type.Object({
  address: Type.String(),
  ensName: Type.String(),
  adminAddress: Type.String(),
  membersList: Type.Array(Type.String()),
  imageUrl: Type.String(),
});

/**
 * An array of Pods
 */
export type PodList = Static<typeof PodList>;
export const PodList = Type.Object({
  podList: Type.Array(PodInfo),
});

/**
 * Adapter that will provide orca pod details
 */
export interface PodAdapter {
  /**
   * Get all pods
   */
  getPods: () => Promise<PodList>;
  getChainId: () => Promise<ChainId>;
}

export const podAdapterValidators: ResponseValidator<PodAdapter> = {
  getPods: compileAdapterValidator(PodList),
  getChainId: compileAdapterValidator(ChainId),
};
