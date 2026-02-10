import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Environment, Config as EnvironmentConfig } from "@jonloucks/variants-ts/api/Environment";
import { EnvironmentFactory } from "@jonloucks/variants-ts/api/EnvironmentFactory";

import { create as createEnvironmentImpl } from "./Environment.impl";

/**
 * Create an EnvironmentFactory instance
 * 
 * @returns an EnvironmentFactory instance
 */
export function create(): RequiredType<EnvironmentFactory> {
  return EnvironmentFactoryImpl.createInternal();
};

// ---- Implementation details below ----

class EnvironmentFactoryImpl implements EnvironmentFactory {

  createEnvironment(config?: EnvironmentConfig): RequiredType<Environment> {
    return createEnvironmentImpl(config);
  }

  static createInternal(): RequiredType<EnvironmentFactory> {
    return new EnvironmentFactoryImpl();
  }

  private constructor() {

  }
}
