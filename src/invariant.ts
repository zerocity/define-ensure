import { defineEnsure } from "./factory.ts";
import type { EnsureFn, IsErrorFn } from "./types.ts";

/**
 * Error class for invariant violations.
 * Compatible with tiny-invariant behavior.
 */
export class InvariantError extends Error {
  override name = "InvariantError";

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);

    // Maintains proper stack trace in V8 (Node/Chrome/Deno)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvariantError);
    }
  }
}

/**
 * tiny-invariant compatible validator.
 * - Strips messages in production (like tiny-invariant)
 * - Throws InvariantError
 * - Returns the value (unlike tiny-invariant)
 */
const _invariant: [EnsureFn, IsErrorFn<InvariantError>] =
  defineEnsure<InvariantError>({
    error: InvariantError,
    name: "Invariant failed",
    strip: true,
  });

/**
 * Drop-in replacement for tiny-invariant.
 * Messages are stripped in production. Returns the value for type narrowing.
 *
 * @example
 * ```typescript
 * // tiny-invariant style
 * invariant(user, "User required");
 *
 * // But now you can also capture the value:
 * const user = invariant(maybeUser, "User required");
 * ```
 */
export const invariant: EnsureFn = _invariant[0];

/** Type guard for InvariantError */
export const isInvariantError: IsErrorFn<InvariantError> = _invariant[1];
