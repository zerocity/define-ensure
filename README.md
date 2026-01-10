# ensure

Type-safe runtime assertions with customizable errors and TypeScript narrowing for Deno.

## Features

- **Type Narrowing**: TypeScript knows the value is defined after `ensure()`
- **Instance Checking**: Narrow `unknown` to specific class types
- **Custom Errors**: Create domain-specific validators with `defineEnsure()`
- **Lazy Messages**: Defer expensive message computation until failure
- **Error Chaining**: Support for `cause` option

## Quick Start

```typescript
import { ensure, EnsureError, isEnsureError } from "./mod.ts";

// Value assertion - returns NonNullable<T>
const user = ensure(maybeUser, "User is required");
user.name; // ✅ TypeScript knows user is defined

// Instance check - returns narrowed type
const date = ensure.instance(value, Date, "Expected Date");
date.getTime(); // ✅ TypeScript knows it's a Date

// Condition check
ensure(id > 0, "ID must be positive");
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

```typescript
import { defineEnsure } from "./mod.ts";

class ValidationError extends Error {
  override name = "ValidationError";
}

const [validate, isValidationError] = defineEnsure({
  error: ValidationError,
  formatMessage: (msg) => `Validation: ${msg}`,
});

// Now throws ValidationError instead of EnsureError
validate(email, "Email is required");
```

**Config options**:

| Option | Type | Description |
|--------|------|-------------|
| `error` | `ErrorConstructor` | Error class to throw |
| `formatMessage` | `(msg: string) => string` | Transform message before throwing |
| `strip` | `boolean` | Strip messages in production |
| `name` | `string` | Name for stripped messages |

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

## Permissions

The module checks `DENO_ENV` for production mode detection:

```bash
deno run --allow-env your-script.ts
```

If permission is denied, defaults to development mode (messages not stripped).

## Examples

### Form Validation

```typescript
import { defineEnsure } from "./mod.ts";

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
import { ensure } from "./mod.ts";

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  return ensure(data.user, `User ${id} not found`);
}
```

### Error Chaining

```typescript
import { ensure } from "./mod.ts";

try {
  const config = JSON.parse(rawConfig);
} catch (e) {
  ensure(false, {
    message: "Invalid configuration",
    cause: e,
  });
}
```
