import type { ErrorConstructor, Message } from "./types.ts";

/**
 * Default error class for assert.
 *
 * @example
 * ```typescript
 * import { assert, AssertError } from "@zerocity/define-ensure";
 *
 * try {
 *   assert(false, "Condition failed");
 * } catch (e) {
 *   if (e instanceof AssertError) {
 *     console.log(e.message); // "Condition failed"
 *   }
 * }
 * ```
 */
export class AssertError extends Error {
  override name = "AssertError";

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);

    // Maintains proper stack trace in V8 (Node/Chrome/Deno)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertError);
    }
  }
}

/**
 * Options for assert with inline configuration.
 *
 * @example
 * ```typescript
 * import { assert } from "@zerocity/define-ensure";
 *
 * assert(value, {
 *   message: "Value required",
 *   error: ValidationError,
 *   formatMessage: (msg) => `Validation: ${msg}`,
 *   cleanStack: true,
 * });
 * ```
 */
export interface AssertOptions {
  /** Error message */
  message: Message;
  /** Custom error class to throw (defaults to AssertError) */
  error?: ErrorConstructor;
  /** Cause for error chaining */
  cause?: unknown;
  /** Transform message before passing to Error */
  formatMessage?: (message: string) => string;
  /** Remove internal library frames from stack traces (V8 engines only) */
  cleanStack?: boolean;
  /** Strip messages in production (tiny-invariant behavior) */
  strip?: boolean;
}

/**
 * Argument can be message string/function or full options object.
 */
export type AssertArg = Message | AssertOptions;

/**
 * Check if running in production mode.
 * Supports Deno, Node.js, and bundlers (Vite/esbuild/webpack).
 */
function isProduction(): boolean {
  // Deno
  try {
    if (typeof Deno !== "undefined") {
      return Deno.env.get("DENO_ENV") === "production";
    }
  } catch {
    // Permission denied
  }

  // Node.js
  try {
    // deno-lint-ignore no-process-global
    if (typeof process !== "undefined" && process.env) {
      // deno-lint-ignore no-process-global
      return process.env.NODE_ENV === "production";
    }
  } catch {
    // Not available
  }

  // Bundlers (Vite, esbuild, etc.)
  try {
    // @ts-ignore - import.meta.env is non-standard but widely supported
    if (typeof import.meta.env !== "undefined" && import.meta.env.PROD) {
      return true;
    }
  } catch {
    // Not available
  }

  return false;
}

/**
 * Assert a condition is truthy (tiny-invariant style with inline configuration).
 * Uses TypeScript's `asserts` to narrow types based on the condition.
 * 
 * Note: Uses `any` for condition parameter to match tiny-invariant's behavior
 * and allow any value to be asserted.
 *
 * @example Simple assertion (tiny-invariant style)
 * ```typescript
 * import { assert } from "@zerocity/define-ensure";
 *
 * const value: string | null = getValue();
 * assert(value, "Value is required");
 * // TypeScript knows value is string (not null)
 * value.toUpperCase();
 * ```
 *
 * @example With custom error class
 * ```typescript
 * class ValidationError extends Error {}
 *
 * assert(email, {
 *   message: "Email required",
 *   error: ValidationError,
 * });
 * ```
 *
 * @example With all features
 * ```typescript
 * assert(config, {
 *   message: "Invalid config",
 *   error: ConfigError,
 *   formatMessage: (msg) => `[Config] ${msg}`,
 *   cleanStack: true,
 *   strip: true,
 *   cause: originalError,
 * });
 * ```
 *
 * @example Lazy message (only computed on failure)
 * ```typescript
 * assert(user, () => `User ${id} not found`);
 *
 * // Or with options
 * assert(user, {
 *   message: () => `User ${id} not found`,
 *   error: NotFoundError,
 * });
 * ```
 *
 * @example Create reusable wrapper for repeated config
 * ```typescript
 * class ValidationError extends Error {}
 *
 * function assertValid(condition: any, message: string): asserts condition {
 *   assert(condition, {
 *     message,
 *     error: ValidationError,
 *     formatMessage: (msg) => `Validation: ${msg}`,
 *     cleanStack: true,
 *   });
 * }
 *
 * // Use it
 * assertValid(email, "Email required");
 * assertValid(password.length > 8, "Password too short");
 * ```
 */
// deno-lint-ignore no-explicit-any
export function assert(condition: any, arg: AssertArg): asserts condition {
  if (!condition) {
    // Parse options
    const options =
      typeof arg === "string" || typeof arg === "function"
        ? { message: arg }
        : arg;

    const {
      message,
      error: ErrorClass = AssertError,
      cause,
      formatMessage,
      cleanStack = false,
      strip = false,
    } = options;

    // Resolve lazy message
    let finalMessage = typeof message === "function" ? message() : message;

    // Apply custom formatting
    if (formatMessage) {
      finalMessage = formatMessage(finalMessage);
    }

    // Strip message in production
    if (strip && isProduction()) {
      finalMessage = "Assertion failed";
    }

    // Create error
    const error = new ErrorClass(finalMessage, cause ? { cause } : undefined);

    // Clean stack trace (remove assert frame)
    if (cleanStack && Error.captureStackTrace) {
      Error.captureStackTrace(error, assert);
    }

    throw error;
  }
}

/**
 * Type guard for AssertError.
 *
 * @example
 * ```typescript
 * import { assert, isAssertError } from "@zerocity/define-ensure";
 *
 * try {
 *   assert(false, "Failed");
 * } catch (e) {
 *   if (isAssertError(e)) {
 *     // e is typed as AssertError
 *     console.log(e.message);
 *   }
 * }
 * ```
 */
export function isAssertError(value: unknown): value is AssertError {
  return value instanceof AssertError;
}
