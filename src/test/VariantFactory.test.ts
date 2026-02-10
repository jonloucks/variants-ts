import { ok } from "node:assert";

import { CONTRACT, VariantFactory, guard } from "@jonloucks/variants-ts/api/VariantFactory";
import { Variant } from "@jonloucks/variants-ts/api/Variant";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { assertContract, assertGuard, mockDuck } from "./helper.test";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";
import { Contracts, CONTRACTS } from "@jonloucks/contracts-ts";

// temporary until we have a better way to manage test dependencies
import { create as createFactory } from "../impl/VariantFactory.impl";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createVariant'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(CONTRACT, 'VariantFactory');

describe('VariantFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let factory: VariantFactory;
  let closeBind: AutoClose;

  beforeEach(() => {
    closeBind = contracts.bind(CONTRACT, createFactory);
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeBind.close();
  });

  it('isVariantFactory should return true for VariantFactory', () => {
    const factory: VariantFactory = mockDuck<VariantFactory>(...FUNCTION_NAMES);
    ok(guard(factory), 'VariantFactory should return true');
  });

  it('createVariant with empty config should create a Variant', () => {
    const variant: Variant<Date> = factory.createVariant<Date>();
    ok(isPresent(variant), 'createVariant with config should create a Variant');
    ok(isPresent(variant.keys), 'Variant should have keys');
    ok(Array.isArray(variant.keys), 'Variant keys should be an array');
    ok(variant.keys.length === 0, 'Variant keys should be empty');
    ok(variant.name === '', 'Variant should have an empty name');
    ok(variant.description === '', 'Variant should have an empty description');
    ok(variant.fallback === undefined, 'Variant should have an undefined fallback');
    ok(variant.link === undefined, 'Variant should have an undefined link');
  });
});