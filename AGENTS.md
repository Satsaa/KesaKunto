## Package Context

Before working with a package or app, read the appropriate docs:

- **Using** a package as a dependency → Read its `USAGE.md`. Follow all patterns, API contracts, and examples strictly. Do NOT read INTERNAL.md nor README.md.
- **Modifying** a package or app → Read its `INTERNAL.md`. Follow all internal architecture rules, file structure, layering, and invariants. You may also read USAGE.md but it's not required.
- **Fallback** to reading `README.md` if the USAGE.md or INTERNAL.md file doesnt exist.

Docs live at `packages/<name>/USAGE.md`, `packages/<name>/INTERNAL.md`, `apps/<name>/USAGE.md`, `apps/<name>/INTERNAL.md`.
Larger feature folders may also provide these files.

Never use patterns or internal details from a package unless documented in the file you read. If instructions are unclear or conflicting, ask before generating code.

## Running Commands

```bash
# Install dependencies
pnpm install

# Run a command in a specific package
pnpm -F <package-name> exec <cmd>        # e.g. pnpm -F db exec tsx src/test.ts
pnpm -F <package-name> run <script>      # e.g. pnpm -F db run db:generate

# You do NOT need to run `cd`. `pnpm` will find the package in any project folder.

```
