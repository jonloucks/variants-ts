import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";
import { Type as TransformType } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * Responsibility: Configuration for creating a new Variant.
 *
 * @param <T> type Variant value type
 */
export interface Config<T> {

  /**
   * The primary use case of getting a property value by key
   * @returns the ordered list of keys used to search for values.
   */
  keys?: readonly string[];

  /**
   * Note: The name is not used to look up values!
   * @returns The user facing name of this Variant
   */
  name?: string;

  /**
   * @returns the optional description
   */
  description?: string;

  /**
   * @returns the optional fallback value. aka default value
   */
  fallback?: T;

  /**
   * Links can be helpful when a Variant which does not
   * have an explicit value can default the value of another Variant.
   * @returns The optional link to another Variant
   */
  link?: Variant<T>;

  /**
   * @returns The parser used to convert value text into a Variant value
   */
  parser?: TransformType<RequiredType<ValueType>, RequiredType<T>>;

  /**
   * @returns The transform used to convert value text into a Variant value
   */
  of?: TransformType<OptionalType<ValueType>, OptionalType<T>>;
};

/**
* Responsibility: Provide information on how to retrieve a configuration value.
*
* @param <T> the type of configuration value
*/
export interface Variant<T> {

  /**
   * Note: The name is not used to look up values!
   * Note: if name is not set the first key might be used
   * @returns The user facing name of this Variant
   */
  get name(): string;

  /**
   * The primary use case of getting a property value by key
   * @returns the ordered list of keys used to search for values.
   */
  get keys(): readonly string[];

  /**
   * @returns the optional description
   */
  get description(): string;

  /**
   * @returns the optional fallback value. aka default value
   */
  get fallback(): OptionalType<T>;

  /**
   * Links can be helpful when a Variant which does not
   * have an explicit value can default the value of another Variant.
   * @returns The optional link to another Variant
   */
  get link(): OptionalType<Variant<T>>;

  /**
   * Parses the text into an Optional Variant value
   * Note: Required if keys are used to retrieve a value.
   * Note: implementations of this function should return empty on null values.
   * @param valueText the text to be parsed
   * @returns the optional Variant value
   */
  of(valueText: ValueType): OptionalType<T>;
}

/**
 * Determine if an instance implements Variant
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Variant
 */
export function guard<T>(instance: unknown): instance is RequiredType<Variant<T>> {
  // most unique are listed first to fail fast
  return guardFunctions(instance, 'of', 'link', 'name', 'keys', 'description', 'fallback');
}

/**
 * Check that an instance implements Variant
 * 
 * @param instance the instance to check
 * @returns the instance as Variant<T>
 * @throws IllegalArgumentException when the instance does not implement Variant<T>
 */
export function check<T>(instance: unknown): RequiredType<Variant<T>> {
  if (guard<T>(instance)) {
    return instance;
  }
  throw new IllegalArgumentException('Variant must be present.');
}