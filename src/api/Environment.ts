import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { Variant } from "@jonloucks/variants-ts/api/Variant";

/**
   * Responsibility: Configuration for creating a new Environment
   */
export interface Config {

  /**
   * @return the list of sources. An empty list is allowed.
   */
  sources?: readonly Source[];
};

/**
 * Responsibility: Locating variances from multiple sources.
 * <p>
 * A breadth first search into each source looking for provided value for a specific Variant
 * Each key in the Variant is search in order of insertion.
 * Fallback values (defaults) are only used if no values are found in any of the sources.
 * </p>
 */
export interface Environment {

  /**
   * Find a variance if it exists.
   *
   * @param variant the Variant
   * @return the optional value
   * @param <T> the type of variance value
   * @throws IllegalArgumentException when arguments are null or invalid
   */
  findVariance<T>(variant: Variant<T>): OptionalType<T>;

  /**
   * Get required variance or throw an exception.
   *
   * @param variant the Variant
   * @return the variance
   * @throws VariantException if not found
   * @param <T> the type of variance value
   * @throws IllegalArgumentException when arguments are null or invalid
   */
  getVariance<T>(variant: Variant<T>): RequiredType<T>;
}

/**
 * Determine if an instance implements VariantSource
 * 
 * @param instance the instance to check
 * @returns true if the instance implements VariantSource
 */
export function guard(instance: unknown): instance is RequiredType<Environment> {
  return guardFunctions(instance, 'getVariance', 'findVariance');
}

