import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * Source represents a source of variant information, such as a file, database, or API.
 */
export interface Source {

  /**
   * Get the source value value for a given key
   * 
   * @param key the key to get the source value value for
   * @returns the source value value for the given key, or undefined if not found
   */
  getSourceValue(key: string): OptionalType<ValueType>;
}

/**
 * Determine if an instance implements Source
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Source
 */
export function guard(instance: unknown): instance is RequiredType<Source> {
  return guardFunctions(instance, 'getSourceValue');
}