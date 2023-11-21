import { Static } from '@sinclair/typebox';
import { ResponseValidator } from '../validation';
import { ChainId } from './common';
/**
 * Pod info
 */
export declare type PodInfo = Static<typeof PodInfo>;
export declare const PodInfo: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    ensName: import("@sinclair/typebox").TString;
    adminAddress: import("@sinclair/typebox").TString;
    membersList: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    imageUrl: import("@sinclair/typebox").TString;
}>;
/**
 * An array of Pods
 */
export declare type PodList = Static<typeof PodList>;
export declare const PodList: import("@sinclair/typebox").TObject<{
    podList: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        address: import("@sinclair/typebox").TString;
        ensName: import("@sinclair/typebox").TString;
        adminAddress: import("@sinclair/typebox").TString;
        membersList: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        imageUrl: import("@sinclair/typebox").TString;
    }>>;
}>;
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
export declare const podAdapterValidators: ResponseValidator<PodAdapter>;
