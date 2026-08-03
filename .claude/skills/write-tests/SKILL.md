---
name: write-tests
description: Author or repair a Jest or Cypress test in this repository's house style. Use when adding a test, when a source change needs coverage, or when a test is failing and needs a root-cause fix rather than a weakened assertion.
---

# Write tests

The rules live elsewhere; this skill is the repository procedure for applying them.

- **Generic test discipline** (the mandate, one file per source, the prohibitions, naming, table-driven tests, the mocking ladder) is in [`typescript-code-and-test-standards`](../typescript-code-and-test-standards/SKILL.md). Read it first.
- **This repository's instances** (the closed mock boundary table, the test-file exemptions, the house render patterns, Cypress specifics) are in [`testing.md`](../../rules/testing.md).
- Style rules that are not test-specific are in [`code-style.md`](../../rules/code-style.md).

## Procedure

1. **Read the source and its existing test before touching either.** For a failing test, name the cause in one sentence first, then decide which side is wrong. If the source is at fault, fix the source.
2. **Check the exemption list** in [`testing.md`](../../rules/testing.md) before adding a file. Components are never exempt, and a source that already has a test never gets a second one.
3. **Write the test**, applying the skill's rules for shape, naming, assertions, and mocking.
4. **Validate.** Run the file first (`npx jest path/to/file.test.tsx`), then the suite (`npm run test:jest`), confirming each exit code with `echo "EXIT: $?"`. `--passWithNoTests` means exit code 0 alone does not prove your test ran, so check the reported test count.
5. **Run the remaining gates** per [`CLAUDE.md`](../../../CLAUDE.md), or delegate to the `validator` subagent.
