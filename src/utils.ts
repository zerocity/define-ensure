/**
 * Check if Error.captureStackTrace is supported.
 * 
 * The `cleanStack` option uses `Error.captureStackTrace` which is only
 * available in V8 JavaScript engines.
 * 
 * @returns true if running in V8 engine (Chrome, Edge, Node.js, Deno)
 * @returns false if running in non-V8 browser (Firefox, Safari)
 * 
 * @example
 * ```typescript
 * import { supportsCleanStack, assert } from "@zerocity/define-ensure";
 * 
 * if (supportsCleanStack()) {
 *   assert(value, { message: "Required", cleanStack: true });
 * } else {
 *   // Fallback for Firefox/Safari
 *   assert(value, "Required");
 * }
 * ```
 */
export function supportsCleanStack(): boolean {
  return typeof Error.captureStackTrace === "function";
}
