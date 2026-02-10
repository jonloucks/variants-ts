import { Source } from "@jonloucks/variants-ts/api/Source";

import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { create as createContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { Type as SupplierType } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { guardFunctions, RequiredType, ValueType } from "@jonloucks/variants-ts/api/Types";

export interface Config {
  contracts?: Contracts;
}

/**
 * Interface for creating sources based on a configuration. 
 * Implementations of this interface are responsible for generating sources according to the
 * provided configuration and returning them as Source instances.
 */
export interface SourceFactory {

  createKeySource(key: string, supplier: SupplierType<ValueType>): RequiredType<Source>;

  createLookupSource(lookup: (key: string) => ValueType ): RequiredType<Source>;

  createMapSource(map: Map<string, ValueType>): RequiredType<Source>;

  createRecordSource(record: Record<string, ValueType>): RequiredType<Source>;

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