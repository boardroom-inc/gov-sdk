import { Static } from '@sinclair/typebox';
import { ErrorObject, Schema } from 'ajv';
/**
 * A factory that will produce an error to be thrown as a function of the AJV
 * errors that were produced
 */
export declare type ValidationErrorFactory = (errors: ErrorObject[]) => unknown;
declare type Validator<T> = (payload: unknown) => Static<any>;
/**
 * Given a JSON schema, create a function that will throw if the provided data
 * does not match the spec
 */
export declare const compileValidator: <T>(schema: Schema, errorFactory?: ValidationErrorFactory) => Validator<T>;
/**
 * A response validator for T is an object with keys for all methods in T
 * (which must be promise-returning functions), where the value for each key is
 * a synchronous function that can validate the return payload of the original
 * function in T
 */
export declare type ResponseValidator<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Promise<infer U> ? (payload: unknown) => U : never;
};
/**
 * A mapped type where every key of T has a corresponding response validator
 */
export declare type Validators<T> = {
    [K in keyof T]: ResponseValidator<T[K]>;
};
/**
 * Will **modifiy** instance to patch it such that the response is validated
 * via the provided validators
 *
 * **NOTE**: The patched functions will be hard-bound to their original context
 * and thus can be called "bare"
 */
export declare const decorateWithValidators: <T>(instance: T, validators: ResponseValidator<T>) => T;
export {};
