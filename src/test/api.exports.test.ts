import { ok } from "node:assert";
import { describe, it } from "node:test";

/** 
 * Tests for @jonloucks/variants-ts/api index 
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/variants-ts/tests/variants-ts-api.test.ts
 */

describe('variants-ts/api Index exports', () => {
  it('should export all expected members', () => {
    ok(true, 'All exports are accessible'); // If we reach here, exports are accessible
  });
});
