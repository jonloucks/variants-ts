import type { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { configCheck, illegalCheck, presentCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { ValueType } from "@jonloucks/variants-ts/api/Types";

/**
 * Responsibility: Checks for the variants-ts library.
 * <p>
 * This module provides various check functions that can be used throughout the variants-ts library to validate inputs,
 * configurations, and other values. These checks help ensure that the library functions correctly and that errors are
 * caught early in the development process.
 */
const valueCheck: <ValueType>(value: OptionalType<ValueType>)
  => RequiredType<ValueType>
  = <ValueType>(value: OptionalType<ValueType>) => {
    return presentCheck(value, "Raw type must be present.");
  }

/**
 * Check that a key is present and not empty.
 * <p>
 * @param value the value to check
 * @returns the value if it is present and not empty
 * @throws IllegalArgumentException if the value is not present or is empty
 */
const parserCheck: <T>(value: OptionalType<T>)
  => RequiredType<T>
  = <T>(value: OptionalType<T>) => {
    return presentCheck(value, "Parser must be present.");
  }

/**
 * Check that a value is not used.
 * <p>
 * @param value the value to check
 * @returns the value if it is not used
 * @throws IllegalArgumentException if the value is already used
 */
const keyCheck: (value: OptionalType<string>)
  => RequiredType<string>
  = (value: OptionalType<string>) => {
    return presentCheck(value, "Key must be present.");
  }

export {
  configCheck,
  illegalCheck,
  keyCheck,
  parserCheck,
  presentCheck,
  used,
  valueCheck, type OptionalType,
  type RequiredType,
  type ValueType
};




