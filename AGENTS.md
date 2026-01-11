# Agent Guidelines

## Documentation

All analysis reports, plans, and working documents should be placed in the `docs/` folder.

The `docs/` folder is gitignored - these are working documents for development purposes only and should not be committed to the repository.

## Conventions

- Use conventional commits for all changes
- Create atomic commits for each logical change
- Run `deno install` before committing to ensure `deno.lock` is up-to-date
- Use `mise run` commands for consistency with CI
