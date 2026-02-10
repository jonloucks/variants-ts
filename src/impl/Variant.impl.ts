import { isPresent, OptionalType, RequiredType, UndefinedType } from "@jonloucks/contracts-ts/api/Types";
import { fromType, Transform } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { ValueType } from "@jonloucks/variants-ts/api/Types";
import { Variant, Config as VariantConfig } from "@jonloucks/variants-ts/api/Variant";

/**
 * Implementation of the Variant interface.
 *
 * @param <T> the type of configuration value
 */
export function create<T>(config?: VariantConfig<T>): RequiredType<Variant<T>> {
  return VariantImpl.createInternal(config);
};

// ---- Implementation details below ----

class VariantImpl<T> implements Variant<T> {

  get keys(): readonly string[] {
    return this.#keys;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get fallback(): UndefinedType<T> {
    return this.#fallback;
  }

  get link(): UndefinedType<Variant<T>> {
    return this.#link;
  }

  of(valueText: OptionalType<ValueType>): OptionalType<T> {
    return this.#of.transform(valueText);
  }

  toString(): string {
    return this.name === "" ? "Variant" : `Variant(name=${this.name})`;
  }

  static createInternal<T>(config?: VariantConfig<T>): RequiredType<Variant<T>> {
    return new VariantImpl<T>(config);
  }

  private constructor(config?: VariantConfig<T>) {
    const validConfig = config ?? {};
    this.#name = validConfig.name ?? "";
    this.#description = validConfig.description ?? "";
    this.#fallback = validConfig.fallback ?? undefined;
    this.#link = validConfig.link ?? undefined;
    this.#keys = validConfig.keys ?? [];
    this.#of = compileOf(validConfig);
  }

  readonly #keys: readonly string[];
  readonly #name: string;
  readonly #description: string;
  readonly #fallback: T | undefined;
  readonly #link: Variant<T> | undefined;
  readonly #of: Transform<OptionalType<ValueType>, OptionalType<T>>;
}

function compileOf<T>(config: VariantConfig<T>): Transform<OptionalType<ValueType>, OptionalType<T>> {
  if (isPresent(config.of)) {
    return fromType(config.of!)
  } else if (isPresent(config.parser)) {
    return compileUsingParser();
  } else {
    return compilePassThru();
  }

  function compileUsingParser(): Transform<OptionalType<ValueType>, OptionalType<T>> {
    const parserTransform: Transform<RequiredType<ValueType>, RequiredType<T>> = fromType(config.parser!);
    return {
      transform: (input: OptionalType<ValueType>): OptionalType<T> => {
        if (isPresent(input)) {
          return parserTransform.transform(input);
        }
        return input;
      }
    };
  }

  function compilePassThru(): Transform<OptionalType<ValueType>, OptionalType<T>> {
    return {
      transform: (input: OptionalType<ValueType>): OptionalType<T> => {
        return input as unknown as OptionalType<T>;
      }
    };
  }
};