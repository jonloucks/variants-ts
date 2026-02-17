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

/**
 * Transforms a required input value into a required output value.
 * This is used when a parser function is provided in the configuration.
 * The parser is expected to throw an error if the input value cannot be parsed,
 * which will be handled by the caller.
 */
type ParserTransform<T> = Transform<RequiredType<ValueType>, RequiredType<T>>;

/**
 * Transforms an optional input value into an optional output value.
 * This is used when a parser function is not provided in the configuration.
 * The input value is returned as-is if it is not present.
 */
type OfTransform<T> = Transform<OptionalType<ValueType>, OptionalType<T>>;

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
  readonly #of: OfTransform<T>;
}

function compileOf<T>(config: VariantConfig<T>): OfTransform<T> {
  if (isPresent(config.of)) {
    return fromType(config.of!)
  } else if (isPresent(config.parser)) {
    const parseValue: ParserTransform<T> = fromType(config.parser!);
    return {
      transform: (input: OptionalType<ValueType>): OptionalType<T> => {
        if (isPresent(input)) {
          return parseValue.transform(input);
        }
        return input;
      }
    };
  } else {
    return {
      transform: (input: OptionalType<ValueType>): OptionalType<T> => {
        return input as unknown as OptionalType<T>;
      }
    };
  }
};