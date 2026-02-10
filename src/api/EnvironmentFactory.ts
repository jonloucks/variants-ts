import { Environment, Config as EnvironmentConfig } from "@jonloucks/variants-ts/api/Environment";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";

/**
 * Interface for creating environments based on a configuration. 
 * Implementations of this interface are responsible for generating environments according to the
 * provided configuration and returning them as Environment instances.
 */
export interface EnvironmentFactory {

  /**
   * Creates an environment based on the provided configuration.
   * 
   * @param config - The configuration for the Environment to be created.
   * @returns An Environment instance representing the generated environment.
   */
  createEnvironment(config?: EnvironmentConfig): RequiredType<Environment>;
}

/**
 * Determine if an instance implements EnvironmentFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements EnvironmentFactory
 */
export function guard(instance: unknown): instance is RequiredType<EnvironmentFactory> {
  return guardFunctions(instance, 'createEnvironment');
}

/**
 * The EnvironmentFactory contract
 */
export const CONTRACT: Contract<EnvironmentFactory> = createContract({
  name: "EnvironmentFactory",
  test: guard
});
