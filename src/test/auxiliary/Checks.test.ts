import { ok } from "node:assert";

import {
  configCheck,
  illegalCheck,
  presentCheck,
  used
} from "@jonloucks/variants-ts/auxiliary/Checks";

describe('Index exports', () => {
  it('should export all check functions', () => {
    ok(presentCheck, 'presentCheck should be exported');
    ok(illegalCheck, 'illegalCheck should be exported');
    ok(configCheck, 'configCheck should be exported');
    ok(used, 'used should be exported');
  });
});