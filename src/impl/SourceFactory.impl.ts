import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Type as SupplierType, toValue } from "@jonloucks/contracts-ts/auxiliary/Supplier";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { SourceFactory } from "@jonloucks/variants-ts/api/SourceFactory";
import { ValueType } from "@jonloucks/variants-ts/api/Types";
import { keyCheck, presentCheck } from "@jonloucks/variants-ts/auxiliary/Checks";

/**
 * Create a SourceFactory instance.
 * 
 * @returns the created SourceFactory instance
 */
export function create(): RequiredType<SourceFactory> {
  return SourceFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

class SourceFactoryImpl implements SourceFactory {

  createKeySource(key: string, supplier: SupplierType<ValueType>): RequiredType<Source> {
    const validKey: string = keyCheck(key);
    return {
      getSourceValue: (key: string) : ValueType => {
        if (validKey === keyCheck(key)) {
          return toValue(supplier);
        }
        return undefined;
      } 
    }
  }

  createLookupSource(lookup: (key: string) => ValueType): RequiredType<Source> {
    const validLookup: (key: string) => ValueType = presentCheck(lookup, "Lookup function must be present.");
    return {
      getSourceValue: (key: string) : ValueType => {
        return validLookup(keyCheck(key));
      } 
    }
  }

  createMapSource(map: Map<string, ValueType>): RequiredType<Source> {
    const validMap: Map<string, ValueType> = presentCheck(map, "Map must be present.");
    return {
      getSourceValue: (key: string) : ValueType => {
        return validMap.get(keyCheck(key));
      } 
    }
  }

  createRecordSource(record: Record<string, ValueType>): RequiredType<Source> {
    const validRecord: Record<string, ValueType> = presentCheck(record, "Record must be present.");
    return {
      getSourceValue: (key: string) : ValueType => {
        return validRecord[keyCheck(key)];
      } 
    }
  }

  createProcessSource(): RequiredType<Source> {
    return {
      getSourceValue: (key: string) : ValueType => {
        return process.env[keyCheck(key)];
      } 
    }
  }

  static internalCreate(): SourceFactory {
    return new SourceFactoryImpl();
  }

  private constructor() { }

}