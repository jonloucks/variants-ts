import { Variant, Config as VariantConfig } from "@jonloucks/variants-ts/api/Variant";
import { VariantFactory } from "@jonloucks/variants-ts/api/VariantFactory";
import { RequiredType } from "@jonloucks/variants-ts/api/Types";

import { create as createVariantImpl } from "./Variant.impl.js";

/**
 * Factory function to create a VariantFactory instance.
 * 
 * @returns an instance of VariantFactory.
 */
export function create(): RequiredType<VariantFactory> {
  return VariantFactoryImpl.createInternal();
}

// ---- Implementation details below ----

class VariantFactoryImpl implements VariantFactory {

  createVariant<T>(config?: VariantConfig<T>): RequiredType<Variant<T>> {
    return createVariantImpl(config);
  }

  static createInternal(): VariantFactory {
    return new VariantFactoryImpl();
  }

  private constructor() {}
}