import { Type } from '@sinclair/typebox';
import { compileAdapterValidator, recoverValidationErrors } from './adapter-validator';
import { isGovError } from './errors';

describe('compileAdapterValidator', () => {
  it('should compile a validator that throws a MalformedAdapterResponse GovError', () => {
    const schema = Type.Object({ name: Type.String() });
    const validator = compileAdapterValidator(schema);
    const task = () => validator({ name: 1 });
    expect(task).toThrow(/MalformedAdapterResponse/);
  });
});

describe('recoverValidationErrors', () => {
  it('should extract validation errors', () => {
    const schema = Type.Object({ name: Type.String() });
    const validator = compileAdapterValidator(schema);
    try {
      validator({ name: 1 });
    } catch (err) {
      if (isGovError(err, 'MalformedAdapterResponse')) {
        const errors = recoverValidationErrors(err);
        expect(errors).toEqual([expect.objectContaining({ message: 'must be string' })]);
      }
    }
  });
});
