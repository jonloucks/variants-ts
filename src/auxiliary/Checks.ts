import type { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { configCheck, illegalCheck, presentCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { ValueType as T } from "@jonloucks/variants-ts/api/Types";

export {
  configCheck,
  illegalCheck,
  parserCheck,
  presentCheck,
  used,
  valueCheck,
  keyCheck
};

export type {
  OptionalType, RequiredType, T as ValueType
};

const valueCheck: <ValueType>(value: OptionalType<ValueType>)
  => RequiredType<ValueType>
  = <ValueType>(value: OptionalType<ValueType>) => {
    return presentCheck(value, "Raw type must be present.");
  }

const parserCheck: <T>(value: OptionalType<T>)
  => RequiredType<T>
  = <T>(value: OptionalType<T>) => {
    return presentCheck(value, "Parser must be present.");
  }

const keyCheck: (value: OptionalType<string>)
  => RequiredType<string>
  = (value: OptionalType<string>) => {
    return presentCheck(value, "Key must be present.");
  }




