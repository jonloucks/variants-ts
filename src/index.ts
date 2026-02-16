/**
 * Main entry point for the variants-ts library.
 * 
 * This module performs necessary bootstrapping.
 * This is an anti-barrel module. 
 * Use variants-ts/auxiliary/Convenience for convenience barrel exports.
 * 
 * @module @jonloucks/variants-ts
 * @author Jon Loucks
 * @license MIT
 */
import { Installer, Config as InstallerConfig } from "@jonloucks/variants-ts/api/Installer";
import { VERSION } from "./version.js";

import { create as createInstaller } from "./impl/Installer.impl.js";

const BOOTSTRAPPED = ((): boolean => {
  createInstaller().open(); // currently there is nothing to clean up
  return true;
})();

export type {
  Installer, 
  InstallerConfig,
};

export {
  createInstaller, // for advanced users who want to manage the installer lifecycle themselves
  VERSION,
  BOOTSTRAPPED
};
