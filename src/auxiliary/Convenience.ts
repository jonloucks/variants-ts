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

import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Variant, Config as VariantConfig } from "@jonloucks/variants-ts/api/Variant";
import { Environment, Config as EnvironmentConfig } from "@jonloucks/variants-ts/api/Environment";
import { Type as SupplierType } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { CONTRACTS } from "@jonloucks/contracts-ts";
import { VERSION } from "@jonloucks/variants-ts";
import { EnvironmentFactory, CONTRACT as ENVIRONMENT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { VariantFactory, CONTRACT as VARIANT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/VariantFactory";
import { SourceFactory, CONTRACT as SOURCE_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/SourceFactory";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

export type {
  Environment,
  EnvironmentConfig,
  EnvironmentFactory,
  OptionalType,
  RequiredType,
  Source,
  SourceFactory,
  SupplierType,
  ValueType,
  Variant,
  VariantConfig,
  VariantFactory,
};

export {
  VERSION,
  CONTRACTS,
  createVariant,
  createEnvironment,
  createKeySource,
  createLookupSource,
  createMapSource,
  createRecordSource,
  createProcessSource
};

const ENVIRONMENT_FACTORY: RequiredType<EnvironmentFactory> = CONTRACTS.enforce(ENVIRONMENT_FACTORY_CONTRACT);

const VARIANT_FACTORY: RequiredType<VariantFactory> = CONTRACTS.enforce(VARIANT_FACTORY_CONTRACT);

const SOURCE_FACTORY: RequiredType<SourceFactory> = CONTRACTS.enforce(SOURCE_FACTORY_CONTRACT);

function createVariant<T>(config?: VariantConfig<T>): RequiredType<Variant<T>> {
  return VARIANT_FACTORY.createVariant(config);
}

function createEnvironment(config?: EnvironmentConfig): RequiredType<Environment> {
  return ENVIRONMENT_FACTORY.createEnvironment(config);
}

function createKeySource(key: string, supplier: SupplierType<ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createKeySource(key, supplier);
}

function createLookupSource(lookup: (key: string) => ValueType): RequiredType<Source> {
  return SOURCE_FACTORY.createLookupSource(lookup);
}

function createMapSource(map: Map<string, ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createMapSource(map);
}

function createRecordSource(record: Record<string, ValueType>): RequiredType<Source> {
  return SOURCE_FACTORY.createRecordSource(record);
}

function createProcessSource(): RequiredType<Source> {
  return SOURCE_FACTORY.createProcessSource();
}