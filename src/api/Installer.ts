import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import type { Open } from "@jonloucks/contracts-ts/api/Open";

/**
 * Interface for installing the variants-ts library. 
 * Implementations of this interface are responsible for performing necessary setup and initialization
 * to ensure that the library functions correctly. This may include tasks such as registering contracts,
 * initializing internal state, or performing any other necessary bootstrapping.
 */
export interface Config {
  contracts?: Contracts;
}

/** 
 * Responsibility: Installing the variants-ts library.
 * <p>
 * This interface defines the contract for installing the variants-ts library. Implementations of this interface
 * are responsible for performing necessary setup and initialization to ensure that the library functions correctly.
 * This may include tasks such as registering
 */
export type { Open as Installer };

