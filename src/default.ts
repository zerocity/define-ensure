import { defineEnsure } from "./factory.ts";
import type { EnsureFn, IsErrorFn } from "./types.ts";

/**
 * Default error class for ensure.
 *
 * @example
 * ```typescript
 * import { ensure, EnsureError } from "@zerocity/define-ensure";
 *
 * try {
 *   ensure(null, "Value required");
 * } catch (e) {
 *   if (e instanceof EnsureError) {
 *     console.log(e.message); // "Value required"
 *   }
 * }
 * ```
 */
export class EnsureError extends Error {
  override name = "EnsureError";

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);

    // Maintains proper stack trace in V8 (Node/Chrome/Deno)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnsureError);
    }
  }
}

/**
 * Default ensure validator using EnsureError
 */
const _default: [EnsureFn, IsErrorFn<EnsureError>] = defineEnsure<EnsureError>({
  error: EnsureError,
  name: "ensure",
});

/**
 * Ensure a value is not null, undefined, or false.
 *
 * @example Basic assertion
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * const user = ensure(maybeUser, "User is required");
 * user.name; // ✅ TypeScript knows user is defined
 * ```
 *
 * @example Lazy message (only computed on failure)
 * ```typescript
 * const user = ensure(getUser(id), () => `User ${id} not found`);
 * ```
 *
 * @example Instance check
 * ```typescript
 * const date = ensure.instance(value, Date, "Expected a Date");
 * date.getTime(); // ✅ TypeScript knows it's a Date
 * ```
 */
export const ensure: EnsureFn = _default[0];

/**
 * Type guard for EnsureError.
 *
 * @example
 * ```typescript
 * import { ensure, isEnsureError } from "@zerocity/define-ensure";
 *
 * try {
 *   ensure(null, "Required");
 * } catch (e) {
 *   if (isEnsureError(e)) {
 *     // e is typed as EnsureError
 *     console.log(e.message);
 *   }
 * }
 * ```
 */
export const isEnsureError: IsErrorFn<EnsureError> = _default[1];
