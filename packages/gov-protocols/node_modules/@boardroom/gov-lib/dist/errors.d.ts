import { CustomError } from 'ts-custom-error';
/**
 * All valid error codes that can be thrown throught the gov framework
 */
export declare const errorCodes: {
    Unknown: {
        message: string;
    };
    MalformedAdapterResponse: {
        message: string;
    };
};
export declare type ErrorCode = keyof typeof errorCodes;
/**
 * Thrown anytime there is an error within the gov framework
 */
export declare class GovError<K extends ErrorCode = 'Unknown'> extends CustomError {
    readonly isGovError = true;
    /**
     * Specific error code
     */
    readonly code: K;
    /**
     * Arbitrary data
     */
    readonly data: Record<string, unknown>;
    constructor(code: K, data?: {});
}
/**
 * User defined type guard to narrow out a trait error
 */
export declare const isGovError: <K extends "Unknown" | "MalformedAdapterResponse" = "Unknown" | "MalformedAdapterResponse">(err: unknown, code?: K | undefined) => err is GovError<K>;
