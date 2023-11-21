import { Static } from '@sinclair/typebox';
import { ResponseValidator } from '../validation';
import { PaginationOptions } from '../pagination';
export declare type TransferEvent = Static<typeof TransferEvent>;
export declare const TransferEvent: import("@sinclair/typebox").TObject<{
    from: import("@sinclair/typebox").TString;
    to: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    txHash: import("@sinclair/typebox").TString;
}>;
/**
 * A paginated list of delegation events
 */
export declare type TransferEventPage = Static<typeof TransferEventPage>;
export declare const TransferEventPage: import("@sinclair/typebox").TObject<{
    items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        from: import("@sinclair/typebox").TString;
        to: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
        txHash: import("@sinclair/typebox").TString;
    }>>;
    nextCursor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export interface GeneralAdapter {
    getTransferEvents: (pagination?: PaginationOptions) => Promise<TransferEventPage>;
}
export declare const generalAdapterValidators: ResponseValidator<GeneralAdapter>;
