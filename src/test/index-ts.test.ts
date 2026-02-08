import { ok } from "node:assert";

import { 
  VERSION, 
  RequiredType,
  OptionalType,
  VariantException
} from "@jonloucks/variants-ts";
import { used } from "@jonloucks/variants-ts/auxiliary/Checks";

/** 
 * Tests for @jonloucks/variants-ts/api index 
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/variants-ts/tests/variants-ts-api.test.ts
 */

describe('variants-ts/api Index exports', () => {
  it('should export all expected members', () => {
    ok(VERSION.length > 0, 'VERSION should be exported and non-empty');
    assertNothing(null as OptionalType<VariantException>);
    ok(new VariantException('Test').message === 'Test', 'VariantException should be exported and constructible');
    assertNothing(null as OptionalType<RequiredType<unknown>>);
    assertNothing(null as OptionalType<OptionalType<unknown>>);
    ok(true, 'All exports are accessible'); // If we reach here, exports are accessible
  });
});

function assertNothing(value: OptionalType<unknown>): void {
  used(value);
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}
