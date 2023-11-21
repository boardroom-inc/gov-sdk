import { ErrorObject } from 'ajv';
import { GovError } from './errors';
import { compileValidator } from './validation';
/**
 * Same as compileValidator, but will throw a MalformedAdapterResponse GovError
 * on validation errors
 */
export declare const compileAdapterValidator: typeof compileValidator;
/**
 * Given a MalformedAdapterResponse GovError, recover the specific validation
 * errors that happened with the payload
 */
export declare const recoverValidationErrors: (error: GovError<'MalformedAdapterResponse'>) => ErrorObject[];
