import { defineEnsure } from "./factory.ts";
import type { EnsureFn, IsErrorFn } from "./types.ts";

/**
 * Error class for invariant violations.
 * Compatible with tiny-invariant behavior.
 *
 * @example
 * ```typescript
 * import { invariant, InvariantError } from "@zerocity/define-ensure";
 *
 * try {
 *   invariant(false, "Something went wrong");
 * } catch (e) {
 *   if (e instanceof InvariantError) {
 *     console.log(e.name); // "InvariantError"
 *   }
 * }
 * ```
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
 * @example Basic usage
 * ```typescript
 * import { invariant } from "@zerocity/define-ensure";
 *
 * // tiny-invariant style, but returns the value!
 * const user = invariant(maybeUser, "User required");
 * user.name; // ✅ TypeScript knows user is defined
 * ```
 *
 * @example Instance check
 * ```typescript
 * const error = invariant.instance(caught, Error, "Expected Error");
 * error.message; // ✅ TypeScript knows it's an Error
 * ```
 */
export const invariant: EnsureFn = _invariant[0];

/**
 * Type guard for InvariantError.
 *
 * @example
 * ```typescript
 * import { invariant, isInvariantError } from "@zerocity/define-ensure";
 *
 * try {
 *   invariant(null, "Required");
 * } catch (e) {
 *   if (isInvariantError(e)) {
 *     // e is typed as InvariantError
 *     console.log(e.message);
 *   }
 * }
 * ```
 */
export const isInvariantError: IsErrorFn<InvariantError> = _invariant[1];
