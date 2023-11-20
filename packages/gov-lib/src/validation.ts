import { Static, TSchema } from '@sinclair/typebox';
import Ajv, { ErrorObject, Schema } from 'ajv';

// ajv instance is stateful, caching the compiled schema validator functions
// keyed by the schemas themselves, so instantiating in the global context
// allows us to benefit from the memoization
const ajv = new Ajv()
  // accomodations for typebox, see:
  //   https://github.com/sinclairzx81/typebox#validation
  .addKeyword('kind')
  .addKeyword('modifier');

/**
 * A factory that will produce an error to be thrown as a function of the AJV
 * errors that were produced
 */
export type ValidationErrorFactory = (errors: ErrorObject[]) => unknown;

const defaultErrorFactory: ValidationErrorFactory = () => new Error();

type Validator<T> = (payload: unknown) => Static<any>;

/**
 * Given a JSON schema, create a function that will throw if the provided data
 * does not match the spec
 */

export const compileValidator = <T>(schema: Schema, errorFactory = defaultErrorFactory): Validator<T> => {
  const compiled = ajv.compile(schema);
  return (payload: any) => {
    if (compiled(payload)) {
      return payload as Static<TSchema>;
    }
    throw errorFactory(compiled.errors ?? []);
  };
};

/**
 * A response validator for T is an object with keys for all methods in T
 * (which must be promise-returning functions), where the value for each key is
 * a synchronous function that can validate the return payload of the original
 * function in T
 */
export type ResponseValidator<T> = {
  // disabling no-any because we do not care about the arg types for the function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<infer U> ? (payload: unknown) => U : never;
};

/**
 * A mapped type where every key of T has a corresponding response validator
 */
export type Validators<T> = {
  [K in keyof T]: ResponseValidator<T[K]>;
};

/**
 * Will **modifiy** instance to patch it such that the response is validated
 * via the provided validators
 *
 * **NOTE**: The patched functions will be hard-bound to their original context
 * and thus can be called "bare"
 */
export const decorateWithValidators = <T>(instance: T, validators: ResponseValidator<T>): T => {
  // hella any-s for this block, I think it'd be difficult to try and type it
  // but maybe there is a way. The main thing is that the instance and validator
  // params we know "line up" correctly to make the below code work based on
  // their types, so we're just bypassing the compiler for this monkey-patching
  // and decorating logic
  for (const key in validators) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (instance[key] as any).bind(instance);
    instance[key] = (async (...args: unknown[]) => {
      const resp = await fn(...args);
      validators[key](resp); // throws if invalid response
      return resp;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  }

  return instance;
};
