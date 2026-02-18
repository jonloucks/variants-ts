/**
 * @file Convenience.test.ts
 * @description Tests for the Convenience module exports and types.
 * @author Jon Loucks 
 * Note: These tests are primarily for ensuring that the expected exports are present and correctly typed.
 * They do not test the functionality of the exported functions, which should be covered in their respective unit tests.
 */
import { ok } from "node:assert";
import { describe, it } from "node:test";

import {
  CONTRACTS,
  createEnvironment,
  createKeySource,
  createLookupSource,
  createMapSource,
  createProcessSource,
  createRecordSource,
  createVariant,
  VERSION,
  type Environment,
  type EnvironmentConfig,
  type EnvironmentFactory,
  type OptionalType,
  type RequiredType,
  type Source,
  type SourceFactory,
  type SupplierType,
  type ValueType,
  type Variant,
  type VariantConfig,
  type VariantFactory,
  type Transform,
  stringParser,
  ofRawString,
  ofString,
  booleanParser,
  ofBoolean,
  numberParser,
  ofNumber,
  bigIntParser,
  ofBigInt,
  trim,
  string,
  ofTrimAndSkipEmpty,
  ofList

} from "@jonloucks/variants-ts/auxiliary/Convenience";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe("Convenience Module", () => {
  describe("VERSION export", () => {
    it("should export VERSION as a string", () => {
      ok(typeof VERSION === "string");
    });

    it("VERSION should follow semantic versioning format", () => {
      const versionRegex = /^\d+\.\d+\.\d+$/;
      ok(versionRegex.test(VERSION));
    });
  });
  describe("Exports from auxiliary module", () => {
    it("should export CONTRACTS object", () => {
      ok(typeof CONTRACTS === "object");
    });
    it("should export createEnvironment function", () => {
      ok(typeof createEnvironment === "function");
    });

    it("should export createKeySource function", () => {
      ok(typeof createKeySource === "function");
    });

    it("should export createLookupSource function", () => {
      ok(typeof createLookupSource === "function");
    });

    it("should export createMapSource function", () => {
      ok(typeof createMapSource === "function");
    });

    it("should export createProcessSource function", () => {
      ok(typeof createProcessSource === "function");
    });

    it("should export createRecordSource function", () => {
      ok(typeof createRecordSource === "function");
    });

    it("should export createVariant function", () => {
      ok(typeof createVariant === "function");
    });
    it("should export stringParser function", () => {
      ok(typeof stringParser === "function");
    });

    it("should export ofRawString function", () => {
      ok(typeof ofRawString === "function");
    });

    it("should export ofString function", () => {
      ok(typeof ofString === "function");
    });

    it("should export booleanParser function", () => {
      ok(typeof booleanParser === "function");
    });

    it("should export ofBoolean function", () => {
      ok(typeof ofBoolean === "function");
    });

    it("should export numberParser function", () => {
      ok(typeof numberParser === "function");
    });

    it("should export ofNumber function", () => {
      ok(typeof ofNumber === "function");
    });

    it("should export bigIntParser function", () => {
      ok(typeof bigIntParser === "function");
    });

    it("should export ofBigInt function", () => {
      ok(typeof ofBigInt === "function");
    });

    it("should export trim function", () => {
      ok(typeof trim === "function");
    });

    it("should export string function", () => {
      ok(typeof string === "function");
    });

    it("should export ofTrimAndSkipEmpty function", () => {
      ok(typeof ofTrimAndSkipEmpty === "function");
    });

    it("should export ofList function", () => {
      ok(typeof ofList === "function");
    });

    it("should export type Environment", () => {
      assertNothing({} as OptionalType<Environment>);
    });

    it("should export type EnvironmentConfig", () => {
      assertNothing({} as OptionalType<EnvironmentConfig>);
    });

    it("should export type EnvironmentFactory", () => {
      assertNothing({} as OptionalType<EnvironmentFactory>);
    });

    it("should export type OptionalType", () => {
      assertNothing({} as OptionalType<unknown>);
    });

    it("should export type RequiredType", () => {
      assertNothing({} as OptionalType<unknown>);
    });

    it("should export type Source", () => {
      assertNothing({} as OptionalType<Source>);
    });

    it("should export type SourceFactory", () => {
      assertNothing({} as OptionalType<SourceFactory>);
    });

    it("should export type SupplierType", () => {
      assertNothing({} as OptionalType<SupplierType<unknown>>);
    });

    it("should export type ValueType", () => {
      assertNothing({} as OptionalType<ValueType>);
    });

    it("should export type Variant", () => {
      assertNothing({} as OptionalType<Variant<unknown>>);
    });

    it("should export type VariantConfig", () => {
      assertNothing({} as OptionalType<VariantConfig<unknown>>);
    });

    it("should export type VariantFactory", () => {
      assertNothing({} as OptionalType<VariantFactory>);
    });

    it("should export type Transform", () => {
      assertNothing({} as OptionalType<Transform<unknown, unknown>>);
    });

    it("should export type RequiredType", () => {
      assertNothing({} as OptionalType<RequiredType<unknown>>);
    });
  });
});

function assertNothing(value: OptionalType<unknown>): void {
  used(value);
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}