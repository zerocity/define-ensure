import type {
  Constructor,
  DefineEnsureConfig,
  DefineEnsureReturn,
  EnsureArg,
  EnsureFn,
  ErrorConstructor,
  IsErrorFn,
  Message,
} from "./types.ts";

/**
 * Check if running in production mode.
 * Uses Deno.env for environment detection.
 */
function isProduction(): boolean {
  try {
    return Deno.env.get("DENO_ENV") === "production";
  } catch {
    // Permission denied or not available
    return false;
  }
}

/**
 * Resolve message from string or lazy function
 */
function resolveMessage(msg: Message): string {
  return typeof msg === "function" ? msg() : msg;
}

/**
 * Parse the ensure argument into normalized options
 */
function parseArg(arg: EnsureArg): {
  message: Message;
  error?: ErrorConstructor;
  cause?: unknown;
  strip?: boolean;
} {
  if (typeof arg === "string" || typeof arg === "function") {
    return { message: arg };
  }
  return arg;
}

/**
 * Create an ensure validator with custom configuration
 */
export function defineEnsure<E extends Error>(
  config: DefineEnsureConfig
): DefineEnsureReturn<E> {
  const {
    error: DefaultError,
    name,
    formatMessage,
    strip: defaultStrip = false,
  } = config;

  /**
   * Create and throw the error
   */
  function fail(arg: EnsureArg): never {
    const { message, error: ErrorClass, cause, strip } = parseArg(arg);

    const shouldStrip = strip ?? defaultStrip;

    let finalMessage: string;
    if (shouldStrip && isProduction()) {
      finalMessage = name ?? "Invariant failed";
    } else {
      finalMessage = resolveMessage(message);
      if (formatMessage) {
        finalMessage = formatMessage(finalMessage);
      }
    }

    const Ctor = ErrorClass ?? DefaultError;
    throw new Ctor(finalMessage, cause ? { cause } : undefined);
  }

  /**
   * Ensure value is not null, undefined, or false
   */
  function ensure<T>(
    value: T,
    arg: EnsureArg
  ): Exclude<T, null | undefined | false> {
    if (value === null || value === undefined || value === false) {
      fail(arg);
    }
    return value as Exclude<T, null | undefined | false>;
  }

  /**
   * Ensure value is instance of a class
   */

  function instance<T, C extends Constructor>(
    value: T,
    constructor: C,
    arg: EnsureArg
  ): InstanceType<C> {
    if (!(value instanceof constructor)) {
      fail(arg);
    }
    return value as InstanceType<C>;
  }

  // Attach helpers to main function
  const ensureFn = ensure as EnsureFn;
  ensureFn.instance = instance;

  /**
   * Type guard for the error class
   */
  const isError: IsErrorFn<E> = (value: unknown): value is E => {
    return value instanceof DefaultError;
  };

  return [ensureFn, isError];
}
