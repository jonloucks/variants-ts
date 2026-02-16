import { describe, it, beforeEach, afterEach } from "node:test";
import { ok, strictEqual, deepStrictEqual } from "node:assert";

import { ParserFactory, guard, CONTRACT as PARSER_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/ParserFactory";

import { assertContract, assertGuard } from "./helper.test";
import { Installer } from "@jonloucks/variants-ts/api/Installer";
import { AutoClose, Contracts, CONTRACTS } from "@jonloucks/contracts-ts";
import { createInstaller } from "@jonloucks/variants-ts";

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
assertContract(PARSER_FACTORY_CONTRACT, 'ParserFactory');

describe("ParserFactory", () => {
  let contracts: Contracts = CONTRACTS;
  let installer: Installer;
  let closeInstaller: AutoClose;
  let parserFactory: ParserFactory;

  beforeEach(() => {
    installer = createInstaller({ contracts: contracts });
    closeInstaller = installer.open();
    parserFactory = contracts.enforce(PARSER_FACTORY_CONTRACT);
  });

  afterEach(() => {
    closeInstaller.close();
  });

  it("should create a ParserFactory instance", () => {
    ok(parserFactory);
    ok(parserFactory.stringParser);
    ok(parserFactory.ofRawString);
    ok(parserFactory.ofString);
    ok(parserFactory.booleanParser);
    ok(parserFactory.ofBoolean);
    ok(parserFactory.numberParser);
    ok(parserFactory.ofNumber);
    ok(parserFactory.bigIntParser);
    ok(parserFactory.ofBigInt);
    ok(parserFactory.trim);
    ok(parserFactory.string);
    ok(parserFactory.ofTrimAndSkipEmpty);
    ok(parserFactory.ofList);
  });

  describe('stringParser', () => {
    it('should parse string input', () => {
      const parser = parserFactory.stringParser();
      strictEqual(parser.transform('hello'), 'hello');
    });

    it('should convert number to string', () => {
      const parser = parserFactory.stringParser();
      strictEqual(parser.transform(42), '42');
    });

    it('should convert boolean to string', () => {
      const parser = parserFactory.stringParser();
      strictEqual(parser.transform(true), 'true');
      strictEqual(parser.transform(false), 'false');
    });

    it('should convert Buffer to string', () => {
      const parser = parserFactory.stringParser();
      const buffer = Buffer.from('hello', 'utf8');
      strictEqual(parser.transform(buffer), 'hello');
    });

    it('should convert bigint to string', () => {
      const parser = parserFactory.stringParser();
      strictEqual(parser.transform(BigInt(12345)), '12345');
    });
  });

  describe('ofRawString', () => {
    it('should convert value string without trimming', () => {
      const parser = parserFactory.ofRawString();
      strictEqual(parser.transform('  hello  '), '  hello  ');
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofRawString();
      strictEqual(parser.transform(undefined), undefined);
    });

    it('should return undefined for null', () => {
      const parser = parserFactory.ofRawString();
      strictEqual(parser.transform(null as unknown as string), undefined);
    });

    it('should convert number input', () => {
      const parser = parserFactory.ofRawString();
      strictEqual(parser.transform(42), '42');
    });

    it('should convert Buffer input', () => {
      const parser = parserFactory.ofRawString();
      const buffer = Buffer.from('buffer', 'utf8');
      strictEqual(parser.transform(buffer), 'buffer');
    });
  });

  describe('ofString', () => {
    it('should trim and convert string', () => {
      const parser = parserFactory.ofString();
      strictEqual(parser.transform('  hello  '), 'hello');
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofString();
      strictEqual(parser.transform(''), undefined);
    });

    it('should return empty string for whitespace only', () => {
      const parser = parserFactory.ofString();
      strictEqual(parser.transform('   '), '');
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofString();
      strictEqual(parser.transform(undefined), undefined);
    });

    it('should convert and trim number', () => {
      const parser = parserFactory.ofString();
      strictEqual(parser.transform('  42  '), '42');
    });
  });

  describe('booleanParser', () => {
    it('should parse boolean true', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(true), true);
      strictEqual(parser.transform(false), false);
    });

    it('should parse number 1 as true', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(1), true);
      strictEqual(parser.transform(0), false);
      strictEqual(parser.transform(42), false);
    });

    it('should parse bigint 1n as true', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(BigInt(1)), true);
      strictEqual(parser.transform(BigInt(0)), false);
      strictEqual(parser.transform(BigInt(42)), false);
    });

    it('should parse string "true" case-insensitive', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform('true'), true);
      strictEqual(parser.transform('TRUE'), true);
      strictEqual(parser.transform('True'), true);
      strictEqual(parser.transform('1'), true);
      strictEqual(parser.transform('false'), false);
      strictEqual(parser.transform('FALSE'), false);
      strictEqual(parser.transform('0'), false);
    });

    it('should parse Buffer true', () => {
      const parser = parserFactory.booleanParser();
      const trueBuffer = Buffer.from('true', 'utf8');
      const falseBuffer = Buffer.from('false', 'utf8');
      strictEqual(parser.transform(trueBuffer), true);
      strictEqual(parser.transform(falseBuffer), false);
    });
  });

  describe('ofBoolean', () => {
    it('should parse trimmed string boolean', () => {
      const parser = parserFactory.ofBoolean();
      strictEqual(parser.transform('  true  '), true);
      strictEqual(parser.transform('  false  '), false);
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofBoolean();
      strictEqual(parser.transform(''), undefined);
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofBoolean();
      strictEqual(parser.transform(undefined), undefined);
    });
  });

  describe('numberParser', () => {
    it('should parse number', () => {
      const parser = parserFactory.numberParser();
      strictEqual(parser.transform(42), 42);
      strictEqual(parser.transform(3.14), 3.14);
    });

    it('should convert bigint to number', () => {
      const parser = parserFactory.numberParser();
      strictEqual(parser.transform(BigInt(42)), 42);
    });

    it('should parse string number', () => {
      const parser = parserFactory.numberParser();
      strictEqual(parser.transform('42'), 42);
      strictEqual(parser.transform('3.14'), 3.14);
    });

    it('should parse Buffer number', () => {
      const parser = parserFactory.numberParser();
      const buffer = Buffer.from('42', 'utf8');
      strictEqual(parser.transform(buffer), 42);
    });

    it('should handle NaN for invalid input', () => {
      const parser = parserFactory.numberParser();
      strictEqual(Number.isNaN(parser.transform('invalid')), true);
    });
  });

  describe('ofNumber', () => {
    it('should parse trimmed string number', () => {
      const parser = parserFactory.ofNumber();
      strictEqual(parser.transform('  42  '), 42);
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofNumber();
      strictEqual(parser.transform(''), undefined);
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofNumber();
      strictEqual(parser.transform(undefined), undefined);
    });
  });

  describe('bigIntParser', () => {
    it('should parse bigint', () => {
      const parser = parserFactory.bigIntParser();
      strictEqual(parser.transform(BigInt(42)), BigInt(42));
    });

    it('should convert number to bigint', () => {
      const parser = parserFactory.bigIntParser();
      strictEqual(parser.transform(42), BigInt(42));
    });

    it('should parse string bigint', () => {
      const parser = parserFactory.bigIntParser();
      strictEqual(parser.transform('12345'), BigInt(12345));
    });

    it('should parse Buffer bigint', () => {
      const parser = parserFactory.bigIntParser();
      const buffer = Buffer.from('42', 'utf8');
      strictEqual(parser.transform(buffer), BigInt(42));
    });

    it('should handle other types via toString', () => {
      const parser = parserFactory.bigIntParser();
      const obj = { toString: (): string => '100' };
      strictEqual(parser.transform(obj as unknown as string), BigInt(100));
    });
  });

  describe('ofBigInt', () => {
    it('should parse trimmed string bigint', () => {
      const parser = parserFactory.ofBigInt();
      strictEqual(parser.transform('  42  '), BigInt(42));
    });

    it('should return undefined for empty string', () => {
      const parser = parserFactory.ofBigInt();
      strictEqual(parser.transform(''), undefined);
    });

    it('should return undefined for undefined', () => {
      const parser = parserFactory.ofBigInt();
      strictEqual(parser.transform(undefined), undefined);
    });
  });

  describe('trim', () => {
    it('should trim whitespace', () => {
      strictEqual(parserFactory.trim('  hello  '), 'hello');
      strictEqual(parserFactory.trim('hello'), 'hello');
      strictEqual(parserFactory.trim('  '), '');
    });

    it('should trim Buffer', () => {
      const buffer = Buffer.from('  hello  ', 'utf8');
      strictEqual(parserFactory.trim(buffer), 'hello');
    });

    it('should convert non-string to string and trim', () => {
      strictEqual(parserFactory.trim(42), '42');
    });
  });

  describe('string', () => {
    it('should apply parser to string conversion', () => {
      const stringToNumber: { transform: (s: string) => number } = {
        transform: (s: string) => parseInt(s, 10)
      };
      const parser = parserFactory.string(stringToNumber);
      strictEqual(parser.transform('42'), 42);
      strictEqual(parser.transform(42), 42);
    });

    it('should work with complex parser', () => {
      const stringToArray: { transform: (s: string) => string[] } = {
        transform: (s: string) => s.split(',')
      };
      const parser = parserFactory.string(stringToArray);
      deepStrictEqual(parser.transform('a,b,c'), ['a', 'b', 'c']);
    });
  });

  describe('ofTrimAndSkipEmpty', () => {
    it('should trim and skip empty', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      strictEqual(parser.transform('  42  '), 42);
      strictEqual(parser.transform(''), undefined);
      strictEqual(parser.transform('   '), 0);
    });

    it('should return undefined for undefined', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      strictEqual(parser.transform(undefined as unknown as string), undefined);
    });

    it('should handle null as undefined', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      strictEqual(parser.transform(null as unknown as string), undefined);
    });

    it('should work with Buffer input', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      const buffer = Buffer.from('  42  ', 'utf8');
      strictEqual(parser.transform(buffer), 42);
    });

    it('should skip empty Buffer', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      const emptyBuffer = Buffer.from('', 'utf8');
      strictEqual(parser.transform(emptyBuffer), undefined);
    });

    it('should handle non-string non-Buffer types as not empty', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofTrimAndSkipEmpty(numberParser);
      strictEqual(parser.transform(42), 42);
      strictEqual(Number.isNaN(parser.transform(true) as number), true);
    });
  });

  describe('ofList', () => {
    it('should parse delimited list', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      const result = parser.transform('1,2,3');
      deepStrictEqual(result, [1, 2, 3]);
    });

    it('should handle spaces around delimiter', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform('  a  ,  b  ,  c  ');
      deepStrictEqual(result, ['a', 'b', 'c']);
    });

    it('should skip undefined values from parser', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform('a,,c');
      deepStrictEqual(result, ['a', 'c']);
    });

    it('should return undefined for empty input', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      strictEqual(parser.transform(''), undefined);
    });

    it('should parse whitespace to number', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      deepStrictEqual(parser.transform('   '), [0]);
    });

    it('should handle different delimiters', () => {
      const numberParser = parserFactory.numberParser();
      const pipeParser = parserFactory.ofList(numberParser, '|');
      deepStrictEqual(pipeParser.transform('1|2|3'), [1, 2, 3]);
    });

    it('should handle semicolon delimiter', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ';');
      deepStrictEqual(parser.transform('a;b;c'), ['a', 'b', 'c']);
    });

    it('should handle spaces in list', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const result = parser.transform(' , , ');
      deepStrictEqual(result, ['']);
    });

    it('should work with boolean parser', () => {
      const booleanParser = parserFactory.booleanParser();
      const listParser = parserFactory.ofList(booleanParser, ',');
      deepStrictEqual(listParser.transform('true,false,true'), [true, false, true]);
    });

    it('should return undefined for whitespace only Buffer', () => {
      const numberParser = parserFactory.numberParser();
      const parser = parserFactory.ofList(numberParser, ',');
      const buffer = Buffer.from('   ', 'utf8');
      deepStrictEqual(parser.transform(buffer), [0]);
    });

    it('should handle list with Buffer input', () => {
      const stringParser = parserFactory.ofString();
      const parser = parserFactory.ofList(stringParser, ',');
      const buffer = Buffer.from('a,b,c', 'utf8');
      deepStrictEqual(parser.transform(buffer), ['a', 'b', 'c']);
    });
  });

  describe('Parser edge cases', () => {
    it('should handle boolean parser with non-standard object toString', () => {
      const parser = parserFactory.booleanParser();
      const obj = { toString: (): string => 'true' };
      strictEqual(parser.transform(obj as unknown as string), true);
    });

    it('should handle number parser with object toString', () => {
      const parser = parserFactory.numberParser();
      const obj = { toString: (): string => '42' };
      strictEqual(parser.transform(obj as unknown as string), 42);
    });

    it('should handle false boolean strings', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform('FALSE'), false);
      strictEqual(parser.transform('false'), false);
      strictEqual(parser.transform('FaLsE'), false);
    });

    it('should handle number parsing with decimals', () => {
      const parser = parserFactory.numberParser();
      strictEqual(parser.transform('-3.14'), -3.14);
      ok(Math.abs(parser.transform('-3.14') - -3.14) < 0.02);
    });

    it('should handle bigint parser with large numbers', () => {
      const parser = parserFactory.bigIntParser();
      const large = BigInt('99999999999999999999999999999');
      strictEqual(parser.transform(large), large);
    });

    it('should handle bigint parser with negative numbers', () => {
      const parser = parserFactory.bigIntParser();
      strictEqual(parser.transform('-999'), BigInt(-999));
    });

    it('should handle string parser with special characters', () => {
      const parser = parserFactory.stringParser();
      const special = 'hello!@#$%^&*()_+-={}[]|:;<>?,./';
      strictEqual(parser.transform(special), special);
    });

    it('should handle ofList with single element', () => {
      const parser = parserFactory.ofList(parserFactory.stringParser(), ',');
      deepStrictEqual(parser.transform('single'), ['single']);
    });

    it('should handle Buffer with special characters', () => {
      const buffer = Buffer.from('special!@#$', 'utf8');
      const parser = parserFactory.stringParser();
      strictEqual(parser.transform(buffer), 'special!@#$');
    });

    it('should handle number 0 as falsy in boolean parser', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(0), false);
    });

    it('should handle negative numbers in boolean parser', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(-1), false);
      strictEqual(parser.transform(-5), false);
    });

    it('should handle bigint 0 as falsy', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(BigInt(0)), false);
    });

    it('should handle bigint 2 as falsy', () => {
      const parser = parserFactory.booleanParser();
      strictEqual(parser.transform(BigInt(2)), false);
    });
  });
});