"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = require("./resolver");
describe('TaggedTypeResolver', () => {
    it('should set and get a basic thing', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        const thing = { name: 'name ' };
        resolver.set('Foo', thing);
        expect(resolver.get('Foo')).toEqual(thing);
    });
    it('should not allow setting the same tag twice', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        const task = () => resolver.set('Foo', { name: 'name ' });
        task(); // does not throw
        expect(task).toThrow(/already have entry/);
    });
    it('should throw if getting something that has not been set', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        const task = () => resolver.get('Foo');
        expect(task).toThrow(/no entry for/);
    });
    it('should return true when a tag exists', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        resolver.set('Foo', { name: 'name' });
        expect(resolver.has('Foo')).toEqual(true);
    });
    it('should return false when a tag does not exists', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        expect(resolver.has('Foo')).toEqual(false);
    });
    it('should be a compile-time error if providing an incorrect type', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        // @ts-expect-error compiler time error cuz second argument is not type Foo
        resolver.set('Foo', { age: 123 });
    });
    it('should allow setting different instance by label', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        resolver.set('Foo', { name: '1' }, 'instance1');
        resolver.set('Foo', { name: '2' }, 'instance2');
        expect(resolver.get('Foo', 'instance1')).toEqual({ name: '1' });
        expect(resolver.get('Foo', 'instance2')).toEqual({ name: '2' });
    });
    it('should return all instance names', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        resolver.set('Foo', { name: '1' }, 'instance1');
        resolver.set('Foo', { name: '2' }, 'instance2');
        expect(resolver.getInstances('Foo')).toEqual(expect.arrayContaining(['instance1', 'instance2']));
    });
    it('should return all tags and instances', () => {
        const resolver = new resolver_1.TaggedTypeResolver();
        resolver.set('Foo', { name: '1' }, 'instance1');
        resolver.set('Foo', { name: '2' }, 'instance2');
        resolver.set('Bar', { age: 3 });
        const tags = resolver.getTags();
        expect(tags).toEqual(expect.arrayContaining([
            { tag: 'Foo', instance: 'instance1' },
            { tag: 'Foo', instance: 'instance2' },
            { tag: 'Bar', instance: 'default' },
        ]));
    });
});
//# sourceMappingURL=resolver.spec.js.map