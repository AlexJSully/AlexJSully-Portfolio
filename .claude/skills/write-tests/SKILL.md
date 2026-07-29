---
name: write-tests
description: Author or repair a Jest or Cypress test in this repository's house style. Use when adding a test, when a source change needs coverage, or when a test is failing and needs a root-cause fix rather than a weakened assertion.
---

# Write tests

The rules are in [`.claude/rules/testing.md`](../../rules/testing.md); this skill is the procedure for applying them. Style rules that are not test-specific are in [`code-style.md`](../../rules/code-style.md).

**Scope.** One test file per source file, colocated and same-named. Adding a test never means adding a second test file for a source that already has one.

## Phases (run in order)

### 1. Read before writing

Read the source **and** its existing test. A failing test needs both before you touch either: read the test, read the source, then name the cause. If the source is at fault, fix the source. Weakening the assertion, adding `.skip`, or adding a fallback in production code to make the test pass are all prohibited.

Check whether the file is exempt from needing a test at all (static data, type-only modules, metadata route exports). Components are never exempt.

### 2. Choose the shape

Use `it.each` when rows vary input and expected output across the same code path; name every field, and never write a one-row table. Use a plain `it()` when the cases differ in what they assert rather than in their data, because a table whose rows run different code is a noisier loop.

Title the `describe` after the subject and the `it` after the behaviour, in third person: `renders the ProjectsGrid title`. Do not open a new title with "should".

### 3. Assert behaviour

Every test answers one question: what behaviour does this lock in that a real future change could break? If the answer is nothing, do not write it.

Reach for roles and accessible names (`getByRole('button', { name: /view more projects/i })`) before test IDs. Do not assert the types of already-typed values, restate the implementation, or write `expect(true).toBe(true)`.

### 4. Mock as little as possible

Mock external I/O and platform APIs only: `@configs/firebase`, `next/navigation`, timers, `navigator`. Never mock internal helpers, utilities, or domain logic; if you mock everything, you test nothing. Read mock state with `jest.requireMock(...)` or `as jest.MockedFunction<typeof fn>`, never `require()`.

### 5. Validate

Run the file first (`npx jest path/to/file.test.tsx`), then the suite (`npm run test:jest`), and confirm each exit code with `echo "EXIT: $?"`. `--passWithNoTests` means exit code 0 alone does not prove your test ran, so check the reported test count.

Then run the rest of the gates per [`CLAUDE.md`](../../../CLAUDE.md), or delegate to the `validator` subagent.
