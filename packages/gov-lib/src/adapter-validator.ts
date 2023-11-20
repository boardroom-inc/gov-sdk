import { ErrorObject } from 'ajv';
import { GovError } from './errors';
import { compileValidator } from './validation';

/**
 * Same as compileValidator, but will throw a MalformedAdapterResponse GovError
 * on validation errors
 */
export const compileAdapterValidator: typeof compileValidator = (schema) =>
  compileValidator(schema, (errors) => new GovError('MalformedAdapterResponse', { errors }));

/**
 * Given a MalformedAdapterResponse GovError, recover the specific validation
 * errors that happened with the payload
 */
export const recoverValidationErrors = (error: GovError<'MalformedAdapterResponse'>): ErrorObject[] => {
  const { data } = error;
  return data.errors as ErrorObject[];
};
