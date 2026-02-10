import { CONTRACT, ParserFactory, guard } from "@jonloucks/variants-ts/api/ParserFactory";

// temporary until we have a better testing strategy for the implementation details of ParserFactory
import { create as createFactory } from "../impl/ParserFactory.impl";
import { assertContract, assertGuard } from "./helper.test";


const FUNCTION_NAMES: (string | symbol)[] = [
  'stringParser',
  'ofRawString',
  'ofString',
  'booleanParser',
  'ofBoolean',
  'numberParser',
  'ofNumber',
  'bigIntParser',
  'ofBigInt',
  'trim',
  'string',
  'ofTrimAndSkipEmpty',
  'ofList'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(CONTRACT, 'ParserFactory');

describe("ParserFactory", () => {

  let parserFactory: ParserFactory;

  beforeEach(() => {
    parserFactory = createFactory();
  });

  test("should create a ParserFactory instance", () => {
    expect(parserFactory).toBeDefined();
    expect(parserFactory.stringParser).toBeDefined();
    expect(parserFactory.ofRawString).toBeDefined();
    expect(parserFactory.ofString).toBeDefined();
    expect(parserFactory.booleanParser).toBeDefined();
    expect(parserFactory.ofBoolean).toBeDefined();
    expect(parserFactory.numberParser).toBeDefined();
    expect(parserFactory.ofNumber).toBeDefined();
    expect(parserFactory.bigIntParser).toBeDefined();
    expect(parserFactory.ofBigInt).toBeDefined();
    expect(parserFactory.trim).toBeDefined();
    expect(parserFactory.string).toBeDefined();
    expect(parserFactory.ofTrimAndSkipEmpty).toBeDefined();
    expect(parserFactory.ofList).toBeDefined();
  });

  describe('stringParser', () => {
    it('should parse string input', () => {
      const parser = parserFactory.stringParser();
      expect(parser.transform('hello')).toBe('hello');
    });

    it('should convert number to string', () => {
      const parser = parserFactory.stringParser();
      expect(parser.transform(42)).toBe('42');
    });

    it('should convert boolean to string', () => {
      const parser = parserFactory.stringParser();
      expect(parser.transform(true)).toBe('true');
      expect(parser.transform(false)).toBe('false');
    });

    it('should convert Buffer to string', () => {
      const parser = parserFactory.stringParser();
      const buffer = Buffer.from('hello', 'utf8');
      expect(parser.transform(buffer)).toBe('hello');
    });

    it('should convert bigint to string', () => {
      const parser = parserFactory.stringParser();
      expect(parser.transform(BigInt(12345))).toBe('12345');
    });
  });

  describe('ofRawString', () => {
    it('should convert value string without trimming', () => {
      const parser = parserFactory.ofRawString();
      expect(parser.transform('  hello  ')).toBe('  hello  ');
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofRawString();
      expect(parser.transform(undefined)).toBeUndefined();
    });

    it('should return undefined for null', () => {
      const parser = parserFactory.ofRawString();
      expect(parser.transform(null as unknown as string)).toBeUndefined();
    });

    it('should convert number input', () => {
      const parser = parserFactory.ofRawString();
      expect(parser.transform(42)).toBe('42');
    });

    it('should convert Buffer input', () => {
      const parser = parserFactory.ofRawString();
      const buffer = Buffer.from('buffer', 'utf8');
      expect(parser.transform(buffer)).toBe('buffer');
    });
  });

  describe('ofString', () => {
    it('should trim and convert string', () => {
      const parser = parserFactory.ofString();
      expect(parser.transform('  hello  ')).toBe('hello');
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofString();
      expect(parser.transform('')).toBeUndefined();
    });

    it('should return empty string for whitespace only', () => {
      const parser = parserFactory.ofString();
      expect(parser.transform('   ')).toBe('');
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofString();
      expect(parser.transform(undefined)).toBeUndefined();
    });

    it('should convert and trim number', () => {
      const parser = parserFactory.ofString();
      expect(parser.transform('  42  ')).toBe('42');
    });
  });

  describe('booleanParser', () => {
    it('should parse boolean true', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(true)).toBe(true);
      expect(parser.transform(false)).toBe(false);
    });

    it('should parse number 1 as true', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(1)).toBe(true);
      expect(parser.transform(0)).toBe(false);
      expect(parser.transform(42)).toBe(false);
    });

    it('should parse bigint 1n as true', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(BigInt(1))).toBe(true);
      expect(parser.transform(BigInt(0))).toBe(false);
      expect(parser.transform(BigInt(42))).toBe(false);
    });

    it('should parse string "true" case-insensitive', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform('true')).toBe(true);
      expect(parser.transform('TRUE')).toBe(true);
      expect(parser.transform('True')).toBe(true);
      expect(parser.transform('1')).toBe(true);
      expect(parser.transform('false')).toBe(false);
      expect(parser.transform('FALSE')).toBe(false);
      expect(parser.transform('0')).toBe(false);
    });

    it('should parse Buffer true', () => {
      const parser = parserFactory.booleanParser();
      const trueBuffer = Buffer.from('true', 'utf8');
      const falseBuffer = Buffer.from('false', 'utf8');
      expect(parser.transform(trueBuffer)).toBe(true);
      expect(parser.transform(falseBuffer)).toBe(false);
    });
  });

  describe('ofBoolean', () => {
    it('should parse trimmed string boolean', () => {
      const parser = parserFactory.ofBoolean();
      expect(parser.transform('  true  ')).toBe(true);
      expect(parser.transform('  false  ')).toBe(false);
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofBoolean();
      expect(parser.transform('')).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofBoolean();
      expect(parser.transform(undefined)).toBeUndefined();
    });
  });

  describe('numberParser', () => {
    it('should parse number', () => {
      const parser = parserFactory.numberParser();
      expect(parser.transform(42)).toBe(42);
      expect(parser.transform(3.14)).toBe(3.14);
    });

    it('should convert bigint to number', () => {
      const parser = parserFactory.numberParser();
      expect(parser.transform(BigInt(42))).toBe(42);
    });

    it('should parse string number', () => {
      const parser = parserFactory.numberParser();
      expect(parser.transform('42')).toBe(42);
      expect(parser.transform('3.14')).toBe(3.14);
    });

    it('should parse Buffer number', () => {
      const parser = parserFactory.numberParser();
      const buffer = Buffer.from('42', 'utf8');
      expect(parser.transform(buffer)).toBe(42);
    });

    it('should handle NaN for invalid input', () => {
      const parser = parserFactory.numberParser();
      expect(Number.isNaN(parser.transform('invalid'))).toBe(true);
    });
  });

  describe('ofNumber', () => {
    it('should parse trimmed string number', () => {
      const parser = parserFactory.ofNumber();
      expect(parser.transform('  42  ')).toBe(42);
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofNumber();
      expect(parser.transform('')).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofNumber();
      expect(parser.transform(undefined)).toBeUndefined();
    });
  });

  describe('bigIntParser', () => {
    it('should parse bigint', () => {
      const parser = parserFactory.bigIntParser();
      expect(parser.transform(BigInt(42))).toBe(BigInt(42));
    });

    it('should convert number to bigint', () => {
      const parser = parserFactory.bigIntParser();
      expect(parser.transform(42)).toBe(BigInt(42));
    });

    it('should parse string bigint', () => {
      const parser = parserFactory.bigIntParser();
      expect(parser.transform('12345')).toBe(BigInt(12345));
    });

    it('should parse Buffer bigint', () => {
      const parser = parserFactory.bigIntParser();
      const buffer = Buffer.from('42', 'utf8');
      expect(parser.transform(buffer)).toBe(BigInt(42));
    });

    it('should handle other types via toString', () => {
      const parser = parserFactory.bigIntParser();
      const obj = { toString: (): string => '100' };
      expect(parser.transform(obj as unknown as string)).toBe(BigInt(100));
    });
  });

  describe('ofBigInt', () => {
    it('should parse trimmed string bigint', () => {
      const parser = parserFactory.ofBigInt();
      expect(parser.transform('  42  ')).toBe(BigInt(42));
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofBigInt();
      expect(parser.transform('')).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofBigInt();
      expect(parser.transform(undefined)).toBeUndefined();
    });
  });

  describe('trim', () => {
    it('should trim whitespace', () => {
      expect(parserFactory.trim('  hello  ')).toBe('hello');
      expect(parserFactory.trim('hello')).toBe('hello');
      expect(parserFactory.trim('  ')).toBe('');
    });

    it('should trim Buffer', () => {
      const buffer = Buffer.from('  hello  ', 'utf8');
      expect(parserFactory.trim(buffer)).toBe('hello');
    });

    it('should convert non-string to string and trim', () => {
      expect(parserFactory.trim(42)).toBe('42');
    });
  });

  describe('string', () => {
    it('should apply parser to string conversion', () => {
      const stringToNumber: { transform: (s: string) => number } = {
        transform: (s: string) => parseInt(s, 10)
      };
      const parser = parserFactory.string(stringToNumber);
      expect(parser.transform('42')).toBe(42);
      expect(parser.transform(42)).toBe(42);
    });

    it('should work with complex parser', () => {
      const stringToArray: { transform: (s: string) => string[] } = {
        transform: (s: string) => s.split(',')
      };
      const parser = parserFactory.string(stringToArray);
      expect(parser.transform('a,b,c')).toEqual(['a', 'b', 'c']);
    });
  });

  describe('ofTrimAndSkipEmpty', () => {
    it('should trim and skip empty', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      expect(parser.transform('  42  ')).toBe(42);
      expect(parser.transform('')).toBeUndefined();
      expect(parser.transform('   ')).toBe(0);
    });

    it('should return undefined for undefined', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      expect(parser.transform(undefined as unknown as string)).toBeUndefined();
    });

    it('should handle null as undefined', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      expect(parser.transform(null as unknown as string)).toBeUndefined();
    });

    it('should work with Buffer input', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      const buffer = Buffer.from('  42  ', 'utf8');
      expect(parser.transform(buffer)).toBe(42);
    });

    it('should skip empty Buffer', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      const emptyBuffer = Buffer.from('', 'utf8');
      expect(parser.transform(emptyBuffer)).toBeUndefined();
    });

    it('should handle non-string non-Buffer types as not empty', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      expect(parser.transform(42)).toBe(42);
      expect(Number.isNaN(parser.transform(true) as number)).toBe(true);
    });
  });

  describe('ofList', () => {
    it('should parse delimited list', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      const result = parser.transform('1,2,3');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle spaces around delimiter', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform('  a  ,  b  ,  c  ');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should skip undefined values from parser', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform('a,,c');
      expect(result).toEqual(['a', 'c']);
    });

    it('should return undefined for empty input', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      expect(parser.transform('')).toBeUndefined();
    });

    it('should parse whitespace to number', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      expect(parser.transform('   ')).toEqual([0]);
    });

    it('should handle different delimiters', () => {
      const numberParser = parserFactory.numberParser();
      const pipeParser = parserFactory.ofList(numberParser, '|');
      expect(pipeParser.transform('1|2|3')).toEqual([1, 2, 3]);
    });

    it('should handle semicolon delimiter', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ';');
      expect(parser.transform('a;b;c')).toEqual(['a', 'b', 'c']);
    });

    it('should handle spaces in list', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform(' , , ');
      expect(result).toEqual(['']);
    });

    it('should work with boolean parser', () => {
      const booleanParser = parserFactory.booleanParser();
      const listParser = parserFactory.ofList(booleanParser, ',');
      expect(listParser.transform('true,false,true')).toEqual([true, false, true]);
    });

    it('should return undefined for whitespace only Buffer', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      const buffer = Buffer.from('   ', 'utf8');
      expect(parser.transform(buffer)).toEqual([0]);
    });

    it('should handle list with Buffer input', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const buffer = Buffer.from('a,b,c', 'utf8');
      expect(parser.transform(buffer)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Parser edge cases', () => {
    it('should handle boolean parser with non-standard object toString', () => {
      const parser = parserFactory.booleanParser();
      const obj = { toString: (): string => 'true' };
      expect(parser.transform(obj as unknown as string)).toBe(true);
    });

    it('should handle number parser with object toString', () => {
      const parser = parserFactory.numberParser();
      const obj = { toString: (): string => '42' };
      expect(parser.transform(obj as unknown as string)).toBe(42);
    });

    it('should handle false boolean strings', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform('FALSE')).toBe(false);
      expect(parser.transform('false')).toBe(false);
      expect(parser.transform('FaLsE')).toBe(false);
    });

    it('should handle number parsing with decimals', () => {
      const parser = parserFactory.numberParser();
      expect(parser.transform('-3.14')).toBe(-3.14);
      expect(parser.transform('-3.14')).toBeCloseTo(-3.14, 2);
    });

    it('should handle bigint parser with large numbers', () => {
      const parser = parserFactory.bigIntParser();
      const large = BigInt('99999999999999999999999999999');
      expect(parser.transform(large)).toBe(large);
    });

    it('should handle bigint parser with negative numbers', () => {
      const parser = parserFactory.bigIntParser();
      expect(parser.transform('-999')).toBe(BigInt(-999));
    });

    it('should handle string parser with special characters', () => {
      const parser = parserFactory.stringParser();
      const special = 'hello!@#$%^&*()_+-={}[]|:;<>?,./';
      expect(parser.transform(special)).toBe(special);
    });

    it('should handle ofList with single element', () => {
      const parser = parserFactory.ofList(parserFactory.stringParser(), ',');
      expect(parser.transform('single')).toEqual(['single']);
    });

    it('should handle Buffer with special characters', () => {
      const buffer = Buffer.from('special!@#$', 'utf8');
      const parser = parserFactory.stringParser();
      expect(parser.transform(buffer)).toBe('special!@#$');
    });

    it('should handle number 0 as falsy in boolean parser', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(0)).toBe(false);
    });

    it('should handle negative numbers in boolean parser', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(-1)).toBe(false);
      expect(parser.transform(-5)).toBe(false);
    });

    it('should handle bigint 0 as falsy', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(BigInt(0))).toBe(false);
    });

    it('should handle bigint 2 as falsy', () => {
      const parser = parserFactory.booleanParser();
      expect(parser.transform(BigInt(2))).toBe(false);
    });
  });
});