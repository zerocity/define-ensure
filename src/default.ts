import { defineEnsure } from "./factory.ts";
import type { EnsureFn, IsErrorFn } from "./types.ts";

/**
 * Default error class for ensure
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

/** Ensure a value is not null, undefined, or false */
export const ensure: EnsureFn = _default[0];

/** Type guard for EnsureError */
export const isEnsureError: IsErrorFn<EnsureError> = _default[1];
