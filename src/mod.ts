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
