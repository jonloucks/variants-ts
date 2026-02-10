import { AutoClose, CONTRACTS, Contracts, isPresent, RequiredType } from "@jonloucks/contracts-ts";
import { Environment, guard } from "@jonloucks/variants-ts/api/Environment";
import { CONTRACT, EnvironmentFactory } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { Variant } from "@jonloucks/variants-ts/api/Variant";
import { VariantException } from "@jonloucks/variants-ts/api/VariantException";
import { assertGuard, mockDuck } from "@jonloucks/variants-ts/test/helper.test";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

// temporary until we have a better way to manage test dependencies
import { ValueType } from "../api/Types";
import { used } from "../auxiliary/Checks";
import { create as createFactory } from "../impl/EnvironmentFactory.impl";
import { create as createVariant } from "../impl/Variant.impl";

const FUNCTION_NAMES: (string | symbol)[] = [
  'getVariance', 'findVariance'
];

assertGuard(guard, ...FUNCTION_NAMES);

describe('Environment Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let factory: EnvironmentFactory;
  let closeBind: AutoClose;

  const createMockSource = (data: Record<string, string>): Source => {
    return {
      getSourceValue: (key: string) => data[key]
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type EnvironmentConfig = any;

  beforeEach(() => {
    closeBind = contracts.bind(CONTRACT, createFactory);
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeBind.close();
  });

  function createEnvironment(config?: EnvironmentConfig): Environment {
    return factory.createEnvironment(config);
  }

  it('isEnvironment should return true for Environment', () => {
    const environment: Environment = mockDuck<Environment>(...FUNCTION_NAMES);
    ok(guard(environment), 'Environment should return true');
  });

  it('createEnvironment with empty config should create an Environment', () => {
    const environment: Environment = factory.createEnvironment();
    ok(environment, 'createEnvironment with config should create an Environment');
  });

  describe('create function', () => {

    it('should create an Environment with no config', () => {
      const env: Environment = createEnvironment();
      ok(isPresent(env), 'Environment should be created');
    });

    it('should create an Environment with undefined sources', () => {
      const env: Environment = createEnvironment({ sources: [] });
      ok(isPresent(env), 'Environment should be created with empty sources');
    });

    it('should create an Environment with sources', () => {
      const source1: Source = createMockSource({ key1: 'value1' });
      const source2: Source = createMockSource({ key2: 'value2' });
      const env: Environment = createEnvironment({
        sources: [source1, source2]
      });
      ok(isPresent(env), 'Environment should be created with sources');
    });
  });

  describe('findVariance method', () => {

    describe('with single source', () => {

      it('should find variance in single source', () => {
        const source: Source = createMockSource({ APP_NAME: 'MyApp' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<string> = createVariant({
          keys: ['APP_NAME'],
          name: 'appName'
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'MyApp', 'should find value in source');
      });

      it('should return undefined when key not found', () => {
        const source: Source = createMockSource({ OTHER_KEY: 'value' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<string> = createVariant({
          keys: ['APP_NAME'],
          name: 'appName'
        });

        const result = env.findVariance(variant);
        strictEqual(result, undefined, 'should return undefined');
      });

      it('should use first matching key when multiple keys provided', () => {
        const source: Source = createMockSource({
          PRIMARY_KEY: 'primary',
          SECONDARY_KEY: 'secondary'
        });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<string> = createVariant({
          keys: ['PRIMARY_KEY', 'SECONDARY_KEY']
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'primary', 'should use first matching key');
      });

      it('should use fallback when key not found in source', () => {
        const source: Source = createMockSource({});
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<string> = createVariant({
          keys: ['APP_NAME'],
          fallback: 'DefaultApp'
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'DefaultApp', 'should return fallback value');
      });

      it('should parse text using variant parser', () => {
        const source: Source = createMockSource({ PORT: '8080' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<number> = createVariant({
          keys: ['PORT'],
          parser: {
            transform: (input: string) => parseInt(input, 10)
          }
        });

        const result = env.findVariance(variant);
        strictEqual(result, 8080, 'should parse number from string');
      });

      it('should return NaN if parser returns NaN', () => {
        const source: Source = createMockSource({ INVALID: 'not-a-number' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<number> = createVariant<number>({
          keys: ['INVALID'],
          parser: {
            transform: (input: string): RequiredType<number> => {
              return parseInt(input, 10);
            }
          }
        });

        const result = env.findVariance(variant);
        strictEqual(result, NaN, 'should return NaN if parser fails');
      });
    });

    describe('with multiple sources (breadth first search)', () => {

      it('should find variance in first source when available', () => {
        const source1: Source = createMockSource({ KEY: 'source1' });
        const source2: Source = createMockSource({ KEY: 'source2' });
        const env: Environment = createEnvironment({
          sources: [source1, source2]
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY']
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'source1', 'should use first source');
      });

      it('should fall back to second source when first source lacks key', () => {
        const source1: Source = createMockSource({ OTHER: 'value' });
        const source2: Source = createMockSource({ KEY: 'source2' });
        const env: Environment = createEnvironment({
          sources: [source1, source2]
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY']
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'source2', 'should fall back to second source');
      });

      it('should search all sources in order', () => {
        const source1: Source = createMockSource({});
        const source2: Source = createMockSource({});
        const source3: Source = createMockSource({ KEY: 'source3' });
        const env: Environment = createEnvironment({
          sources: [source1, source2, source3]
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY']
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'source3', 'should find in third source');
      });

      it('should return fallback if no source has value', () => {
        const source1: Source = createMockSource({});
        const source2: Source = createMockSource({});
        const env: Environment = createEnvironment({
          sources: [source1, source2]
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY'],
          fallback: 'DefaultValue'
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'DefaultValue', 'should return fallback');
      });
    });

    describe('with linked variants', () => {

      it('should find variance using linked variant fallback', () => {
        const source: Source = createMockSource({});
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const linkedVariant: Variant<string> = createVariant({
          fallback: 'LinkedDefault'
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY'],
          link: linkedVariant
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'LinkedDefault', 'should use linked variant fallback');
      });

      it('should find variance in source using linked variant keys', () => {
        const source: Source = createMockSource({ LINKED_KEY: 'linked_value' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const linkedVariant: Variant<string> = createVariant({
          keys: ['LINKED_KEY']
        });
        const variant: Variant<string> = createVariant({
          keys: ['PRIMARY_KEY'],
          link: linkedVariant
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'linked_value', 'should find using linked variant');
      });

      it('should handle chained linked variants', () => {
        const source: Source = createMockSource({});
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const baseVariant: Variant<number> = createVariant({
          fallback: 100
        });
        const middleVariant: Variant<number> = createVariant({
          link: baseVariant
        });
        const topVariant: Variant<number> = createVariant({
          keys: ['MISSING'],
          link: middleVariant
        });

        const result = env.findVariance(topVariant);
        strictEqual(result, 100, 'should resolve through chained links');
      });

      it('should prioritize source over linked variant', () => {
        const source: Source = createMockSource({ KEY: 'from_source' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const linkedVariant: Variant<string> = createVariant({
          fallback: 'from_link'
        });
        const variant: Variant<string> = createVariant({
          keys: ['KEY'],
          link: linkedVariant
        });

        const result = env.findVariance(variant);
        strictEqual(result, 'from_source', 'should prefer source value');
      });
    });

    describe('with variant parser', () => {

      it('should apply parser to source text', () => {
        const source: Source = createMockSource({ NUMBERS: '1,2,3' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<number[]> = createVariant({
          keys: ['NUMBERS'],
          parser: {
            transform: (input: string) => input.split(',').map(s => parseInt(s, 10))
          }
        });

        const result = env.findVariance(variant);
        ok(Array.isArray(result), 'should parse to array');
        deepStrictEqual(result, [1, 2, 3], 'should parse comma-separated numbers');
      });

      it('should parse JSON from source', () => {
        const source: Source = createMockSource({
          CONFIG: JSON.stringify({
            debug: true,
            port: 8080
          })
        });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<{ debug: boolean; port: number }> = createVariant({
          keys: ['CONFIG'],
          parser: {
            transform: (input: string) => JSON.parse(input)
          }
        });

        const result = env.findVariance(variant);
        ok(isPresent(result), 'should parse JSON');
        strictEqual(result?.debug, true, 'debug should be true');
        strictEqual(result?.port, 8080, 'port should be 8080');
      });
    });

    describe('with empty configuration', () => {

      it('should return undefined when environment has no sources', () => {
        const env: Environment = createEnvironment();
        const variant: Variant<string> = createVariant({
          keys: ['ANY_KEY']
        });

        const result = env.findVariance(variant);
        strictEqual(result, undefined, 'should return undefined');
      });

      it('should return undefined for variant with no keys and no fallback', () => {
        const source: Source = createMockSource({ KEY: 'value' });
        const env: Environment = createEnvironment({
          sources: [source]
        });
        const variant: Variant<string> = createVariant();

        const result = env.findVariance(variant);
        strictEqual(result, undefined, 'should return undefined');
      });
    });
  });

  describe('getVariance method', () => {

    it('should return value when variance found', () => {
      const source: Source = createMockSource({ KEY: 'value' });
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<string> = createVariant({
        keys: ['KEY']
      });

      const result = env.getVariance(variant);
      strictEqual(result, 'value', 'should return found value');
    });

    it('should return fallback when variance not in source', () => {
      const source: Source = createMockSource({});
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<string> = createVariant({
        keys: ['KEY'],
        fallback: 'default'
      });

      const result = env.getVariance(variant);
      strictEqual(result, 'default', 'should return fallback');
    });

    it('should throw VariantException when variance not found', () => {
      const source: Source = createMockSource({});
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<string> = createVariant({
        keys: ['MISSING_KEY'],
        name: 'TestVariant'
      });

      try {
        env.getVariance(variant);
        ok(false, 'should have thrown');
      } catch (e) {
        ok(e instanceof VariantException, 'should throw VariantException');
      }
    });

    it('should include variant name in exception message', () => {
      const source: Source = createMockSource({});
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<string> = createVariant({
        keys: ['KEY'],
        name: 'MyVariant'
      });

      try {
        env.getVariance(variant);
        ok(false, 'should have thrown');
      } catch (error) {
        ok(error instanceof VariantException, 'should be VariantException');
        ok((error as VariantException).message.includes('MyVariant'), 'should include variant name');
      }
    });

    it('should parse value before returning', () => {
      const source: Source = createMockSource({ COUNT: '42' });
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<number> = createVariant({
        keys: ['COUNT'],
        parser: {
          transform: (input: string) => parseInt(input, 10)
        }
      });

      const result = env.getVariance(variant);
      strictEqual(result, 42, 'should return parsed number');
    });

    it('should throw when parser returns undefined', () => {
      const source: Source = createMockSource({ INVALID: 'bad' });
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<number> = createVariant<number>({
        keys: ['INVALID'],
        parser: {
          transform: (input: ValueType): RequiredType<number> => {
            used(input);
            return undefined as unknown as RequiredType<number>;
          }
        },
        name: 'InvalidNumber'
      });

      try {
        env.getVariance(variant);
        ok(false, 'should have thrown');
      } catch (e) {
        ok(e instanceof VariantException, 'should throw when parser returns undefined');
      }
    });
  });

  describe('complex integration scenarios', () => {

    it('should resolve variance with multiple keys and sources', () => {
      const source1: Source = createMockSource({});
      const source2: Source = createMockSource({ SECONDARY_KEY: 'value' });
      const env: Environment = createEnvironment({
        sources: [source1, source2]
      });
      const variant: Variant<string> = createVariant({
        keys: ['PRIMARY_KEY', 'SECONDARY_KEY', 'TERTIARY_KEY']
      });

      const result = env.findVariance(variant);
      strictEqual(result, 'value', 'should find secondary key in second source');
    });

    it('should handle complex object variance with parser', () => {
      interface AppConfig {
        appName: string;
        version: string;
        debug: boolean;
      }

      const source: Source = createMockSource({
        APP_CONFIG: JSON.stringify({
          appName: 'MyApp',
          version: '1.0.0',
          debug: false
        })
      });
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<AppConfig> = createVariant({
        keys: ['APP_CONFIG'],
        parser: {
          transform: (input: string) => JSON.parse(input) as AppConfig
        }
      });

      const result = env.getVariance(variant);
      strictEqual(result.appName, 'MyApp', 'appName should match');
      strictEqual(result.version, '1.0.0', 'version should match');
      strictEqual(result.debug, false, 'debug should be false');
    });

    it('should handle variant with multiple fallback chain', () => {
      const source: Source = createMockSource({});
      const env: Environment = createEnvironment({
        sources: [source]
      });

      const level3: Variant<number> = createVariant({
        fallback: 300
      });
      const level2: Variant<number> = createVariant({
        link: level3
      });
      const level1: Variant<number> = createVariant({
        keys: ['KEY'],
        link: level2
      });

      const result = env.findVariance(level1);
      strictEqual(result, 300, 'should resolve through multiple fallback chain');
    });

    it('should handle empty source list', () => {
      const env: Environment = createEnvironment({
        sources: []
      });
      const variant: Variant<string> = createVariant({
        keys: ['KEY'],
        fallback: 'default'
      });

      const result = env.findVariance(variant);
      strictEqual(result, 'default', 'should use fallback with empty sources');
    });

    it('should return undefined when no fallback and not in any source', () => {
      const source1: Source = createMockSource({ OTHER: 'value' });
      const source2: Source = createMockSource({ ANOTHER: 'value' });
      const env: Environment = createEnvironment({
        sources: [source1, source2]
      });
      const variant: Variant<string> = createVariant({
        keys: ['KEY']
      });

      const result = env.findVariance(variant);
      strictEqual(result, undefined, 'should return undefined');
    });

    it('should handle variant with no keys but with fallback', () => {
      const source: Source = createMockSource({ KEY: 'value' });
      const env: Environment = createEnvironment({
        sources: [source]
      });
      const variant: Variant<string> = createVariant({
        fallback: 'fallback_value'
      });

      const result = env.findVariance(variant);
      strictEqual(result, 'fallback_value', 'should use fallback when no keys');
    });
  });
});
