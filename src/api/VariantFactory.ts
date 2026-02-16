import { Variant, Config as VariantConfig } from "@jonloucks/variants-ts/api/Variant";
import { guardFunctions, RequiredType } from "@jonloucks/variants-ts/api/Types";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";

/**
 * Interface for creating variants based on a configuration. 
 * Implementations of this interface are responsible for generating variants according to the
 * provided configuration and returning them as Variant instances.
 */
export interface VariantFactory {

  /**
   * Creates a variant based on the provided configuration.
   * 
   * @param config - The configuration for the Variant to be created.
   * @returns A new Variant instance representing the generated variant.
   * @throws IllegalArgumentException if the provided configuration is invalid.
   * @throws VariantException if there is an error during variant creation.
   */
  createVariant<T>(config?: VariantConfig<T>): RequiredType<Variant<T>>;
}

/**
 * Determine if an instance implements VariantFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements VariantFactory
 */
export function guard(instance: unknown): instance is RequiredType<VariantFactory> {
  return guardFunctions(instance, 'createVariant');
}

/**
 * The VariantFactory contract
 */
export const CONTRACT: Contract<VariantFactory> = createContract({
  name: "VariantFactory",
  test: guard
});