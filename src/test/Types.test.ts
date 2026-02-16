import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { presentCheck, used } from "@jonloucks/variants-ts/auxiliary/Checks";

import {
  guardFunctions,
  isNotPresent,
  isNumber,
  isPresent,
  isString,
  OptionalType,
  RequiredType
} from "@jonloucks/variants-ts/api/Types";


describe('variants-ts/auxiliary/Checks Index exports', () => {
  it('should export all expected members', () => {
    strictEqual(presentCheck("green", "not easy being green"), "green");
    assertNothing("abc" as RequiredType<string>);
    ok(isString, 'isString should be accessible');
    ok(isNumber, 'isNumber should be accessible');
    ok(isPresent, 'isPresent should be accessible');
    ok(isNotPresent, 'isNotPresent should be accessible');
  });
});

describe('guardFunctions utility', () => {
  it('is exported', () => {
    ok(guardFunctions, 'guardFunctions should be exported');
  });
});

function assertNothing(value: OptionalType<unknown>): void {
  used(value);
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}