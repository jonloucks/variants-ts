import { AutoClose, AutoOpen, Repository, REPOSITORY_FACTORY, RequiredType } from "@jonloucks/contracts-ts";
import { Installer, Config } from "@jonloucks/variants-ts/api/Installer";
import { CONTRACT as ENVIRONMENT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/EnvironmentFactory";
import { CONTRACT as VARIANT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/VariantFactory";
import { CONTRACT as SOURCE_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/SourceFactory";
import { CONTRACT as PARSER_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/ParserFactory";

import { Internal } from "./Internal.impl";
import { create as createEnvironmentFactory } from "./EnvironmentFactory.impl";
import { create as createVariantFactory } from "./VariantFactory.impl";
import { create as createSourceFactory } from "./SourceFactory.impl";
import { create as createParserFactory } from "./ParserFactory.impl";

/**
 * Factory function to create an instance of Installer.
 * 
 * @param config Optional configuration for the Installer instance.
 * @returns An instance of Installer.
 */
export function create(config?: Config): RequiredType<Installer>{
  return InstallerImpl.internalCreate(config);
}

// ---- Implementation details below ----

class InstallerImpl implements Installer, AutoOpen {

  /* @override AutoOpen.open */
  open(): AutoClose {
    return this.#repository.open();
  }

  /* @override AutoOpen.autoOpen */
  autoOpen(): AutoClose {
    return this.open();
  }

  static internalCreate(config?: Config): Installer {
    return new InstallerImpl(config);
  }

  private constructor(config?: Config) {
    const contracts = Internal.resolveContracts(config);
    this.#repository = contracts.enforce(REPOSITORY_FACTORY).createRepository();
    
    this.#repository.keep(ENVIRONMENT_FACTORY_CONTRACT, createEnvironmentFactory);
    this.#repository.keep(VARIANT_FACTORY_CONTRACT, createVariantFactory);
    this.#repository.keep(SOURCE_FACTORY_CONTRACT, createSourceFactory);
    this.#repository.keep(PARSER_FACTORY_CONTRACT, createParserFactory);
  }

  #repository: Repository;

}