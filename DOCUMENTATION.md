# Documentation

## Overview
Variants TS is a TypeScript configuration library that normalizes how values are retrieved from multiple sources. It provides a small set of types for building configuration variants, sources, and environments, plus factories and convenience helpers for common usage.

This document is the canonical, human-friendly guide for the first release. API reference is also published via TypeDoc.

- TypeDoc API reference: https://jonloucks.github.io/variants-ts/typedoc/
- Test coverage report: https://jonloucks.github.io/variants-ts/lcov-report

## Installation

```bash
npm install @jonloucks/variants-ts
```

## Quick Start (Convenience Module)

The convenience module provides factory helpers that use the shared global `CONTRACTS` instance.

```ts
import {
  createEnvironment,
  createProcessSource,
  createRecordSource,
  createVariant
} from "@jonloucks/variants-ts/auxiliary/Convenience";

const portVariant = createVariant<string>({
  name: "server.port",
  keys: ["PORT"],
  fallback: "3000"
});

const env = createEnvironment({
  sources: [
    createProcessSource(),
    createRecordSource({ PORT: "8080" })
  ]
});

const port = env.getVariance(portVariant); // "8080" (string is pass-through)
```

Notes:
- If you need type-safe parsing (for example, `number` or `boolean`), use a `parser` or `of` transform from `ParserFactory` (see below).
- The environment searches sources in order, and keys in order within each variant.

## Core Concepts

### Value Types
`ValueType` is the union of supported raw values:

```
string | Buffer | boolean | number | bigint | symbol | undefined
```

### Variant
A `Variant<T>` describes how to retrieve and parse a configuration value.

`Variant` configuration fields:
- `keys`: Ordered list of keys to search for in sources.
- `name`: Human-friendly name for diagnostics.
- `description`: Optional description.
- `fallback`: Default value when no sources match.
- `link`: Another `Variant` to consult if this variant has no value.
- `parser`: Transform for required raw values.
- `of`: Transform for optional raw values.

If `of` is supplied, it takes precedence. If `parser` is supplied, it is used when a raw value exists. Otherwise, raw values are passed through.

### Source
A `Source` provides values by key through `getSourceValue(key)`.

Built-in `SourceFactory` helpers:
- `createKeySource(key, supplier)`
- `createLookupSource(lookup)`
- `createMapSource(map)`
- `createRecordSource(record)`
- `createProcessSource()` (reads from `process.env`)

### Environment
An `Environment` locates values using a breadth-first search across sources:
1. For each source (in order), each variant key is checked (in order).
2. If a value is found, the variant parser/transform is applied.
3. If no source provides a value, `fallback` or `link` is used.

`Environment` methods:
- `findVariance(variant)` returns an optional value.
- `getVariance(variant)` returns a required value, throwing `VariantException` when missing.

### ParserFactory
`ParserFactory` provides parser helpers for common conversions and composition:
- `stringParser`, `booleanParser`, `numberParser`, `bigIntParser`
- `ofRawString`, `ofString`, `ofBoolean`, `ofNumber`, `ofBigInt`
- `trim`, `string`, `ofTrimAndSkipEmpty`, `ofList`

Example using `ParserFactory`:

```ts
import { CONTRACTS } from "@jonloucks/variants-ts/auxiliary/Convenience";
import { CONTRACT as PARSER_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/ParserFactory";
import { createVariant } from "@jonloucks/variants-ts/auxiliary/Convenience";

const parsers = CONTRACTS.enforce(PARSER_FACTORY_CONTRACT);

const portVariant = createVariant<number>({
  name: "server.port",
  keys: ["PORT"],
  parser: parsers.numberParser()
});
```

### Installer and Bootstrapping
The main entry point auto-installs factory contracts during module load. You can access:
- `BOOTSTRAPPED` to ensure installation ran.
- `createInstaller` to control installer lifecycle manually.

### Convenience Checks
The auxiliary `Checks` module re-exports common validation helpers:
- `presentCheck`, `illegalCheck`, `configCheck`, `used`, `valueCheck`, `parserCheck`, `keyCheck`

### Errors
`VariantException` is thrown when a required value cannot be found via `Environment.getVariance` or when rethrowing unknown errors using `VariantException.rethrow`.

## API Summary

Main entry point:
- `@jonloucks/variants-ts`
  - `VERSION`, `BOOTSTRAPPED`
  - `createInstaller`, `Installer`, `InstallerConfig`

API modules:
- `@jonloucks/variants-ts/api/Environment`
- `@jonloucks/variants-ts/api/EnvironmentFactory`
- `@jonloucks/variants-ts/api/Installer`
- `@jonloucks/variants-ts/api/ParserFactory`
- `@jonloucks/variants-ts/api/Source`
- `@jonloucks/variants-ts/api/SourceFactory`
- `@jonloucks/variants-ts/api/Types`
- `@jonloucks/variants-ts/api/Variant`
- `@jonloucks/variants-ts/api/VariantException`
- `@jonloucks/variants-ts/api/VariantFactory`

Convenience and auxiliary modules:
- `@jonloucks/variants-ts/auxiliary/Convenience`
- `@jonloucks/variants-ts/auxiliary/Checks`

## Advanced Usage (Factories)

If you prefer factory instances instead of convenience helpers, enforce contracts directly via `CONTRACTS`:

```ts
import { CONTRACTS } from "@jonloucks/variants-ts/auxiliary/Convenience";
import { CONTRACT as SOURCE_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/SourceFactory";
import { CONTRACT as VARIANT_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/VariantFactory";
import { CONTRACT as ENV_FACTORY_CONTRACT } from "@jonloucks/variants-ts/api/EnvironmentFactory";

const sources = CONTRACTS.enforce(SOURCE_FACTORY_CONTRACT);
const variants = CONTRACTS.enforce(VARIANT_FACTORY_CONTRACT);
const environments = CONTRACTS.enforce(ENV_FACTORY_CONTRACT);

const source = sources.createProcessSource();
const variant = variants.createVariant<string>({ keys: ["NODE_ENV"], name: "node.env" });
const env = environments.createEnvironment({ sources: [source] });

const nodeEnv = env.findVariance(variant);
```

## Release Notes

See the release notes in notes/ for version-specific changes.
