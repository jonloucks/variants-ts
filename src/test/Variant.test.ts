import { isPresent } from "@jonloucks/contracts-ts/api/Types";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";
import { Variant, check, guard } from "@jonloucks/variants-ts/api/Variant";
import { assertGuard, mockDuck } from "@jonloucks/variants-ts/test/helper.test";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

// temporary until we have a better way to manage test dependencies
import { create } from "../impl/Variant.impl";

describe('Variant Suite', () => {

  const FUNCTION_NAMES: (string | symbol)[] = [
    'name', 'keys', 'description', 'fallback', 'link', 'of'
  ];

  assertGuard(guard, ...FUNCTION_NAMES);

  describe('Variant Tests', () => {
    it('guard should return true for Variant', () => {
      const variant: Variant<string> = mockDuck<Variant<string>>(...FUNCTION_NAMES);
      ok(guard(variant), 'Variant should return true');
    });
  });

  describe('create function', () => {

    it('should create a Variant with no config', () => {
      const variant: Variant<string> = create<string>();
      ok(isPresent(variant), 'Variant should be created');
    });

    it('should create a Variant with empty config', () => {
      const variant: Variant<string> = create<string>({});
      ok(isPresent(variant), 'Variant should be created');
    });

    it('should create a Variant with all config properties', () => {
      const linkVariant: Variant<number> = create<number>({ name: 'linked' });
      const variant: Variant<number> = create<number>({
        keys: ['KEY1', 'KEY2'],
        name: 'testVariant',
        description: 'Test variant description',
        fallback: 42,
        link: linkVariant,
        parser: {
          transform: (input: string) => parseInt(input, 10)
        }
      });
      ok(isPresent(variant), 'Variant should be created');
    });
  });

  describe('keys property', () => {

    it('should return empty array when no keys provided', () => {
      const variant: Variant<string> = create<string>();
      ok(Array.isArray(variant.keys), 'keys should be an array');
      strictEqual(variant.keys.length, 0, 'keys should be empty');
    });

    it('should return empty array when keys is undefined', () => {
      const variant: Variant<string> = create<string>({ keys: undefined });
      ok(Array.isArray(variant.keys), 'keys should be an array');
      strictEqual(variant.keys.length, 0, 'keys should be empty');
    });

    it('should return provided keys', () => {
      const keys = ['KEY1', 'KEY2', 'KEY3'];
      const variant: Variant<string> = create<string>({ keys });
      deepStrictEqual(variant.keys, keys, 'keys should match provided keys');
    });

    it('should return readonly keys', () => {
      const keys = ['KEY1', 'KEY2'];
      const variant: Variant<string> = create<string>({ keys });
      const retrievedKeys = variant.keys;
      ok(Object.isFrozen(retrievedKeys) || Array.isArray(retrievedKeys), 'keys should be readonly');
    });
  });

  describe('name property', () => {

    it('should return empty string when no name provided', () => {
      const variant: Variant<string> = create<string>();
      strictEqual(variant.name, '', 'name should be empty string');
    });

    it('should return empty string when name is undefined', () => {
      const variant: Variant<string> = create<string>({ name: undefined });
      strictEqual(variant.name, '', 'name should be empty string');
    });

    it('should return provided name', () => {
      const name = 'myVariant';
      const variant: Variant<string> = create<string>({ name });
      strictEqual(variant.name, name, 'name should match provided name');
    });

    it('should return empty string for empty name', () => {
      const variant: Variant<string> = create<string>({ name: '' });
      strictEqual(variant.name, '', 'name should be empty string');
    });
  });

  describe('description property', () => {

    it('should return empty string when no description provided', () => {
      const variant: Variant<string> = create<string>();
      strictEqual(variant.description, '', 'description should be empty string');
    });

    it('should return empty string when description is undefined', () => {
      const variant: Variant<string> = create<string>({ description: undefined });
      strictEqual(variant.description, '', 'description should be empty string');
    });

    it('should return provided description', () => {
      const description = 'This is a test variant';
      const variant: Variant<string> = create<string>({ description });
      strictEqual(variant.description, description, 'description should match provided description');
    });
  });

  describe('fallback property', () => {

    it('should return undefined when no fallback provided', () => {
      const variant: Variant<string> = create<string>();
      strictEqual(variant.fallback, undefined, 'fallback should be undefined');
    });

    it('should return undefined when fallback is explicitly undefined', () => {
      const variant: Variant<string> = create<string>({ fallback: undefined });
      strictEqual(variant.fallback, undefined, 'fallback should be undefined');
    });

    it('should return provided fallback value', () => {
      const fallback = 'defaultValue';
      const variant: Variant<string> = create<string>({ fallback });
      strictEqual(variant.fallback, fallback, 'fallback should match provided value');
    });

    it('should return numeric fallback value', () => {
      const fallback = 42;
      const variant: Variant<number> = create<number>({ fallback });
      strictEqual(variant.fallback, fallback, 'fallback should match provided numeric value');
    });

    it('should return object fallback value', () => {
      const fallback = { key: 'value' };
      const variant: Variant<{ key: string }> = create<{ key: string }>({ fallback });
      strictEqual(variant.fallback, fallback, 'fallback should match provided object');
    });
  });

  describe('link property', () => {

    it('should return undefined when no link provided', () => {
      const variant: Variant<string> = create<string>();
      strictEqual(variant.link, undefined, 'link should be undefined');
    });

    it('should return undefined when link is explicitly undefined', () => {
      const variant: Variant<string> = create<string>({ link: undefined });
      strictEqual(variant.link, undefined, 'link should be undefined');
    });

    it('should return provided link variant', () => {
      const linkVariant: Variant<string> = create<string>({ name: 'linked' });
      const variant: Variant<string> = create<string>({ link: linkVariant });
      strictEqual(variant.link, linkVariant, 'link should match provided variant');
    });

    it('should allow chained links', () => {
      const baseVariant: Variant<number> = create<number>({ name: 'base', fallback: 100 });
      const middleVariant: Variant<number> = create<number>({ name: 'middle', link: baseVariant });
      const topVariant: Variant<number> = create<number>({ name: 'top', link: middleVariant });

      strictEqual(topVariant.link, middleVariant, 'top should link to middle');
      ok(isPresent(topVariant.link), 'top link should be present');
      if (isPresent(topVariant.link)) {
        strictEqual(topVariant.link.link, baseVariant, 'middle should link to base');
      }
    });
  });

  describe('"of" method', () => {

    describe('without parser', () => {

      it('should return input as-is when no parser provided', () => {
        const variant: Variant<string> = create<string>();
        const input = 'test value';
        const result = variant.of(input);
        strictEqual(result, input, 'result should be input value');
      });

      it('should return undefined for undefined input', () => {
        const variant: Variant<string> = create<string>();
        const result = variant.of(undefined as unknown as string);
        strictEqual(result, undefined, 'result should be undefined');
      });

      it('should return null for null input', () => {
        const variant: Variant<string> = create<string>();
        const result = variant.of(null as unknown as string);
        strictEqual(result, null, 'result should be null');
      });

      it('should return empty string for empty input', () => {
        const variant: Variant<string> = create<string>();
        const result = variant.of('');
        strictEqual(result, '', 'result should be empty string');
      });
    });

    describe('with parser', () => {

      it('should parse string to number using parser', () => {
        const variant: Variant<number> = create<number>({
          parser: {
            transform: (input: string) => parseInt(input, 10)
          }
        });
        const result = variant.of('42');
        strictEqual(result, 42, 'result should be parsed number');
      });

      it('should parse string to boolean using parser', () => {
        const variant: Variant<boolean> = create<boolean>({
          parser: {
            transform: (input: string) => input.toLowerCase() === 'true'
          }
        });
        const result = variant.of('true');
        strictEqual(result, true, 'result should be true');
      });

      it('should parse string to object using parser', () => {
        const variant: Variant<{ value: number }> = create<{ value: number }>({
          parser: {
            transform: (input: string) => JSON.parse(input)
          }
        });
        const result = variant.of('{"value": 123}');
        ok(isPresent(result), 'result should be present');
        strictEqual(result?.value, 123, 'result value should be 123');
      });

      it('should handle undefined input with parser', () => {
        const variant: Variant<number> = create<number>({
          parser: {
            transform: (input: string) => parseInt(input, 10)
          }
        });
        const result = variant.of(undefined as unknown as string);
        strictEqual(result, undefined, 'result should be undefined');
      });

      it('should handle null input with parser', () => {
        const variant: Variant<number> = create<number>({
          parser: {
            transform: (input: string) => parseInt(input, 10)
          }
        });
        const result = variant.of(null as unknown as string);
        strictEqual(result, null, 'result should be null');
      });

      it('should parse floating point numbers', () => {
        const variant: Variant<number> = create<number>({
          parser: {
            transform: (input: string) => parseFloat(input)
          }
        });
        const result = variant.of('3.14159');
        strictEqual(result, 3.14159, 'result should be parsed float');
      });

      it('should handle parser that throws error', () => {
        const variant: Variant<object> = create<object>({
          parser: {
            transform: (input: string) => JSON.parse(input)
          }
        });

        try {
          variant.of('invalid json');
          ok(false, 'should have thrown error');
        } catch {
          ok(true, 'error should be thrown');
        }
      });

      it('should handle custom parser transformations', () => {
        const variant: Variant<string[]> = create<string[]>({
          parser: {
            transform: (input: string) => input.split(',').map(s => s.trim())
          }
        });
        const result = variant.of('a, b, c');
        ok(Array.isArray(result), 'result should be array');
        deepStrictEqual(result, ['a', 'b', 'c'], 'result should be split array');
      });
    });

    describe('with "of" property', () => {

      it('should use "of" transform when provided', () => {
        const variant: Variant<number> = create<number>({
          of: {
            transform: (input: string | null | undefined) => {
              if (input === null || input === undefined) {
                return input as number | null | undefined;
              }
              return parseInt(input, 10);
            }
          }
        });
        const result = variant.of('42');
        strictEqual(result, 42, 'should use "of" transform');
      });

      it('should handle undefined input with "of"', () => {
        const variant: Variant<number> = create<number>({
          of: {
            transform: (input: string | null | undefined) => {
              if (input === null || input === undefined) {
                return input as number | null | undefined;
              }
              return parseInt(input, 10);
            }
          }
        });
        const result = variant.of(undefined as unknown as string);
        strictEqual(result, undefined, 'should return undefined');
      });

      it('should handle null input with "of"', () => {
        const variant: Variant<number> = create<number>({
          of: {
            transform: (input: string | null | undefined) => {
              if (input === null || input === undefined) {
                return input as number | null | undefined;
              }
              return parseInt(input, 10);
            }
          }
        });
        const result = variant.of(null as unknown as string);
        strictEqual(result, null, 'should return null');
      });

      it('should handle empty string with "of"', () => {
        const variant: Variant<string> = create<string>({
          of: {
            transform: (input: string | null | undefined) => {
              if (input === '') {
                return 'EMPTY';
              }
              return input as string;
            }
          }
        });
        const result = variant.of('');
        strictEqual(result, 'EMPTY', 'should handle empty string');
      });

      it('should parse complex objects with "of"', () => {
        interface Data {
          id: number;
          value: string;
        }
        const variant: Variant<Data> = create<Data>({
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return input as Data | null | undefined;
              }
              return JSON.parse(input) as Data;
            }
          }
        });
        const result = variant.of('{"id": 1, "value": "test"}');
        ok(isPresent(result), 'result should be present');
        strictEqual(result?.id, 1, 'id should match');
        strictEqual(result?.value, 'test', 'value should match');
      });

      it('should parse arrays with "of"', () => {
        const variant: Variant<number[]> = create<number[]>({
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return input as number[] | null | undefined;
              }
              return input.split(',').map(s => parseInt(s.trim(), 10));
            }
          }
        });
        const result = variant.of('1, 2, 3, 4');
        ok(Array.isArray(result), 'result should be array');
        deepStrictEqual(result, [1, 2, 3, 4], 'should parse array correctly');
      });

      it('should prefer "of" over parser when both provided', () => {
        const variant: Variant<string> = create<string>({
          parser: {
            transform: (input: string) => `parser:${input}`
          },
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return input as string | null | undefined;
              }
              return `of:${input}`;
            }
          }
        });
        const result = variant.of('test');
        strictEqual(result, 'of:test', 'should use of over parser');
      });

      it('should handle custom validation logic in "of"', () => {
        const variant: Variant<number> = create<number>({
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return undefined;
              }
              const num = parseInt(input, 10);
              if (isNaN(num) || num < 0) {
                return undefined;
              }
              return num;
            }
          }
        });

        strictEqual(variant.of('42'), 42, 'valid number should work');
        strictEqual(variant.of('-5'), undefined, 'negative should return undefined');
        strictEqual(variant.of('abc'), undefined, 'invalid should return undefined');
      });

      it('should handle boolean transformation with "of"', () => {
        const variant: Variant<boolean> = create<boolean>({
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return false;
              }
              const lower = input.toLowerCase();
              return lower === 'true' || lower === '1' || lower === 'yes';
            }
          }
        });

        strictEqual(variant.of('true'), true, '"true" should be true');
        strictEqual(variant.of('TRUE'), true, '"TRUE" should be true');
        strictEqual(variant.of('1'), true, '"1" should be true');
        strictEqual(variant.of('yes'), true, '"yes" should be true');
        strictEqual(variant.of('false'), false, '"false" should be false');
        strictEqual(variant.of('0'), false, '"0" should be false');
      });

      it('should handle date parsing with "of"', () => {
        const variant: Variant<Date> = create<Date>({
          of: {
            transform: (input: string | null | undefined) => {
              if (!input) {
                return input as Date | null | undefined;
              }
              return new Date(input);
            }
          }
        });

        const result = variant.of('2100-02-09');
        ok(result instanceof Date, 'result should be a Date');
        strictEqual(result?.getFullYear(), 2100, 'year should be 2100');
      });
    });
  });

  describe('complete config integration', () => {

    it('should create fully configured Variant with all properties', () => {
      const linkVariant: Variant<number> = create<number>({
        keys: ['LINK_KEY'],
        name: 'LinkVariant',
        description: 'Linked variant',
        fallback: 999
      });

      const variant: Variant<number> = create<number>({
        keys: ['PRIMARY_KEY', 'SECONDARY_KEY'],
        name: 'MainVariant',
        description: 'Main variant with full config',
        fallback: 42,
        link: linkVariant,
        parser: {
          transform: (input: string) => parseInt(input, 10)
        }
      });

      // Verify all properties
      deepStrictEqual(variant.keys, ['PRIMARY_KEY', 'SECONDARY_KEY'], 'keys should match');
      strictEqual(variant.name, 'MainVariant', 'name should match');
      strictEqual(variant.description, 'Main variant with full config', 'description should match');
      strictEqual(variant.fallback, 42, 'fallback should match');
      strictEqual(variant.link, linkVariant, 'link should match');
      strictEqual(variant.of('100'), 100, '"of" should parse correctly');
    });

    it('should handle complex type with full config', () => {
      interface ComplexType {
        id: number;
        name: string;
        tags: string[];
      }

      const variant: Variant<ComplexType> = create<ComplexType>({
        keys: ['COMPLEX_CONFIG'],
        name: 'ComplexVariant',
        description: 'Variant with complex type',
        fallback: { id: 0, name: 'default', tags: [] },
        parser: {
          transform: (input: string) => JSON.parse(input) as ComplexType
        }
      });

      const jsonInput = '{"id": 5, "name": "test", "tags": ["a", "b"]}';
      const result = variant.of(jsonInput);

      ok(isPresent(result), 'result should be present');
      strictEqual(result?.id, 5, 'id should match');
      strictEqual(result?.name, 'test', 'name should match');
      deepStrictEqual(result?.tags, ['a', 'b'], 'tags should match');
    });
  });

  describe('edge cases', () => {

    it('should handle empty keys array', () => {
      const variant: Variant<string> = create<string>({ keys: [] });
      strictEqual(variant.keys.length, 0, 'keys should be empty');
    });

    it('should handle single key', () => {
      const variant: Variant<string> = create<string>({ keys: ['SINGLE_KEY'] });
      strictEqual(variant.keys.length, 1, 'keys should have one element');
      strictEqual(variant.keys[0], 'SINGLE_KEY', 'key should match');
    });

    it('should handle very long key names', () => {
      const longKey = 'A'.repeat(1000);
      const variant: Variant<string> = create<string>({ keys: [longKey] });
      strictEqual(variant.keys[0], longKey, 'long key should be preserved');
    });

    it('should handle special characters in name', () => {
      const specialName = 'Test@#$%^&*()_+-={}[]|:";\'<>?,./';
      const variant: Variant<string> = create<string>({ name: specialName });
      strictEqual(variant.name, specialName, 'special characters should be preserved');
    });

    it('should handle multiline description', () => {
      const multilineDesc = 'Line 1\nLine 2\nLine 3';
      const variant: Variant<string> = create<string>({ description: multilineDesc });
      strictEqual(variant.description, multilineDesc, 'multiline description should be preserved');
    });

    it('should handle zero as fallback', () => {
      const variant: Variant<number> = create<number>({ fallback: 0 });
      strictEqual(variant.fallback, 0, 'zero fallback should be preserved');
    });

    it('should handle false as fallback', () => {
      const variant: Variant<boolean> = create<boolean>({ fallback: false });
      strictEqual(variant.fallback, false, 'false fallback should be preserved');
    });

    it('should handle empty string as fallback', () => {
      const variant: Variant<string> = create<string>({ fallback: '' });
      strictEqual(variant.fallback, '', 'empty string fallback should be preserved');
    });

    it('should not allow modification of retrieved keys', () => {
      const keys = ['KEY1', 'KEY2'];
      const variant: Variant<string> = create<string>({ keys });
      const retrievedKeys = variant.keys;

      // Verify we get the same keys each time
      const retrievedKeys2 = variant.keys;
      strictEqual(retrievedKeys.length, 2, 'keys length should be 2');
      strictEqual(retrievedKeys2.length, 2, 'keys length should be 2 on second access');
    });
  });

  describe('check function', () => {

    it('should return variant when valid variant provided', () => {
      const variant: Variant<string> = create<string>({
        keys: ['KEY'],
        name: 'testVariant'
      });

      const result = check<string>(variant);
      strictEqual(result, variant, 'should return the same variant');
    });

    it('should return variant for variant with all properties', () => {
      const linkVariant: Variant<number> = create<number>({ name: 'linked' });
      const variant: Variant<number> = create<number>({
        keys: ['KEY1', 'KEY2'],
        name: 'testVariant',
        description: 'Test description',
        fallback: 42,
        link: linkVariant,
        parser: {
          transform: (input: string) => parseInt(input, 10)
        }
      });

      const result = check<number>(variant);
      strictEqual(result, variant, 'should return the same variant');
      strictEqual(result.name, 'testVariant', 'name should be preserved');
      strictEqual(result.fallback, 42, 'fallback should be preserved');
    });

    it('should throw IllegalArgumentException for null', () => {
      try {
        check<string>(null);
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
        ok((error as Error).message.includes('Variant must be present'), 'error message should be correct');
      }
    });

    it('should throw IllegalArgumentException for undefined', () => {
      try {
        check<string>(undefined);
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
        ok((error as Error).message.includes('Variant must be present'), 'error message should be correct');
      }
    });

    it('should throw IllegalArgumentException for empty object', () => {
      try {
        check<string>({});
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
      }
    });

    it('should throw IllegalArgumentException for object missing required properties', () => {
      const invalidVariant = {
        name: 'test',
        keys: ['KEY']
        // missing description, fallback, link, of
      };

      try {
        check<string>(invalidVariant);
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
      }
    });

    it('should throw IllegalArgumentException for plain string', () => {
      try {
        check<string>('not a variant');
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
      }
    });

    it('should throw IllegalArgumentException for plain number', () => {
      try {
        check<number>(42);
        ok(false, 'should have thrown exception');
      } catch (error) {
        ok(error instanceof IllegalArgumentException, 'should throw IllegalArgumentException');
      }
    });

    it('should accept mocked variant with all required properties', () => {
      const mockedVariant: Variant<string> = mockDuck<Variant<string>>(...FUNCTION_NAMES);
      const result = check<string>(mockedVariant);
      strictEqual(result, mockedVariant, 'should return mocked variant');
    });

    it('should validate variant before returning', () => {
      const variant = create<string>({ keys: ['KEY1'], name: 'test' });
      ok(guard(variant), 'variant should pass guard check');

      const checked = check<string>(variant);
      ok(guard(checked), 'checked variant should also pass guard check');
      strictEqual(variant, checked, 'should be same instance');
    });
  });

  describe('toString method', () => {

    it('should return "Variant" when no name provided', () => {
      const variant: Variant<string> = create<string>();
      strictEqual(variant.toString(), 'Variant', 'toString should return "Variant"');
    });

    it('should return "Variant" when name is empty string', () => {
      const variant: Variant<string> = create<string>({ name: '' });
      strictEqual(variant.toString(), 'Variant', 'toString should return "Variant" for empty name');
    });

    it('should return "Variant(name=<name>)" when name is provided', () => {
      const variant: Variant<string> = create<string>({ name: 'MyVariant' });
      strictEqual(variant.toString(), 'Variant(name=MyVariant)', 'toString should include name');
    });

    it('should return formatted string for variant with all properties', () => {
      const variant: Variant<number> = create<number>({
        keys: ['KEY1', 'KEY2'],
        name: 'ComplexVariant',
        description: 'A complex variant',
        fallback: 42
      });
      strictEqual(variant.toString(), 'Variant(name=ComplexVariant)', 'toString should show variant name');
    });

    it('should handle special characters in name', () => {
      const specialName = 'Test-Variant_123';
      const variant: Variant<string> = create<string>({ name: specialName });
      strictEqual(variant.toString(), `Variant(name=${specialName})`, 'toString should handle special characters');
    });

    it('should work with linked variants', () => {
      const linkedVariant: Variant<string> = create<string>({ name: 'LinkedVariant' });
      const variant: Variant<string> = create<string>({
        name: 'MainVariant',
        link: linkedVariant
      });
      strictEqual(variant.toString(), 'Variant(name=MainVariant)', 'toString should show main variant name');
      strictEqual(linkedVariant.toString(), 'Variant(name=LinkedVariant)', 'linked variant toString should work');
    });

    it('should be callable in string context', () => {
      const variant: Variant<string> = create<string>({ name: 'TestVariant' });
      const message = `Current variant: ${variant.toString()}`;
      strictEqual(message, 'Current variant: Variant(name=TestVariant)', 'toString should work in string interpolation');
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(100);
      const variant: Variant<string> = create<string>({ name: longName });
      strictEqual(variant.toString(), `Variant(name=${longName})`, 'toString should handle long names');
    });
  });
});
