import { CustomError } from 'ts-custom-error';

/**
 * All valid error codes that can be thrown throught the gov framework
 */
export const errorCodes = {
  Unknown: {
    message: 'Unknown error',
  },
  MalformedAdapterResponse: {
    message: 'The protocol adapter returned a malformed response',
  },
};

export type ErrorCode = keyof typeof errorCodes;

/**
 * Thrown anytime there is an error within the gov framework
 */
export class GovError<K extends ErrorCode = 'Unknown'> extends CustomError {
  public readonly isGovError = true;

  /**
   * Specific error code
   */
  public readonly code: K;

  /**
   * Arbitrary data
   */
  public readonly data: Record<string, unknown>;

  constructor(code: K, data = {}) {
    super(`${code}: ${errorCodes[code].message}`);
    this.data = data;
    this.code = code;
  }
}

/**
 * User defined type guard to narrow out a trait error
 */
export const isGovError = <K extends ErrorCode = ErrorCode>(err: unknown, code?: K): err is GovError<K> => {
  const govError = err as GovError;

  if (!govError?.isGovError) {
    return false;
  }

  // if no specific code provide, we're good
  if (code === undefined) {
    return true;
  }

  // else code must match
  return govError.code === code;
};
