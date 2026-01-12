/**
 * Error class constructor type.
 *
 * @example
 * ```typescript
 * class MyError extends Error {
 *   override name = "MyError";
 * }
 *
 * const ctor: ErrorConstructor = MyError;
 * ```
 */
export type ErrorConstructor = new (
  message: string,
  options?: { cause?: unknown }
) => Error;

/**
 * Message can be a string or lazy function.
 *
 * @example
 * ```typescript
 * // Simple string
 * const msg: Message = "User not found";
 *
 * // Lazy function (only called on failure)
 * const lazy: Message = () => `User ${id} not found`;
 * ```
 */
export type Message = string | (() => string);

/**
 * Options for ensure calls.
 *
 * @example
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * const user = ensure(maybeUser, {
 *   message: "User not found",
 *   cause: originalError,
 * });
 * ```
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
 * Second argument can be message or options object.
 *
 * @example
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * // String message
 * ensure(value, "Required");
 *
 * // Lazy message
 * ensure(value, () => `Value ${id} required`);
 *
 * // Options object
 * ensure(value, { message: "Required", cause: err });
 * ```
 */
export type EnsureArg = Message | EnsureOptions;

/**
 * Configuration for defineEnsure factory.
 *
 * @example
 * ```typescript
 * import { defineEnsure } from "@zerocity/define-ensure";
 *
 * const config: DefineEnsureConfig = {
 *   error: ValidationError,
 *   formatMessage: (msg) => `Validation: ${msg}`,
 *   strip: false,
 * };
 *
 * const [validate] = defineEnsure(config);
 * ```
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
  /**
   * Remove internal library frames from stack traces.
   * 
   * Note: Only works in V8 engines (Chrome, Edge, Node.js, Deno).
   * Silently ignored in Firefox and Safari.
   * 
   * @default false
   */
  cleanStack?: boolean;
}

/**
 * Type guard function returned by defineEnsure.
 *
 * @example
 * ```typescript
 * import { defineEnsure } from "@zerocity/define-ensure";
 *
 * class MyError extends Error {}
 * const [ensure, isMyError]: [EnsureFn, IsErrorFn<MyError>] = defineEnsure({
 *   error: MyError,
 * });
 *
 * if (isMyError(caught)) {
 *   // caught is typed as MyError
 * }
 * ```
 */
export type IsErrorFn<E extends Error> = (value: unknown) => value is E;

/**
 * Constructor type for instanceof checks.
 * Supports no-arg, message-only, and Error-style constructors.
 *
 * @example
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * // Works with built-in classes
 * const date = ensure.instance(value, Date, "Expected Date");
 *
 * // Works with custom classes
 * class MyClass {}
 * const instance = ensure.instance(value, MyClass, "Expected MyClass");
 * ```
 */
export type Constructor<T = unknown> =
  | (new () => T)
  | (new (message?: string) => T)
  | (new (message?: string, options?: ErrorOptions) => T);

/**
 * The ensure function with attached helpers.
 *
 * @example
 * ```typescript
 * import { ensure } from "@zerocity/define-ensure";
 *
 * // Value assertion
 * const user = ensure(maybeUser, "User required");
 *
 * // Instance check
 * const date = ensure.instance(value, Date, "Expected Date");
 * ```
 */
export interface EnsureFn {
  /**
   * Ensure value is not null, undefined, or false.
   * @returns The value, narrowed to exclude null | undefined | false
   */
  <T>(value: T, arg: EnsureArg): Exclude<T, null | undefined | false>;

  /**
   * Ensure value is instance of a class.
   * @returns The value, narrowed to InstanceType<C>
   */
  instance<T, C extends Constructor>(
    value: T,
    constructor: C,
    arg: EnsureArg
  ): InstanceType<C>;
}

/**
 * Return type of defineEnsure.
 *
 * @example
 * ```typescript
 * import { defineEnsure, type DefineEnsureReturn } from "@zerocity/define-ensure";
 *
 * class ApiError extends Error {}
 *
 * const result: DefineEnsureReturn<ApiError> = defineEnsure({
 *   error: ApiError,
 * });
 *
 * const [requireApi, isApiError] = result;
 * ```
 */
export type DefineEnsureReturn<E extends Error> = [EnsureFn, IsErrorFn<E>];
