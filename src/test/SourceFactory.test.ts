import { CONTRACTS } from "@jonloucks/contracts-ts";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Installer, createInstaller } from "@jonloucks/variants-ts";
import { CONTRACT, SourceFactory, guard } from "@jonloucks/variants-ts/api/SourceFactory";
import { ok } from "node:assert";
import { assertContract, assertGuard } from "./helper.test";
import { ValueType } from "../auxiliary/Convenience";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createKeySource',
  'createMapSource',
  'createRecordSource',
  'createProcessSource',
  'createLookupSource',
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(CONTRACT, 'SourceFactory');

describe('SourceFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let installer: Installer;
  let closeInstaller: AutoClose;
  let factory: SourceFactory;

  beforeEach(() => {
    installer = createInstaller({ contracts: CONTRACTS});
    closeInstaller = installer.open();
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeInstaller.close();
  });

  it('isSourceFactory should return true for SourceFactory', () => {
    ok(guard(factory), 'SourceFactory should return true');
  });

  describe('createKeySource', () => {
    it('should return value when key matches', () => {
      const supplier = (): string => 'test-value';
      const source = factory.createKeySource('myKey', supplier);
      expect(source.getSourceValue('myKey')).toBe('test-value');
    });

    it('should return undefined when key does not match', () => {
      const supplier = (): string => 'test-value';
      const source = factory.createKeySource('myKey', supplier);
      expect(source.getSourceValue('differentKey')).toBeUndefined();
    });

    it('should handle supplier returning various types', () => {
      const source = factory.createKeySource('key', 42);
      expect(source.getSourceValue('key')).toBe(42);
    });

    it('should handle supplier returning null', () => {
      const source = factory.createKeySource('key', null as unknown as string);
      expect(source.getSourceValue('key')).toBeNull();
    });

    it('should handle supplier returning undefined', () => {
      const source = factory.createKeySource('key', undefined);
      expect(source.getSourceValue('key')).toBeUndefined();
    });

    it('should handle boolean suppliers', () => {
      const source = factory.createKeySource('flag', true);
      expect(source.getSourceValue('flag')).toBe(true);
    });

    // it('should handle array suppliers', () => {
    //   const arr = [1, 2, 3];
    //   const source = factory.createKeySource('array', arr);
    //   expect(source.getSourceValue('array')).toEqual(arr);
    // });

    // it('should handle object suppliers', () => {
    //   const obj = { name: 'test' };
    //   const source = factory.createKeySource('obj', obj);
    //   expect(source.getSourceValue('obj')).toEqual(obj);
    // });

    it('should handle function suppliers by calling them', () => {
      const fn = (): string => 'result';
      const source = factory.createKeySource('func', fn);
      expect(source.getSourceValue('func')).toBe('result');
    });
  });

  describe('createLookupSource', () => {
    it('should call lookup function with provided key', () => {
      const lookup = (key: string): string => `value-${key}`;
      const source = factory.createLookupSource(lookup);
      expect(source.getSourceValue('test')).toBe('value-test');
    });

    it('should handle lookup returning undefined', () => {
      const lookup = (key: string): undefined => undefined;
      const source = factory.createLookupSource(lookup);
      expect(source.getSourceValue('any')).toBeUndefined();
    });

    // it('should handle lookup returning null', () => {
    //   const lookup = (key: string): null => null;
    //   const source = factory.createLookupSource(lookup);
    //   expect(source.getSourceValue('any')).toBeNull();
    // });

    it('should handle lookup with various return types', () => {
      const lookup = (key: string): string | number => {
        return key === 'string' ? 'value' : 42;
      };
      const source = factory.createLookupSource(lookup);
      expect(source.getSourceValue('string')).toBe('value');
      expect(source.getSourceValue('number')).toBe(42);
    });

    it('should handle empty key', () => {
      const lookup = (key: string): string => `prefix-${key}`;
      const source = factory.createLookupSource(lookup);
      expect(source.getSourceValue('')).toBe('prefix-');
    });

    it('should handle special characters in key', () => {
      const lookup = (key: string): string => key;
      const source = factory.createLookupSource(lookup);
      expect(source.getSourceValue('key!@#$%')).toBe('key!@#$%');
    });
  });

  describe('createMapSource', () => {
    it('should return value when key exists', () => {
      const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('key1')).toBe('value1');
      expect(source.getSourceValue('key2')).toBe('value2');
    });

    it('should return undefined when key does not exist', () => {
      const map = new Map([['key1', 'value1']]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('nonexistent')).toBeUndefined();
    });

    it('should handle empty map', () => {
      const map = new Map<string, string>();
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('any')).toBeUndefined();
    });

    it('should handle map with null values', () => {
      const map = new Map([['key', null as unknown as string]]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('key')).toBeNull();
    });

    it('should handle map with undefined values', () => {
      const map = new Map([['key', undefined]]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('key')).toBeUndefined();
    });

    it('should handle map with various value types', () => {
      const map = new Map<string,ValueType>([
        ['string', 'text'],
        ['number', 42],
        ['boolean', true]
        // ['array', [1, 2, 3]],
        // ['object', { name: 'test' }]
      ]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('string')).toBe('text');
      expect(source.getSourceValue('number')).toBe(42);
      expect(source.getSourceValue('boolean')).toBe(true);
      // expect(source.getSourceValue('array')).toEqual([1, 2, 3]);
      // expect(source.getSourceValue('object')).toEqual({ name: 'test' });
    });

    it('should handle map modifications', () => {
      const map = new Map([['key', 'value1']]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('key')).toBe('value1');
      map.set('key', 'value2');
      expect(source.getSourceValue('key')).toBe('value2');
    });

    it('should handle empty string key', () => {
      const map = new Map([['', 'emptyKeyValue']]);
      const source = factory.createMapSource(map);
      expect(source.getSourceValue('')).toBe('emptyKeyValue');
    });
  });

  describe('createRecordSource', () => {
    it('should return value when key exists', () => {
      const record = { key1: 'value1', key2: 'value2' };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('key1')).toBe('value1');
      expect(source.getSourceValue('key2')).toBe('value2');
    });

    it('should return undefined when key does not exist', () => {
      const record = { key1: 'value1' };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('nonexistent')).toBeUndefined();
    });

    it('should handle empty record', () => {
      const record: Record<string, string> = {};
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('any')).toBeUndefined();
    });

    it('should handle record with null values', () => {
      const record = { key: null as unknown as string };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('key')).toBeNull();
    });

    it('should handle record with undefined values', () => {
      const record = { key: undefined };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('key')).toBeUndefined();
    });

    it('should handle record with various value types', () => {
      const record = {
        string: 'text',
        number: 42,
        boolean: true,
        // array: [1, 2, 3],
        // object: { name: 'test' }
      };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('string')).toBe('text');
      expect(source.getSourceValue('number')).toBe(42);
      expect(source.getSourceValue('boolean')).toBe(true);
      // expect(source.getSourceValue('array')).toEqual([1, 2, 3]);
      // expect(source.getSourceValue('object')).toEqual({ name: 'test' });
    });

    it('should handle record mutations', () => {
      const record = { key: 'value1' };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('key')).toBe('value1');
      record.key = 'value2';
      expect(source.getSourceValue('key')).toBe('value2');
    });

    it('should handle numeric string keys', () => {
      const record = { '123': 'numeric-string-key' };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('123')).toBe('numeric-string-key');
    });

    it('should handle special character keys', () => {
      const record = { 'key!@#$%': 'special' };
      const source = factory.createRecordSource(record);
      expect(source.getSourceValue('key!@#$%')).toBe('special');
    });
  });

  describe('createProcessSource', () => {
    it('should return environment variable when set', () => {
      process.env.TEST_VAR = 'test-value';
      const source = factory.createProcessSource();
      expect(source.getSourceValue('TEST_VAR')).toBe('test-value');
      delete process.env.TEST_VAR;
    });

    it('should return undefined when environment variable not set', () => {
      const source = factory.createProcessSource();
      expect(source.getSourceValue('NONEXISTENT_VAR_12345')).toBeUndefined();
    });

    it('should handle empty string env var name', () => {
      const source = factory.createProcessSource();
      const result = source.getSourceValue('');
      expect(result).toBeUndefined();
    });

    it('should handle environment variables with special characters', () => {
      process.env.VAR_WITH_UNDERSCORE = 'value1';
      const source = factory.createProcessSource();
      expect(source.getSourceValue('VAR_WITH_UNDERSCORE')).toBe('value1');
      delete process.env.VAR_WITH_UNDERSCORE;
    });

    it('should read actual process environment', () => {
      const source = factory.createProcessSource();
      const nodeEnv = source.getSourceValue('NODE_ENV');
      expect(['development', 'test', 'production', undefined]).toContain(nodeEnv);
    });

    it('should handle case-sensitive key lookup', () => {
      process.env.CASE_TEST = 'uppercase';
      const source = factory.createProcessSource();
      expect(source.getSourceValue('CASE_TEST')).toBe('uppercase');
      expect(source.getSourceValue('case_test')).toBeUndefined();
      delete process.env.CASE_TEST;
    });

    it('should return empty string for env var with empty value', () => {
      process.env.EMPTY_VAR = '';
      const source = factory.createProcessSource();
      expect(source.getSourceValue('EMPTY_VAR')).toBe('');
      delete process.env.EMPTY_VAR;
    });

    it('should handle environment variables with numeric values', () => {
      process.env.PORT = '3000';
      const source = factory.createProcessSource();
      expect(source.getSourceValue('PORT')).toBe('3000');
      delete process.env.PORT;
    });
  });
});

