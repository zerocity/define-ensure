import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { supportsCleanStack } from "../utils.ts";

describe("supportsCleanStack", () => {
  it("returns a boolean", () => {
    const result = supportsCleanStack();
    expect(typeof result).toBe("boolean");
  });

  it("returns true in Deno (V8 engine)", () => {
    // Deno uses V8, so it should support Error.captureStackTrace
    expect(supportsCleanStack()).toBe(true);
  });

  it("checks for Error.captureStackTrace", () => {
    // Verify it's checking the right thing
    const expected = typeof Error.captureStackTrace === "function";
    expect(supportsCleanStack()).toBe(expected);
  });
});
