import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { CONTRACTS } from "@jonloucks/contracts-ts";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Installer, createInstaller } from "@jonloucks/variants-ts";
import { CONTRACT as SOURCE_FACTORY_CONTRACT, SourceFactory, guard } from "@jonloucks/variants-ts/api/SourceFactory";
import { ok, strictEqual } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import { ValueType } from "@jonloucks/variants-ts/auxiliary/Convenience";
import { assertContract, assertGuard } from "./helper.test.js";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createKeySource',
  'createLookupSource',
  'createMapSource',
  'createRecordSource',
  'createProcessSource'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(SOURCE_FACTORY_CONTRACT, 'SourceFactory');

describe('SourceFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let installer: Installer;
  let closeInstaller: AutoClose;
  let factory: SourceFactory;

  beforeEach(() => {
    installer = createInstaller({ contracts: contracts });
    closeInstaller = installer.open();
    factory = contracts.enforce(SOURCE_FACTORY_CONTRACT);
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
      strictEqual(source.getSourceValue('myKey'), 'test-value');
    });

    it('should return undefined when key does not match', () => {
      const supplier = (): string => 'test-value';
      const source = factory.createKeySource('myKey', supplier);
      strictEqual(source.getSourceValue('differentKey'), undefined);
    });

    it('should handle supplier returning various types', () => {
      const source = factory.createKeySource('key', 42);
      strictEqual(source.getSourceValue('key'), 42);
    });

    it('should handle supplier returning null', () => {
      const source = factory.createKeySource('key', null as unknown as string);
      strictEqual(source.getSourceValue('key'), null);
    });

    it('should handle supplier returning undefined', () => {
      const source = factory.createKeySource('key', undefined);
      strictEqual(source.getSourceValue('key'), undefined);
    });

    it('should handle boolean suppliers', () => {
      const source = factory.createKeySource('flag', true);
      strictEqual(source.getSourceValue('flag'), true);
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
      strictEqual(source.getSourceValue('func'), 'result');
    });
  });

  describe('createLookupSource', () => {
    it('should call lookup function with provided key', () => {
      const lookup = (key: string): string => `value-${key}`;
      const source = factory.createLookupSource(lookup);
      strictEqual(source.getSourceValue('test'), 'value-test');
    });

    it('should handle lookup returning undefined', () => {
      const lookup = (key: string): undefined => { used(key); return undefined; };
      const source = factory.createLookupSource(lookup);
      strictEqual(source.getSourceValue('any'), undefined);
    });

    // it('should handle lookup returning null', () => {
    //   const lookup = (key: string): null => null;
    //   const source = factory.createLookupSource(lookup);
    //   strictEqual(source.getSourceValue('any'), null);
    // });

    it('should handle lookup with various return types', () => {
      const lookup = (key: string): string | number => {
        return key === 'string' ? 'value' : 42;
      };
      const source = factory.createLookupSource(lookup);
      strictEqual(source.getSourceValue('string'), 'value');
      strictEqual(source.getSourceValue('number'), 42);
    });

    it('should handle empty key', () => {
      const lookup = (key: string): string => `prefix-${key}`;
      const source = factory.createLookupSource(lookup);
      strictEqual(source.getSourceValue(''), 'prefix-');
    });

    it('should handle special characters in key', () => {
      const lookup = (key: string): string => key;
      const source = factory.createLookupSource(lookup);
      strictEqual(source.getSourceValue('key!@#$%'), 'key!@#$%');
    });
  });

  describe('createMapSource', () => {
    it('should return value when key exists', () => {
      const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('key1'), 'value1');
      strictEqual(source.getSourceValue('key2'), 'value2');
    });

    it('should return undefined when key does not exist', () => {
      const map = new Map([['key1', 'value1']]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('nonexistent'), undefined);
    });

    it('should handle empty map', () => {
      const map = new Map<string, string>();
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('any'), undefined);
    });

    it('should handle map with null values', () => {
      const map = new Map([['key', null as unknown as string]]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('key'), null);
    });

    it('should handle map with undefined values', () => {
      const map = new Map([['key', undefined]]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('key'), undefined);
    });

    it('should handle map with various value types', () => {
      const map = new Map<string, ValueType>([
        ['string', 'text'],
        ['number', 42],
        ['boolean', true]
        // ['array', [1, 2, 3]],
        // ['object', { name: 'test' }]
      ]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('string'), 'text');
      strictEqual(source.getSourceValue('number'), 42);
      strictEqual(source.getSourceValue('boolean'), true);
      // expect(source.getSourceValue('array')).toEqual([1, 2, 3]);
      // expect(source.getSourceValue('object')).toEqual({ name: 'test' });
    });

    it('should handle map modifications', () => {
      const map = new Map([['key', 'value1']]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue('key'), 'value1');
      map.set('key', 'value2');
      strictEqual(source.getSourceValue('key'), 'value2');
    });

    it('should handle empty string key', () => {
      const map = new Map([['', 'emptyKeyValue']]);
      const source = factory.createMapSource(map);
      strictEqual(source.getSourceValue(''), 'emptyKeyValue');
    });
  });

  describe('createRecordSource', () => {
    it('should return value when key exists', () => {
      const record = { key1: 'value1', key2: 'value2' };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('key1'), 'value1');
      strictEqual(source.getSourceValue('key2'), 'value2');
    });

    it('should return undefined when key does not exist', () => {
      const record = { key1: 'value1' };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('nonexistent'), undefined);
    });

    it('should handle empty record', () => {
      const record: Record<string, string> = {};
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('any'), undefined);
    });

    it('should handle record with null values', () => {
      const record = { key: null as unknown as string };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('key'), null);
    });

    it('should handle record with undefined values', () => {
      const record = { key: undefined };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('key'), undefined);
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
      strictEqual(source.getSourceValue('string'), 'text');
      strictEqual(source.getSourceValue('number'), 42);
      strictEqual(source.getSourceValue('boolean'), true);
      // expect(source.getSourceValue('array')).toEqual([1, 2, 3]);
      // expect(source.getSourceValue('object')).toEqual({ name: 'test' });
    });

    it('should handle record mutations', () => {
      const record = { key: 'value1' };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('key'), 'value1');
      record.key = 'value2';
      strictEqual(source.getSourceValue('key'), 'value2');
    });

    it('should handle numeric string keys', () => {
      const record = { '123': 'numeric-string-key' };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('123'), 'numeric-string-key');
    });

    it('should handle special character keys', () => {
      const record = { 'key!@#$%': 'special' };
      const source = factory.createRecordSource(record);
      strictEqual(source.getSourceValue('key!@#$%'), 'special');
    });
  });

  describe('createProcessSource', () => {
    it('should return environment variable when set', () => {
      process.env.TEST_VAR = 'test-value';
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('TEST_VAR'), 'test-value');
      delete process.env.TEST_VAR;
    });

    it('should return undefined when environment variable not set', () => {
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('NONEXISTENT_VAR_12345'), undefined);
    });

    it('should handle empty string env var name', () => {
      const source = factory.createProcessSource();
      const result = source.getSourceValue('');
      strictEqual(result, undefined);
    });

    it('should handle environment variables with special characters', () => {
      process.env.VAR_WITH_UNDERSCORE = 'value1';
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('VAR_WITH_UNDERSCORE'), 'value1');
      delete process.env.VAR_WITH_UNDERSCORE;
    });

    it('should read actual process environment', () => {
      const source = factory.createProcessSource();
      const nodeEnv = source.getSourceValue('NODE_ENV');
      ok(['development', 'test', 'production', null, undefined].includes(nodeEnv as string | null | undefined));
    });

    it('should handle case-sensitive key lookup', () => {
      process.env.CASE_TEST = 'uppercase';
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('CASE_TEST'), 'uppercase');
      strictEqual(source.getSourceValue('case_test'), undefined);
      delete process.env.CASE_TEST;
    });

    it('should return empty string for env var with empty value', () => {
      process.env.EMPTY_VAR = '';
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('EMPTY_VAR'), '');
      delete process.env.EMPTY_VAR;
    });

    it('should handle environment variables with numeric values', () => {
      process.env.PORT = '3000';
      const source = factory.createProcessSource();
      strictEqual(source.getSourceValue('PORT'), '3000');
      delete process.env.PORT;
    });
  });
});

