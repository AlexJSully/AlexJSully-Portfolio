# typescript-code-and-test-standards

TypeScript and JavaScript standards that formatters and linters cannot catch, applied while code is written or reviewed. It reads the project's own formatter, linter, compiler, and test-runner configuration first, and never overrides what that tooling is configured to check.

## What it covers

- Comment discipline, and a documentation block on every exported symbol.
- Naming, readability, and language-level defects such as an unhandled promise.
- Structure measured rather than sensed: file length, interface size, directory shape, parameter counts, and repeated logic.
- Reuse of what a dependency or the platform already provides.
- Logic changes shipping with tests, one colocated test per source file, and a mocking policy whose default is not to mock.

It applies to `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, and `.cts` files.

## Usage

An agent picks the skill up when writing or reviewing one of those files. Invoke it by name to apply it on request, for example `/typescript-code-and-test-standards`.

- "Review this module against the TypeScript standards"
- "Add tests for the parser without mocking the file system"

It also ships review subagents, reference material, and templates for adopting the standards in a project.

## Licence

MIT. The full text is in `LICENSE.txt`.
