import { defineEnsure } from "./factory.ts";

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
export const [ensure, isEnsureError] = defineEnsure<EnsureError>({
  error: EnsureError,
  name: "ensure",
});
