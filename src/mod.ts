/**
 * Type-safe runtime assertions with definable error factories and TypeScript narrowing.
 *
 * @example Basic usage
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * // Returns the value, narrowed by TypeScript
 * const user = ensure(maybeUser, "User is required");
 * user.name; // ✅ TypeScript knows user is defined
 * ```
 *
 * @example Custom validators with defineEnsure
 * ```typescript
 * import { defineEnsure } from "@zerocity/define-ensure";
 *
 * class ValidationError extends Error {
 *   override name = "ValidationError";
 * }
 *
 * const [validate, isValidationError] = defineEnsure({
 *   error: ValidationError,
 * });
 *
 * const email = validate(formData.email, "Email required");
 * ```
 *
 * @module
 */

// Default ensure (zero-config)
export { ensure, EnsureError, isEnsureError } from "./default.ts";

// Factory for custom validators
export { defineEnsure } from "./factory.ts";

// Types
export type {
  DefineEnsureConfig,
  DefineEnsureReturn,
  EnsureArg,
  Constructor,
  EnsureFn,
  EnsureOptions,
  ErrorConstructor,
  IsErrorFn,
  Message,
} from "./types.ts";
