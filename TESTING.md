# Testing Instructions

## Setup

```bash
# Install tools via mise
mise install

# Setup husky git hooks
mise run setup
```

## Verify Commit Linting

### Test: Invalid commit message (should fail)

```bash
echo "test" >> README.md
git add README.md
git commit -m "bad message"
```

**Expected output:**
```
⧗   input: bad message
✖   type may not be empty [type-empty]
✖   subject may not be empty [subject-empty]

✖   found 2 problems, 0 warnings
husky - commit-msg script failed (code 1)
```

### Test: Valid commit message (should pass)

```bash
git commit -m "docs: update readme"
```

**Expected:** Commit succeeds

### Reset test changes

```bash
git reset --hard HEAD
```

## Valid Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting (no code change)
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Adding tests
- `build:` - Build system changes
- `ci:` - CI configuration
- `chore:` - Maintenance
- `revert:` - Revert previous commit

## CI Verification

```bash
mise run ci
```

Runs: `deno check`, `deno lint`, `deno test`
