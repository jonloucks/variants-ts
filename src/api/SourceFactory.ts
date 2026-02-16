import { Source } from "@jonloucks/variants-ts/api/Source";

import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { Type as SupplierType } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { guardFunctions, RequiredType, ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * The configuration for the SourceFactory contract. This interface defines the structure of the configuration object
 * that can be passed to the SourceFactory contract during installation. It may include properties such as custom
 * contracts or other settings that are necessary for the proper functioning of the SourceFactory.
 */
export interface Config {
  contracts?: Contracts;
}

/**
 * Interface for creating sources based on a configuration. 
 * Implementations of this interface are responsible for generating sources according to the
 * provided configuration and returning them as Source instances.
 */
export interface SourceFactory {

  /**
   * Creates a source that retrieves values based on a key and a supplier function.
   * 
   * @param key the key to retrieve values for
   * @param supplier a function that supplies values based on the provided key
   * @returns a Source instance that retrieves values using the provided key and supplier function
   */
  createKeySource(key: string, supplier: SupplierType<ValueType>): RequiredType<Source>;

  /**
   * Creates a source that retrieves values based on a key and a lookup function.
   * 
   * @param lookup a function that retrieves values based on a provided key
   * @returns a Source instance that retrieves values using the provided lookup function
  */
  createLookupSource(lookup: (key: string) => ValueType): RequiredType<Source>;

  /**
   * Creates a source that retrieves values based on a Map of keys and values.
   * 
   * @param map a Map containing keys and their corresponding values
   * @returns a Source instance that retrieves values using the provided Map
   */
  createMapSource(map: Map<string, ValueType>): RequiredType<Source>;

  /**
   * Creates a source that retrieves values based on a Record of keys and values.
   * 
   * @param record a Record containing keys and their corresponding values
   * @returns a Source instance that retrieves values using the provided Record
   */
  createRecordSource(record: Record<string, ValueType>): RequiredType<Source>;

  /**
   * Creates a source that retrieves values from the process environment variables.
   * @returns a Source instance that retrieves values from the process environment variables
   */
  createProcessSource(): RequiredType<Source>;
}

/**
 * Determine if an instance implements SourceFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements SourceFactory
 */
export function guard(instance: unknown): instance is RequiredType<SourceFactory> {
  return guardFunctions(instance,
    'createKeySource',
    'createLookupSource',
    'createMapSource',
    'createRecordSource',
    'createProcessSource'
  );
}

/**
 * The SourceFactory contract
 */
export const CONTRACT: Contract<SourceFactory> = createContract({
  name: "SourceFactory",
  test: guard
});