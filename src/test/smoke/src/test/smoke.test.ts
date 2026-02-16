import { test } from "node:test";
import { ok } from "node:assert";
import { VERSION, BOOTSTRAPPED, type Installer, createInstaller, type InstallerConfig } from "@jonloucks/variants-ts";

test("variants-ts exports", () => {
  ok(typeof createInstaller === "function", "createInstaller should be a function.");
  ok(typeof VERSION === "string", "VERSION should be a string.");
  ok(BOOTSTRAPPED === true, "BOOTSTRAPPED should be true.");
  ok(null as unknown as Installer === null, "Installer type should be defined.");
  ok(null as unknown as InstallerConfig === null, "InstallerConfig type should be defined.");
});