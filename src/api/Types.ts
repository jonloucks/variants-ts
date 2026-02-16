export type { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

export { guardFunctions, isNotPresent, isNumber, isPresent, isString } from "@jonloucks/contracts-ts/api/Types";

/**
 * ValueType represents the possible types of values that can be used in the variants-ts library.
 * It includes primitive types such as string, Buffer, boolean, number, bigint, symbol, and undefined.
 */
export type ValueType = string | Buffer | boolean | number | bigint | symbol | undefined;