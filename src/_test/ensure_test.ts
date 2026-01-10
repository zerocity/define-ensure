import { describe, it } from "@std/testing/bdd";
import { expect, fn } from "@std/expect";

import { defineEnsure, ensure, EnsureError, isEnsureError } from "../mod.ts";

// ============================================================================
// ensure(value, message)
// ============================================================================

describe("ensure", () => {
  describe("ensure(value, message)", () => {
    it("returns value when defined", () => {
      const result = ensure("hello", "Should exist");
      expect(result).toBe("hello");
    });

    it("returns value when falsy but defined (0 and empty string)", () => {
      expect(ensure(0, "msg")).toBe(0);
      expect(ensure("", "msg")).toBe("");
    });

    it("throws on false", () => {
      expect(() => ensure(false, "Was false")).toThrow(EnsureError);
      expect(() => ensure(false, "Was false")).toThrow("Was false");
    });

    it("works as condition check", () => {
      expect(() => ensure(1 > 2, "1 is not greater than 2")).toThrow(
        EnsureError
      );
      expect(() => ensure(1 < 2, "1 is less than 2")).not.toThrow();
    });

    it("throws on null", () => {
      expect(() => ensure(null, "Was null")).toThrow(EnsureError);
      expect(() => ensure(null, "Was null")).toThrow("Was null");
    });

    it("throws on undefined", () => {
      expect(() => ensure(undefined, "Was undefined")).toThrow(EnsureError);
    });

    it("supports lazy message", () => {
      const msgFn = fn(() => "Lazy message");

      // Should not call when passing
      //@ts-expect-error aa
      ensure("value", msgFn);
      expect(msgFn).not.toHaveBeenCalled();

      // Should call when failing
      //@ts-expect-error aa
      expect(() => ensure(null, msgFn)).toThrow("Lazy message");
      expect(msgFn).toHaveBeenCalledTimes(1);
    });

    it("supports options object", () => {
      const cause = new Error("Root cause");

      try {
        ensure(null, { message: "Failed", cause });
      } catch (e) {
        expect(e).toBeInstanceOf(EnsureError);
        expect((e as Error).message).toBe("Failed");
        expect((e as Error).cause).toBe(cause);
      }
    });
  });

  describe("ensure.instance(value, Class, message)", () => {
    it("returns value when instanceof matches", () => {
      const date = new Date();
      const result = ensure.instance(date, Date, "Expected Date");
      expect(result).toBe(date);
    });

    it("throws when instanceof does not match", () => {
      expect(() => ensure.instance("string", Date, "Expected Date")).toThrow(
        EnsureError
      );
      expect(() => ensure.instance("string", Date, "Expected Date")).toThrow(
        "Expected Date"
      );
    });

    it("works with custom classes", () => {
      class MyClass {
        value = 42;
      }

      const instance = new MyClass();
      const result = ensure.instance(instance, MyClass, "Expected MyClass");
      expect(result.value).toBe(42);
    });

    it("works with Error subclasses", () => {
      const err = new TypeError("type error");
      const result = ensure.instance(err, Error, "Expected Error");
      expect(result).toBe(err);
    });
  });

  describe("isEnsureError", () => {
    it("returns true for EnsureError", () => {
      const error = new EnsureError("test");
      expect(isEnsureError(error)).toBe(true);
    });

    it("returns false for other errors", () => {
      expect(isEnsureError(new Error("test"))).toBe(false);
      expect(isEnsureError(new TypeError("test"))).toBe(false);
    });

    it("returns false for non-errors", () => {
      expect(isEnsureError("string")).toBe(false);
      expect(isEnsureError(null)).toBe(false);
      expect(isEnsureError(undefined)).toBe(false);
      expect(isEnsureError({})).toBe(false);
    });
  });
});

// ============================================================================
// defineEnsure
// ============================================================================

describe("defineEnsure", () => {
  class ValidationError extends Error {
    override name = "ValidationError";
  }

  class AuthError extends Error {
    override name = "AuthError";
  }

  it("creates validator with custom error class", () => {
    const [validate, isValidationError] = defineEnsure({
      error: ValidationError,
    });

    expect(() => validate(null, "Required")).toThrow(ValidationError);

    try {
      validate(null, "Required");
    } catch (e) {
      expect(isValidationError(e)).toBe(true);
      expect(isEnsureError(e)).toBe(false);
    }
  });

  it("supports custom formatMessage", () => {
    const [validate] = defineEnsure({
      error: ValidationError,
      formatMessage: (msg) => `[Validation] ${msg}`,
    });

    expect(() => validate(null, "Required")).toThrow("[Validation] Required");
  });

  it("supports override error per call", () => {
    const [validate] = defineEnsure({ error: ValidationError });

    expect(() =>
      validate(null, { message: "Auth failed", error: AuthError })
    ).toThrow(AuthError);
  });

  it("keeps message when strip is false", () => {
    const [validate] = defineEnsure({
      error: ValidationError,
      strip: false,
    });

    expect(() => validate(null, "Sensitive info")).toThrow("Sensitive info");
  });
});

// ============================================================================
// TypeScript type narrowing
// ============================================================================

describe("TypeScript type narrowing", () => {
  it("narrows out null/undefined/false with ensure()", () => {
    const maybeString: string | null = "hello";
    const result = ensure(maybeString, "Required");

    // TypeScript should know this is string, not string | null
    const _proof: string = result;
    expect(result.toUpperCase()).toBe("HELLO");
  });

  it("works as condition check with boolean", () => {
    const id = 5;
    ensure(id > 0, "ID must be positive");
    // Passes, no throw
    expect(id).toBe(5);
  });

  it("narrows instanceof with ensure.instance()", () => {
    const value: unknown = new Date();
    const result = ensure.instance(value, Date, "Must be Date");

    // TypeScript should know this is Date
    const _proof: Date = result;
    expect(result.getTime()).toBeGreaterThan(0);
  });
});
