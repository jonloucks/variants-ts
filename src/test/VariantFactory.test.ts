import { ok } from "node:assert";

import { VariantFactory, guard, CONTRACT as VARIANT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/VariantFactory";
import { Variant } from "@jonloucks/variants-ts/api/Variant";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { assertContract, assertGuard, mockDuck } from "./helper.test";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";
import { Contracts, CONTRACTS } from "@jonloucks/contracts-ts";
import { Installer, createInstaller } from "@jonloucks/variants-ts";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createVariant'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(VARIANT_FACTORY_CONTRACT, 'VariantFactory');

describe('VariantFactory Suite', () => {

  let contracts: Contracts = CONTRACTS;
  let installer: Installer;
  let closeInstaller: AutoClose;
  let variantFactory: VariantFactory;

  beforeEach(() => {
    installer = createInstaller({ contracts: contracts });
    closeInstaller = installer.open();
    variantFactory = contracts.enforce(VARIANT_FACTORY_CONTRACT);
  });

  afterEach(() => {
    closeInstaller.close();
  });

  it('isVariantFactory should return true for VariantFactory', () => {
    const factory: VariantFactory = mockDuck<VariantFactory>(...FUNCTION_NAMES);
    ok(guard(factory), 'VariantFactory should return true');
  });

  it('createVariant with empty config should create a Variant', () => {
    const variant: Variant<Date> = variantFactory.createVariant<Date>();
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