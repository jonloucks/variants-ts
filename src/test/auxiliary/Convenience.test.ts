import { ok } from "node:assert";

import {
  CONTRACTS,
  createEnvironment,
  createKeySource,
  createLookupSource,
  createMapSource,
  createProcessSource,
  createRecordSource,
  createVariant,
  VERSION,
  type ValueType
} from "@jonloucks/variants-ts/auxiliary/Convenience";

describe("Convenience Module", () => {
  describe("VERSION export", () => {
    it("should export VERSION as a string", () => {
      ok(typeof VERSION === "string");
    });

    it("VERSION should follow semantic versioning format", () => {
      const versionRegex = /^\d+\.\d+\.\d+$/;
      ok(versionRegex.test(VERSION));
    });
  });

  describe("CONTRACTS export", () => {
    it("should export CONTRACTS", () => {
      ok(CONTRACTS !== undefined);
      ok(CONTRACTS !== null);
    });

    it("CONTRACTS should have enforce method", () => {
      ok(typeof CONTRACTS.enforce === "function");
    });
  });

  describe("createVariant function", () => {
    it("should create a variant without config", () => {
      const variant = createVariant();
      ok(variant !== undefined);
      ok(variant !== null);
    });

    it("should create a variant with simple config", () => {
      const variant = createVariant<string>({
        name: 'test',
        description: 'A test variant'
      });
      ok(variant !== undefined);
      ok(variant.name === 'test');
      ok(variant.description === 'A test variant');
    });

    it("should create a variant with all config options", () => {
      const fallback = 'default';
      const variant = createVariant<string>({
        name: 'withFallback',
        description: 'Variant with fallback',
        fallback,
        link: { variants: [] }
      });
      ok(variant !== undefined);
      ok(variant.fallback === fallback);
    });

    it("should create multiple independent variants", () => {
      const variant1 = createVariant<number>({ name: 'first' });
      const variant2 = createVariant<string>({ name: 'second' });
      ok(variant1.name === 'first');
      ok(variant2.name === 'second');
    });
  });

  describe("createEnvironment function", () => {
    it("should create an environment without config", () => {
      const env = createEnvironment();
      ok(env !== undefined);
      ok(env !== null);
    });

    it("should create an environment with config", () => {
      const env = createEnvironment({
        sources: []
      });
      ok(env !== undefined);
    });

    it("should create an environment with multiple sources", () => {
      const source = createKeySource('key', 'value');
      const env = createEnvironment({
        sources: [source]
      });
      ok(env !== undefined);
    });
  });

  describe("createKeySource function", () => {
    it("should create a key source with string supplier", () => {
      const source = createKeySource('testKey', 'testValue');
      ok(source !== undefined);
      ok(source.getSourceValue('testKey') === 'testValue');
    });

    it("should create a key source with function supplier", () => {
      const supplier = (): string => 'supplied-value';
      const source = createKeySource('key', supplier);
      ok(source !== undefined);
      ok(source.getSourceValue('key') === 'supplied-value');
    });

    it("should create a key source with number supplier", () => {
      const source = createKeySource('numKey', 42);
      ok(source !== undefined);
      ok(source.getSourceValue('numKey') === 42);
    });

    it("should return undefined for non-matching keys", () => {
      const source = createKeySource('matchKey', 'value');
      ok(source.getSourceValue('noMatch') === undefined);
    });
  });

  describe("createLookupSource function", () => {
    it("should create a lookup source with simple function", () => {
      const lookup = (key: string): string => `value-${key}`;
      const source = createLookupSource(lookup);
      ok(source !== undefined);
      ok(source.getSourceValue('test') === 'value-test');
    });

    it("should create a lookup source with conditional logic", () => {
      const lookup = (key: string): string | number => {
        return key === 'number' ? 42 : 'string';
      };
      const source = createLookupSource(lookup);
      ok(source.getSourceValue('number') === 42);
      ok(source.getSourceValue('other') === 'string');
    });

    it("should handle lookup returning undefined", () => {
      const lookup = (): undefined => undefined;
      const source = createLookupSource(lookup);
      ok(source.getSourceValue('any') === undefined);
    });
  });

  describe("createMapSource function", () => {
    it("should create a map source from a Map", () => {
      const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
      const source = createMapSource(map);
      ok(source !== undefined);
      ok(source.getSourceValue('key1') === 'value1');
      ok(source.getSourceValue('key2') === 'value2');
    });

    it("should return undefined for missing keys", () => {
      const map = new Map([['existing', 'value']]);
      const source = createMapSource(map);
      ok(source.getSourceValue('missing') === undefined);
    });

    it("should work with empty map", () => {
      const map = new Map<string, string>();
      const source = createMapSource(map);
      ok(source !== undefined);
      ok(source.getSourceValue('any') === undefined);
    });

    it("should reflect map changes", () => {
      const map = new Map([['key', 'original']]);
      const source = createMapSource(map);
      ok(source.getSourceValue('key') === 'original');
      map.set('key', 'updated');
      ok(source.getSourceValue('key') === 'updated');
    });
  });

  describe("createRecordSource function", () => {
    it("should create a record source from a plain object", () => {
      const record = { key1: 'value1', key2: 'value2' };
      const source = createRecordSource(record);
      ok(source !== undefined);
      ok(source.getSourceValue('key1') === 'value1');
      ok(source.getSourceValue('key2') === 'value2');
    });

    it("should return undefined for missing keys", () => {
      const record = { existing: 'value' };
      const source = createRecordSource(record);
      ok(source.getSourceValue('missing') === undefined);
    });

    it("should work with empty record", () => {
      const record: Record<string, string> = {};
      const source = createRecordSource(record);
      ok(source !== undefined);
      ok(source.getSourceValue('any') === undefined);
    });

    it("should reflect record changes", () => {
      const record = { key: 'original' };
      const source = createRecordSource(record);
      ok(source.getSourceValue('key') === 'original');
      record.key = 'updated';
      ok(source.getSourceValue('key') === 'updated');
    });

    it("should work with various value types", () => {
      const record: Record<string, ValueType> = {
        string: 'text',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' }
      };
      const source = createRecordSource(record);
      ok(source.getSourceValue('string') === 'text');
      ok(source.getSourceValue('number') === 42);
      ok(source.getSourceValue('boolean') === true);
    });
  });

  describe("createProcessSource function", () => {
    it("should create a process environment source", () => {
      const source = createProcessSource();
      ok(source !== undefined);
      ok(source !== null);
    });

    it("should read existing environment variables", () => {
      process.env.TEST_CONVENIENCE_VAR = 'test-value';
      const source = createProcessSource();
      ok(source.getSourceValue('TEST_CONVENIENCE_VAR') === 'test-value');
      delete process.env.TEST_CONVENIENCE_VAR;
    });

    it("should return undefined for non-existent variables", () => {
      const source = createProcessSource();
      ok(source.getSourceValue('NONEXISTENT_VAR_98765') === undefined);
    });

    it("should handle environment variable modifications", () => {
      const source = createProcessSource();
      process.env.DYNAMIC_VAR = 'initial';
      ok(source.getSourceValue('DYNAMIC_VAR') === 'initial');
      process.env.DYNAMIC_VAR = 'updated';
      ok(source.getSourceValue('DYNAMIC_VAR') === 'updated');
      delete process.env.DYNAMIC_VAR;
    });
  });

  describe("Type exports", () => {
    it("should have type exports (verified by compilation)", () => {
      // This test verifies that types are properly exported
      // The actual verification happens at compile time via TypeScript
      ok(true);
    });
  });

  describe("Convenience integration", () => {
    it("should allow creating variants and environments together", () => {
      const variant = createVariant<string>({ name: 'appName' });
      const source = createKeySource('app', 'MyApp');
      const env = createEnvironment({ sources: [source] });

      ok(variant !== undefined);
      ok(source !== undefined);
      ok(env !== undefined);
    });

    it("should allow combining multiple source types", () => {
      const keySource = createKeySource('key', 'value1');
      const mapSource = createMapSource(new Map([['key', 'value2']]));
      const lookupSource = createLookupSource((key: string) => `lookup-${key}`);
      const recordSource = createRecordSource({ key: 'value3' });
      const processSource = createProcessSource();

      ok(keySource !== undefined);
      ok(mapSource !== undefined);
      ok(lookupSource !== undefined);
      ok(recordSource !== undefined);
      ok(processSource !== undefined);
    });

    it("should create environment with multiple different source types", () => {
      const sources = [
        createKeySource('key1', 'value1'),
        createMapSource(new Map([['key2', 'value2']])),
        createRecordSource({ key3: 'value3' })
      ];
      const env = createEnvironment({ sources });
      ok(env !== undefined);
    });
  });
});

