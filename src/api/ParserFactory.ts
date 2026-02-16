import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Transform } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * Responsibility: Parsers to assist source text conversion for a Variant
 */
export interface ParserFactory {

  /**
   * @returns a parser that converts a valid text into a String
   */
  stringParser(): Transform<ValueType, string>;

  /**
   * No trimming or skipping empty values
   * @returns a text conversion to a String instance
   */
  ofRawString(): Transform<OptionalType<ValueType>, OptionalType<string>>;

  /**
   * Input is trimmed and empty values are skipped
   *
   * @returns a text conversion to a String instance
   */
  ofString(): Transform<OptionalType<ValueType>, OptionalType<string>>;

  /**
   * @returns a parser that converts a valid text value into a Boolean instance
   */
  booleanParser(): Transform<RequiredType<ValueType>, RequiredType<boolean>>

  /**
   * Input is trimmed and empty values are skipped
   *
   * @returns a text conversion to a Boolean instance
   */
  ofBoolean(): Transform<OptionalType<ValueType>, OptionalType<boolean>>;

  /**
   * @returns a parser that converts a valid text value into a Float instance
   */
  numberParser(): Transform<RequiredType<ValueType>, RequiredType<number>>;

  /**
   * Input is trimmed and empty values are skipped
   *
   * @returns a text conversion to a Float instance
   */
  ofNumber(): Transform<OptionalType<ValueType>, OptionalType<number>>;

  /**
   * @returns a parser that converts a valid text value into a BigInt instance
   */
  bigIntParser(): Transform<RequiredType<ValueType>, RequiredType<bigint>>;

  /**
   * Input is trimmed and empty values are skipped
   *
   * @returns a text conversion to a BigInt instance
   */
  ofBigInt(): Transform<OptionalType<ValueType>, OptionalType<bigint>>;

  /**
   * trim leading and trailing white space
   *
   * @param text the text to trim
   * @returns the trimmed text
   */
  trim(text: RequiredType<ValueType>): RequiredType<ValueType>;

  /**
   * A parser that converts text to a String
   *
   * @param parser the parser that accepts the String
   * @returns the new parser
   * @param <T> the return type of the given parser
   */
  string<T>(parser: Transform<string, T>): Transform<ValueType, T>;

  /**
   * Text to parser helper.
   * Trims text
   * Skips empty values
   *
   * @param parser the delegate parser
   * @returns the new 'of' function
   * @param <T> the return type of the given parser
   */
  ofTrimAndSkipEmpty<T>(parser: Transform<ValueType, T>): Transform<ValueType, OptionalType<T>>;

  /**
   * Split the input text and parse each part into a list
   *
   * @param of the delegate text to value function
   * @param delimiter the string delimiter.
   * @returns the new parser
   * @param <T> the return type of the given parser
   */
  ofList<T>(of: Transform<ValueType, OptionalType<T>>, delimiter: string): Transform<ValueType, OptionalType<Array<T>>>;
};

/**
 * Determine if an instance implements ParserFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements ParserFactory
 */
export function guard(instance: unknown): instance is RequiredType<ParserFactory> {
  return guardFunctions(instance, 'stringParser', 'ofRawString', 'ofString', 'booleanParser', 'ofBoolean', 'numberParser', 'ofNumber', 'bigIntParser', 'ofBigInt', 'trim', 'string', 'ofTrimAndSkipEmpty', 'ofList');
}

/**
 * The ParserFactory contract
 */
export const CONTRACT: Contract<ParserFactory> = createContract({
  name: "ParserFactory",
  test: guard
});