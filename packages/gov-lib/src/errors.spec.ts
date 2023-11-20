import { GovError, isGovError } from './errors';

describe('isSDKError', () => {
  it('should return true for SDK errors', () => {
    expect(isGovError(new GovError('Unknown'))).toEqual(true);
  });
  it('should return false for non SDK errors', () => {
    expect(isGovError(new Error())).toEqual(false);
  });
});
