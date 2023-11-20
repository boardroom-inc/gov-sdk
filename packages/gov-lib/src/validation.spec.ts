import { Type } from '@sinclair/typebox';
import { compileValidator, decorateWithValidators, ResponseValidator } from './validation';

describe('compileValidator', () => {
  it('should create a validator function', () => {
    const schema = Type.Object({ name: Type.String() });
    const validator = compileValidator(schema);
    validator({ name: 'name' }); // doesnt throw
    const task = () => validator({ name: 1 });
    expect(task).toThrow();
  });
});

describe('decorateWithValidators', () => {
  interface Foo {
    inc: (value: number) => Promise<{ value: number }>;
  }
  const validators: ResponseValidator<Foo> = {
    inc: compileValidator(Type.Object({ value: Type.Number() })),
  };
  it('should proxy the original function', async () => {
    const instance: Foo = {
      inc: async (val) => {
        return { value: val + 1 };
      },
    };
    const decorated = decorateWithValidators(instance, validators);
    await expect(decorated.inc(5)).resolves.toEqual({ value: 6 });
  });
  it('should throw if returning a malformed response', async () => {
    const instance: Foo = {
      // @ts-expect-error returning an incorrect type
      inc: async () => {
        return { value: 'bad' };
      },
    };
    const decorated = decorateWithValidators(instance, validators);
    await expect(decorated.inc(5)).rejects.toThrow();
  });
});
