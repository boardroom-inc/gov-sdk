import { Static } from '@sinclair/typebox';
import { ResponseValidator } from '../validation';
/**
 * External icon
 */
export declare type Icon = Static<typeof Icon>;
export declare const Icon: import("@sinclair/typebox").TObject<{
    size: import("@sinclair/typebox").TString;
    url: import("@sinclair/typebox").TString;
}>;
/**
 * List of icons
 */
export declare type IconInfo = Static<typeof IconInfo>;
export declare const IconInfo: import("@sinclair/typebox").TObject<{
    icons: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        size: import("@sinclair/typebox").TString;
        url: import("@sinclair/typebox").TString;
    }>>;
}>;
/**
 * Adapter that will provide a list of icons for a protocol
 */
export interface IconAdapter {
    /**
     * Get a list of protocol infos
     */
    getIcons: () => Promise<IconInfo>;
}
export declare const iconAdapterValidators: ResponseValidator<IconAdapter>;
