/**
 * @module Convenience
 * @description
 * 
 * This module provides convenience functions for creating auxiliary types
 * using the shared global CONTRACTS instance. For performance-sensitive
 * applications, consider using factory instances directly.
 * 
 * Internal Note: To avoid circular dependencies, other modules should not
 * import from this module. Instead, they should import directly from the
 * source modules of the auxiliary types. 
 */

import { CONTRACTS } from "@jonloucks/contracts-ts";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Type as SupplierType } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { VERSION } from "@jonloucks/variants-ts";
import { Environment, Config as EnvironmentConfig } from "@jonloucks/variants-ts/api/Environment";
import { CONTRACT as ENVIRONMENT_FACTORY_CONTRACT, EnvironmentFactory } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { CONTRACT as SOURCE_FACTORY_CONTRACT, SourceFactory } from "@jonloucks/variants-ts/api/SourceFactory";
import { ValueType } from "@jonloucks/variants-ts/api/Types";
import { Variant, Config as VariantConfig } from "@jonloucks/variants-ts/api/Variant";
import { CONTRACT as VARIANT_FACTORY_CONTRACT, VariantFactory } from "@jonloucks/variants-ts/api/VariantFactory";

const ENVIRONMENT_FACTORY: RequiredType<EnvironmentFactory> = CONTRACTS.enforce(ENVIRONMENT_FACTORY_CONTRACT);

const VARIANT_FACTORY: RequiredType<VariantFactory> = CONTRACTS.enforce(VARIANT_FACTORY_CONTRACT);

const SOURCE_FACTORY: RequiredType<SourceFactory> = CONTRACTS.enforce(SOURCE_FACTORY_CONTRACT);

/**
 * Creates a variant based on the provided configuration.
 * 
 * @param config - The configuration for the Variant to be created.
 * @returns A new Variant instance representing the generated variant.
 * @throws IllegalArgumentException if the provided configuration is invalid.
 * @throws VariantException if there is an error during variant creation.
 */
function createVariant<T>(config?: VariantConfig<T>): RequiredType<Variant<T>> {
  return VARIANT_FACTORY.createVariant(config);
}

/**
 * Creates an environment based on the provided configuration.
 * 
 * @param config - The configuration for the Environment to be created.
 * @returns An Environment instance representing the generated environment.
 */
function createEnvironment(config?: EnvironmentConfig): RequiredType<Environment> {
  return ENVIRONMENT_FACTORY.createEnvironment(config);
}

/**
 * Creates a source that retrieves values based on a key and a supplier function.
 * 
 * @param key the key to retrieve values for
 * @param supplier a function that supplies values based on the provided key
 * @returns a Source instance that retrieves values using the provided key and supplier function
 */
function createKeySource(key: string, supplier: SupplierType<ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createKeySource(key, supplier);
}

/**
 * Creates a source that retrieves values based on a key and a lookup function.
 * 
 * @param lookup a function that retrieves values based on a provided key
 * @returns a Source instance that retrieves values using the provided lookup function
*/
function createLookupSource(lookup: (key: string) => ValueType): RequiredType<Source> {
  return SOURCE_FACTORY.createLookupSource(lookup);
}

/**
 * Creates a source that retrieves values based on a Map of keys and values.
 * 
 * @param map a Map containing keys and their corresponding values
 * @returns a Source instance that retrieves values using the provided Map
 */
function createMapSource(map: Map<string, ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createMapSource(map);
}

/**
 * Creates a source that retrieves values based on a Record of keys and values.
 * 
 * @param record a Record containing keys and their corresponding values
 * @returns a Source instance that retrieves values using the provided Record
 */
function createRecordSource(record: Record<string, ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createRecordSource(record);
}

/**
 * Creates a source that retrieves values from the process environment variables.
 * 
 * @returns a Source instance that retrieves values from the process environment variables
 */
function createProcessSource(): RequiredType<Source> {
  return SOURCE_FACTORY.createProcessSource();
}

export {
  CONTRACTS,
  createEnvironment,
  createKeySource,
  createLookupSource,
  createMapSource,
  createProcessSource,
  createRecordSource,
  createVariant, VERSION, type Environment,
  type EnvironmentConfig,
  type EnvironmentFactory,
  type OptionalType,
  type RequiredType,
  type Source,
  type SourceFactory,
  type SupplierType,
  type ValueType,
  type Variant,
  type VariantConfig,
  type VariantFactory
};
