/**
 * Main entry point for the variants-ts library.
 * 
 * This module performs required bootstrapping during module load.
 * It intentionally exposes only the core entrypoint surface.
 * Use @jonloucks/variants-ts/auxiliary/Convenience for convenience exports.
 * 
 * @module @jonloucks/variants-ts
 * @author Jon Loucks
 * @license MIT
 */
import { Installer, Config as InstallerConfig } from "@jonloucks/variants-ts/api/Installer";

import { VERSION } from "./version.js";
import { create as createInstaller } from "./impl/Installer.impl.js";

/**
 * Bootstraps variants-ts by creating and opening an installer instance.
 * This ensures the library is initialized and ready for use.
 * 
 * Note: The installer is currently opened without any configuration, but this can be
 * modified in the future to allow for custom configurations if needed.
 */
const BOOTSTRAPPED = ((): boolean => {
  createInstaller().open(); // currently there is nothing to clean up
  return true;
})();

export {
  type Installer, 
  type InstallerConfig,
  createInstaller, // for advanced users who want to manage the installer lifecycle themselves
  VERSION,
  BOOTSTRAPPED
};
