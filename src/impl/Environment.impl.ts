import { isPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Environment, Config as EnvironmentConfig } from "@jonloucks/variants-ts/api/Environment";
import { Source } from "@jonloucks/variants-ts/api/Source";
import { check, Variant } from "@jonloucks/variants-ts/api/Variant";
import { VariantException } from "@jonloucks/variants-ts/api/VariantException";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * creation of Environment instances.
 * 
 * @param config optional configuration for the Environment
 * @returns an Environment instance based on the provided configuration
 */
export function create(config?: EnvironmentConfig): RequiredType<Environment> {
  return EnvironmentImpl.createInternal(config);
}

// ---- Implementation details below ----

class EnvironmentImpl implements Environment {

  findVariance<T>(variant: Variant<T>): OptionalType<T> {
    const validVariant: RequiredType<Variant<T>> = check(variant);
    for (const source of this.#sources) {
      const optionalVariance: OptionalType<T> = this.findInSource(validVariant, source);
      if (isPresent(optionalVariance)) {
        return optionalVariance;
      }
    }
    return this.findFirstFallback(validVariant);
  }

  getVariance<T>(variant: Variant<T>): RequiredType<T> {
    const found: OptionalType<T> = this.findVariance(variant);
    if (isPresent(found)) {
      return found;
    }
    throw new VariantException(`Variance not found: ${variant.name}.`);
  }

  private findInSource<T>(variant: Variant<T>, source: Source): OptionalType<T> {
    for (const key of variant.keys) {
      const optionalText: OptionalType<ValueType> = source.getSourceValue(key);
      if (isPresent(optionalText)) {
        const optionalVariance: OptionalType<T> = variant.of(optionalText);
        if (isPresent(optionalVariance)) {
          return optionalVariance;
        }
      }
    }
    return this.findLinkInSource(variant, source);
  }

  private findFirstFallback<T>(variant: Variant<T>): OptionalType<T> {
    const optionalFallback: OptionalType<T> = variant.fallback;
    if (isPresent(optionalFallback)) {
      return optionalFallback;
    }
    const link: OptionalType<Variant<T>> = variant.link;
    if (isPresent(link)) {
      return this.findFirstFallback(link);
    }
    return undefined;
  }

  private findLinkInSource<T>(variant: Variant<T>, source: Source): OptionalType<T> {
    if (isPresent(variant.link)) {
      const match: OptionalType<T> = this.findInSource(variant.link, source);
      if (isPresent(match)) {
        return match;
      }
    }
    return undefined;
  }

  static createInternal(config?: EnvironmentConfig): Environment {
    return new EnvironmentImpl(config);
  }

  private constructor(config?: EnvironmentConfig) {
    this.#sources = config?.sources ?? [];
  }

  readonly #sources: readonly Source[];
}
