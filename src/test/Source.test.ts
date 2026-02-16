import { ok } from "node:assert";
import { describe, it } from "node:test";

import { Source, guard } from "@jonloucks/variants-ts/api/Source";
import { assertGuard, mockDuck } from "@jonloucks/variants-ts/test/helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'getSourceValue'
];

assertGuard(guard, ...FUNCTION_NAMES);

describe('Source Suite', () => {
  it('isSource should return true for Source', () => {
    const source: Source = mockDuck<Source>(...FUNCTION_NAMES);
    ok(guard(source), 'Source should return true');
  });
});