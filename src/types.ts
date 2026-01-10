/**
 * Error class constructor type
 */
export type ErrorConstructor = new (
  message: string,
  options?: { cause?: unknown }
) => Error;

/**
 * Message can be a string or lazy function
 */
export type Message = string | (() => string);

/**
 * Options for ensure calls
 */
export interface EnsureOptions {
  message: Message;
  /** Override error class for this call */
  error?: ErrorConstructor;
  /** Cause for error chaining */
  cause?: unknown;
  /** Strip message in production (tiny-invariant behavior) */
  strip?: boolean;
}

/**
 * Second argument can be message or options object
 */
export type EnsureArg = Message | EnsureOptions;

/**
 * Configuration for defineEnsure factory
 */
export interface DefineEnsureConfig {
  /** Error class to throw */
  error: ErrorConstructor;
  /** Name for debugging/stack traces */
  name?: string;
  /** Transform message before passing to Error */
  formatMessage?: (message: string) => string;
  /** Strip messages in production by default (tiny-invariant behavior) */
  strip?: boolean;
}

/**
 * Type guard function
 */
export type IsErrorFn<E extends Error> = (value: unknown) => value is E;

export type Constructor<T = unknown> =
  | (new () => T)
  | (new (message?: string) => T)
  | (new (message?: string, options?: ErrorOptions) => T);

/**
 * The ensure function with attached helpers
 */
export interface EnsureFn {
  /**
   * Ensure value is not null, undefined, or false
   * @returns The value, narrowed to exclude null | undefined | false
   */
  <T>(value: T, arg: EnsureArg): Exclude<T, null | undefined | false>;

  /**
   * Ensure value is instance of a class
   * @returns The value, narrowed to InstanceType<C>
   */
  instance<T, C extends Constructor>(
    value: T,
    constructor: C,
    arg: EnsureArg
  ): InstanceType<C>;
}

/**
 * Return type of defineEnsure
 */
export type DefineEnsureReturn<E extends Error> = [EnsureFn, IsErrorFn<E>];
