import { ok } from "node:assert";

import { AutoClose, Contracts, CONTRACTS, isPresent } from "@jonloucks/contracts-ts";
import { CONTRACT, EnvironmentFactory, guard } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { Environment } from "@jonloucks/variants-ts/api/Environment";
import { assertContract, assertGuard, mockDuck } from "@jonloucks/variants-ts/test/helper.test";

// temporary until we have a better way to manage test dependencies
import { create as createFactory } from "../impl/EnvironmentFactory.impl";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createEnvironment'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(CONTRACT, 'EnvironmentFactory');

describe('EnvironmentFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let factory: EnvironmentFactory;
  let closeBind: AutoClose;

  beforeEach(() => {
    closeBind = contracts.bind(CONTRACT, createFactory);
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeBind.close();
  });

  it('isEnvironmentFactory should return true for EnvironmentFactory', () => {
    const factory: EnvironmentFactory = mockDuck<EnvironmentFactory>(...FUNCTION_NAMES);
    ok(guard(factory), 'EnvironmentFactory should return true');
  });

  it('createEnvironment with empty config should create an Environment', () => {
    const environment: Environment = factory.createEnvironment();
    ok(isPresent(environment), 'createEnvironment with config should create an Environment');
  });
});