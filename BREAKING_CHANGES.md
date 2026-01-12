# Breaking Changes

## Upcoming (Not Yet Released)

### Removed: `invariant`, `InvariantError`, `isInvariantError`

**Reason:** The exported `invariant` function was **not** a true drop-in replacement for tiny-invariant. It had different behavior:

- **tiny-invariant**: Uses `asserts` signature, narrows types in place, returns `void`
- **Our invariant**: Returns narrowed value, does not use `asserts`

**Migration:**

```typescript
// Before
import { invariant } from "@zerocity/define-ensure";
invariant(user, "Required");
user.name; // ❌ TypeScript still thinks user might be null

// After - use ensure instead
import { ensure } from "@zerocity/define-ensure";
const u = ensure(user, "Required");
u.name; // ✅ TypeScript knows u is not null
```

**Future:** We may add back a true `invariant` replacement using `asserts` after implementing `defineAssert`.
