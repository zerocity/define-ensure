# define-ensure

Type-safe runtime assertions with **definable error factories** and TypeScript narrowing.

Inspired by [tiny-invariant](https://github.com/alexreardon/tiny-invariant), but:

- ✅ **Returns the value** (tiny-invariant returns `void`)
- ✅ **Narrows TypeScript types** automatically
- ✅ **Custom error factories** via `defineEnsure()`

## Installation

```typescript
import { ensure, defineEnsure } from "jsr:@zerocity/define-ensure";
```

## Why define-ensure?

```typescript
// tiny-invariant: returns void, need separate variable
invariant(user, "User required");
user.name; // ❌ TypeScript still thinks user might be null

// define-ensure: returns the value, TypeScript narrows
const user = ensure(maybeUser, "User required");
user.name; // ✅ TypeScript knows user is defined
```

## Quick Start

```typescript
import { ensure, defineEnsure, EnsureError } from "@zerocity/define-ensure";

// Value assertion - returns the value, narrowed
const user = ensure(maybeUser, "User is required");
user.name; // ✅ TypeScript knows user is defined

// Instance check - returns narrowed type
const date = ensure.instance(value, Date, "Expected Date");
date.getTime(); // ✅ TypeScript knows it's a Date

// Condition check
ensure(id > 0, "ID must be positive");
```

## The Killer Feature: `defineEnsure()`

Create domain-specific validators with custom error classes:

```typescript
import { defineEnsure } from "@zerocity/define-ensure";

class ValidationError extends Error {
  override name = "ValidationError";
}

const [validate, isValidationError] = defineEnsure({
  error: ValidationError,
  formatMessage: (msg) => `Validation failed: ${msg}`,
});

// Now throws ValidationError instead of EnsureError
const email = validate(formData.email, "Email is required");

// Type-safe error handling
try {
  validate(null, "Required");
} catch (e) {
  if (isValidationError(e)) {
    // e is typed as ValidationError
  }
}
```

## API

### `ensure(value, message)`

Ensures a value is not `null`, `undefined`, or `false`.

```typescript
// Simple message
const user = ensure(getUser(id), "User not found");

// Lazy message (only computed on failure)
const user = ensure(getUser(id), () => `User ${id} not found`);

// With options
const user = ensure(getUser(id), {
  message: "User not found",
  cause: originalError,
});
```

**Returns**: The value, narrowed to exclude `null | undefined | false`

**Throws**: `EnsureError` when value is nullish or false

### `ensure.instance(value, Class, message)`

Ensures a value is an instance of a class.

```typescript
const date = ensure.instance(value, Date, "Expected Date");
const error = ensure.instance(caught, Error, "Expected Error");
```

**Returns**: The value, narrowed to `InstanceType<Class>`

**Throws**: `EnsureError` when instanceof check fails

### `isEnsureError(value)`

Type guard to check if a value is an `EnsureError`.

```typescript
try {
  doSomething();
} catch (e) {
  if (isEnsureError(e)) {
    // Handle ensure errors specifically
  }
}
```

### `defineEnsure(config)`

Create a custom validator with your own error class.

**Config options**:

| Option          | Type                      | Description                       |
| --------------- | ------------------------- | --------------------------------- |
| `error`         | `ErrorConstructor`        | Error class to throw              |
| `formatMessage` | `(msg: string) => string` | Transform message before throwing |
| `strip`         | `boolean`                 | Strip messages in production      |
| `name`          | `string`                  | Name for stripped messages        |

**Returns**: `[ensureFn, isErrorFn]` tuple

## Types

```typescript
// Message can be string or lazy function
type Message = string | (() => string);

// Full options object
interface EnsureOptions {
  message: Message;
  error?: ErrorConstructor;
  cause?: unknown;
  strip?: boolean;
}

// Second argument can be message or options
type EnsureArg = Message | EnsureOptions;
```

## Examples

### Form Validation

```typescript
import { defineEnsure } from "@zerocity/define-ensure";

class FormError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = "FormError";
  }
}

const [requireField] = defineEnsure({ error: FormError });

function validateForm(data: FormData) {
  const email = requireField(data.get("email"), "Email is required");
  const password = requireField(data.get("password"), "Password is required");

  return { email, password };
}
```

### API Response Handling

```typescript
import { ensure } from "@zerocity/define-ensure";

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  return ensure(data.user, `User ${id} not found`);
}
```

### Error Chaining

```typescript
import { ensure } from "@zerocity/define-ensure";

try {
  const config = JSON.parse(rawConfig);
} catch (e) {
  ensure(false, {
    message: "Invalid configuration",
    cause: e,
  });
}
```

## Migrating from tiny-invariant

Drop-in replacement with `invariant`:

```typescript
// Before (tiny-invariant)
import invariant from "tiny-invariant";
invariant(user, "User required");

// After (define-ensure) - same behavior, but returns the value!
import { invariant } from "@zerocity/define-ensure";
const user = invariant(maybeUser, "User required");
```

**Differences from tiny-invariant:**

| Feature | tiny-invariant | define-ensure `invariant` |
|---------|----------------|---------------------------|
| Returns value | ❌ `void` | ✅ Returns narrowed value |
| Strips messages in prod | ✅ | ✅ |
| Error class | `Error` | `InvariantError` |
| Type guard | ❌ | ✅ `isInvariantError()` |

**Or use `ensure` if you don't want message stripping:**

```typescript
import { ensure } from "@zerocity/define-ensure";
const user = ensure(maybeUser, "User required"); // Message always preserved
```

## Credits

Inspired by [tiny-invariant](https://github.com/alexreardon/tiny-invariant) by Alex Reardon.

## License

MIT
