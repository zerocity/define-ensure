import { describe, it } from "@std/testing/bdd";
import { expect, fn } from "@std/expect";

import { assert, AssertError, isAssertError } from "../assert.ts";

describe("assert", () => {
  describe("basic assertion", () => {
    it("passes when condition is truthy", () => {
      expect(() => assert(true, "Should pass")).not.toThrow();
      expect(() => assert(1, "Should pass")).not.toThrow();
      expect(() => assert("string", "Should pass")).not.toThrow();
      expect(() => assert({}, "Should pass")).not.toThrow();
    });

    it("throws when condition is false", () => {
      expect(() => assert(false, "Was false")).toThrow(AssertError);
      expect(() => assert(false, "Was false")).toThrow("Was false");
    });

    it("throws when condition is null", () => {
      expect(() => assert(null, "Was null")).toThrow(AssertError);
      expect(() => assert(null, "Was null")).toThrow("Was null");
    });

    it("throws when condition is undefined", () => {
      expect(() => assert(undefined, "Was undefined")).toThrow(AssertError);
    });

    it("throws when condition is 0", () => {
      expect(() => assert(0, "Was 0")).toThrow(AssertError);
    });

    it("throws when condition is empty string", () => {
      expect(() => assert("", "Was empty")).toThrow(AssertError);
    });

    it("works with comparison conditions", () => {
      const id = 5;
      expect(() => assert(id > 0, "ID must be positive")).not.toThrow();
      expect(() => assert(id < 0, "ID must be negative")).toThrow(
        AssertError
      );
    });
  });

  describe("custom error class", () => {
    class ValidationError extends Error {
      override name = "ValidationError";
    }

    it("throws custom error class", () => {
      expect(() =>
        assert(false, { message: "Failed", error: ValidationError })
      ).toThrow(ValidationError);

      try {
        assert(false, { message: "Failed", error: ValidationError });
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as Error).name).toBe("ValidationError");
        expect((e as Error).message).toBe("Failed");
      }
    });
  });

  describe("formatMessage", () => {
    it("formats message before throwing", () => {
      expect(() =>
        assert(false, {
          message: "Required",
          formatMessage: (msg) => `[Validation] ${msg}`,
        })
      ).toThrow("[Validation] Required");
    });

    it("applies formatting before stripping", () => {
      // Note: Can't easily test production behavior in tests
      // but this tests the order of operations
      expect(() =>
        assert(false, {
          message: "Test",
          formatMessage: (msg) => `Formatted: ${msg}`,
          strip: false, // Keep for testing
        })
      ).toThrow("Formatted: Test");
    });
  });

  describe("cleanStack", () => {
    it("removes assert frame from stack trace", () => {
      try {
        assert(false, { message: "Test error", cleanStack: true });
      } catch (e) {
        const stack = (e as Error).stack ?? "";
        // Should NOT contain the assert frame
        expect(stack).not.toContain("at assert");
        // Should still have a stack trace
        expect(stack).toContain("AssertError");
      }
    });

    it("keeps full stack when cleanStack is false", () => {
      try {
        assert(false, { message: "Test error", cleanStack: false });
      } catch (e) {
        const stack = (e as Error).stack ?? "";
        // Should have a stack trace
        expect(stack).toContain("AssertError");
      }
    });
  });

  describe("lazy messages", () => {
    it("does not call lazy message when passing", () => {
      const msgFn = fn(() => "Lazy message");

      //@ts-expect-error testing with mock
      assert(true, msgFn);
      expect(msgFn).not.toHaveBeenCalled();
    });

    it("calls lazy message when failing", () => {
      const msgFn = fn(() => "Lazy message");

      //@ts-expect-error testing with mock
      expect(() => assert(false, msgFn)).toThrow("Lazy message");
      expect(msgFn).toHaveBeenCalledTimes(1);
    });

    it("works with lazy message in options", () => {
      const msgFn = fn(() => "Lazy message");

      //@ts-expect-error testing with mock
      assert(true, { message: msgFn });
      expect(msgFn).not.toHaveBeenCalled();

      //@ts-expect-error testing with mock
      expect(() => assert(false, { message: msgFn })).toThrow("Lazy message");
      expect(msgFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("error chaining (cause)", () => {
    it("supports error cause", () => {
      const cause = new Error("Root cause");

      try {
        assert(false, { message: "Failed", cause });
      } catch (e) {
        expect(e).toBeInstanceOf(AssertError);
        expect((e as Error).message).toBe("Failed");
        expect((e as Error).cause).toBe(cause);
      }
    });

    it("works with custom error and cause", () => {
      class CustomError extends Error {}
      const cause = new Error("Root");

      try {
        assert(false, { message: "Failed", error: CustomError, cause });
      } catch (e) {
        expect(e).toBeInstanceOf(CustomError);
        expect((e as Error).cause).toBe(cause);
      }
    });
  });

  describe("combining features", () => {
    class ValidationError extends Error {
      override name = "ValidationError";
    }

    it("works with all options combined", () => {
      const cause = new Error("Root");

      expect(() =>
        assert(false, {
          message: "Failed",
          error: ValidationError,
          formatMessage: (msg) => `[Validation] ${msg}`,
          cleanStack: true,
          cause,
        })
      ).toThrow("[Validation] Failed");

      try {
        assert(false, {
          message: "Failed",
          error: ValidationError,
          formatMessage: (msg) => `[Validation] ${msg}`,
          cleanStack: true,
          cause,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        expect((e as Error).message).toBe("[Validation] Failed");
        expect((e as Error).cause).toBe(cause);

        const stack = (e as Error).stack ?? "";
        expect(stack).not.toContain("at assert");
      }
    });
  });

  describe("isAssertError", () => {
    it("returns true for AssertError", () => {
      const error = new AssertError("test");
      expect(isAssertError(error)).toBe(true);
    });

    it("returns false for other errors", () => {
      expect(isAssertError(new Error("test"))).toBe(false);
      expect(isAssertError(new TypeError("test"))).toBe(false);
    });

    it("returns false for non-errors", () => {
      expect(isAssertError("string")).toBe(false);
      expect(isAssertError(null)).toBe(false);
      expect(isAssertError(undefined)).toBe(false);
      expect(isAssertError({})).toBe(false);
    });
  });
});

describe("TypeScript type narrowing with assert", () => {
  it("narrows value assertion", () => {
    const value: string | null = "hello";

    // Before: value is string | null
    assert(value, "Value must not be null");
    // After: TypeScript knows value is string

    const _proof: string = value;
    expect(value.toUpperCase()).toBe("HELLO");
  });

  it("narrows condition assertion", () => {
    const value: string | null = "hello";

    // Before: value is string | null
    assert(value !== null, "Value must not be null");
    // After: TypeScript knows value is string

    const _proof: string = value;
    expect(value.toUpperCase()).toBe("HELLO");
  });

  it("works with complex conditions", () => {
    const user: { name?: string } = { name: "Alice" };

    assert(user.name !== undefined, "Name required");
    // TypeScript knows user.name is string

    const _proof: string = user.name;
    expect(user.name.toUpperCase()).toBe("ALICE");
  });

  it("works with optional properties", () => {
    interface User {
      profile?: { src: string };
    }

    const user: User = { profile: { src: "avatar.jpg" } };

    assert(user.profile, "Profile required");
    // TypeScript knows user.profile is defined

    const _proof: { src: string } = user.profile;
    expect(user.profile.src).toBe("avatar.jpg");
  });
});

describe("Creating reusable wrappers", () => {
  it("wrapper functions work without annotation", () => {
    class ValidationError extends Error {
      override name = "ValidationError";
    }

    function assertValid(condition: any, message: string): asserts condition {
      assert(condition, {
        message,
        error: ValidationError,
        formatMessage: (msg) => `Validation: ${msg}`,
        cleanStack: true,
      });
    }

    // Use the wrapper
    const email: string | null = "test@example.com";
    assertValid(email, "Email required");

    // TypeScript knows email is string
    const _proof: string = email;
    expect(email).toBe("test@example.com");

    // Test it throws
    expect(() => assertValid(false, "Test")).toThrow(ValidationError);
    expect(() => assertValid(false, "Test")).toThrow("Validation: Test");
  });
});
