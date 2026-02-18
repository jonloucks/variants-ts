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
      ok(createEnvironment(), "createEnvironment should return a truthy value");
    });

    it("should export createKeySource function", () => {
      ok(typeof createKeySource === "function");
      ok(createKeySource("key", "value"), "createKeySource should return a truthy value");
    });

    it("should export createLookupSource function", () => {
      ok(typeof createLookupSource === "function");
      ok(createLookupSource(() => "value"), "createLookupSource should return a truthy value");
    });

    it("should export createMapSource function", () => {
      ok(typeof createMapSource === "function");
      ok(createMapSource(new Map([["key", "value"]])), "createMapSource should return a truthy value");
    });

    it("should export createProcessSource function", () => {
      ok(typeof createProcessSource === "function");
      ok(createProcessSource(), "createProcessSource should return a truthy value");
    });

    it("should export createRecordSource function", () => {
      ok(typeof createRecordSource === "function");
      ok(createRecordSource({ key: "value" }), "createRecordSource should return a truthy value");
    });

    it("should export createVariant function", () => {
      ok(typeof createVariant === "function");
      ok(createVariant(), "createVariant should return a truthy value");
    });
    it("should export stringParser function", () => {
      ok(typeof stringParser === "function");
      ok(stringParser(), "stringParser should return a truthy value");
    });

    it("should export ofRawString function", () => {
      ok(typeof ofRawString === "function");
      ok(ofRawString(), "ofRawString should return a truthy value");
    });

    it("should export ofString function", () => {
      ok(typeof ofString === "function");
      ok(ofString(), "ofString should return a truthy value");
    });

    it("should export booleanParser function", () => {
      ok(typeof booleanParser === "function");
      ok(booleanParser(), "booleanParser should return a truthy value");
    });

    it("should export ofBoolean function", () => {
      ok(typeof ofBoolean === "function");
      ok(ofBoolean(), "ofBoolean should return a truthy value");
    });

    it("should export numberParser function", () => {
      ok(typeof numberParser === "function");
      ok(numberParser(), "numberParser should return a truthy value");
    });

    it("should export ofNumber function", () => {
      ok(typeof ofNumber === "function");
      ok(ofNumber(), "ofNumber should return a truthy value");
    });

    it("should export bigIntParser function", () => {
      ok(typeof bigIntParser === "function");
      ok(bigIntParser(), "bigIntParser should return a truthy value");
    });

    it("should export ofBigInt function", () => {
      ok(typeof ofBigInt === "function");
      ok(ofBigInt(), "ofBigInt should return a truthy value");
    });

    it("should export trim function", () => {
      ok(typeof trim === "function");
      ok(trim("hello"), "trim should return a truthy value");
    });

    it("should export string function", () => {
      ok(typeof string === "function");
      const textToNumberParser: Transform<string, number> = {
        transform: function (input: string): number {
          return Number(input);
        }
      };
      ok(string<number>(textToNumberParser), "string should return a truthy value");
    });

    it("should export ofTrimAndSkipEmpty function", () => {
      ok(typeof ofTrimAndSkipEmpty === "function");
      ok(ofTrimAndSkipEmpty(stringParser()), "ofTrimAndSkipEmpty should return a truthy value");
    });

    it("should export ofList function", () => {
      ok(typeof ofList === "function");
      ok(ofList(numberParser(), ','), "ofList should return a truthy value");
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