import { test } from "node:test";
import { ok } from "node:assert";
import { CONTRACTS, VERSION } from "@jonloucks/contracts-ts";

test("smoke contracts", () => {
  ok(VERSION, "VERSION should be defined.");
  ok(typeof VERSION === "string", "VERSION should be a string.");
  ok(CONTRACTS, "Contracts should be defined.");
  ok(typeof CONTRACTS === "object", "CONTRACTS should be an object.");
});
