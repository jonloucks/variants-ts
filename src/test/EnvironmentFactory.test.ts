import { ok } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import { AutoClose, Contracts, CONTRACTS, isPresent } from "@jonloucks/contracts-ts";
import { createInstaller } from "@jonloucks/variants-ts";
import { Environment } from "@jonloucks/variants-ts/api/Environment";
import { CONTRACT as ENVIRONMENT_FACTORY_CONTRACT, EnvironmentFactory, guard } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { Installer } from "@jonloucks/variants-ts/api/Installer";
import { assertContract, assertGuard, mockDuck } from "@jonloucks/variants-ts/test/helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createEnvironment'
];

assertGuard(guard, ...FUNCTION_NAMES);
assertContract(ENVIRONMENT_FACTORY_CONTRACT, 'EnvironmentFactory');

describe('EnvironmentFactory Suite', () => {
  let contracts: Contracts = CONTRACTS;
  let installer: Installer;
  let closeInstaller: AutoClose;
  let factory: EnvironmentFactory;

  beforeEach(() => {
    installer = createInstaller({ contracts: contracts });
    closeInstaller = installer.open();
    factory = contracts.enforce(ENVIRONMENT_FACTORY_CONTRACT);
  });

  afterEach(() => {
    closeInstaller.close();
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