---
applyTo: '**/*.ts,**/*.tsx,**/*.js,**/*.jsx'
---

# TypeScript code and test standards

Copy this file to `.github/instructions/typescript-standards.instructions.md` in your own repository. The `.instructions.md` suffix is required there; a plain `.md` file in that folder is ignored. It **duplicates** the skill rather than linking to it, because Copilot code review on github.com has no skill loader and cannot follow a link into a skill directory. Use this path when a repository policy prevents installing the skill itself. Note that `applyTo` takes a single comma-separated string, not a list; a list is silently ignored.

## Precedence

This project's formatter owns indentation, quotes, semicolons, width, trailing commas, and import order. Its linter owns unused variables, equality, and brace enforcement. Its compiler owns types. Never report a violation of a rule the project's configuration has turned off, and never change a configuration file to match these rules.

Everything below is what those tools cannot check.

## Comments

- **Comments describe the code as it stands.** Never narrate a change, a fix, or a prior state ("now uses", "changed to", "previously", "no longer", "restored"). Version control carries that, and the comment outlives the change that prompted it.
- **Never argue that the code is correct or safe.** A note defending a decision documents the edit rather than the code.
- A comment that contradicts the code is **corrected, not deleted**. The code is the truth.
- Delete commented-out code.
- Inside a function body, a comment restating the line beneath it is noise. On a public surface, redundancy is not a defect.
- **Never delete a tooling directive**: `//@ts-check`, `/// <reference types="..." />`, `// @ts-expect-error`, `eslint-disable`, `biome-ignore`, `istanbul ignore`, `prettier-ignore`, bundler magic comments, framework directives such as `'use client'`, and license headers. **Moving one is not deleting it**: where the same directive repeats across files and the tool reads that setting from its own configuration, setting the key once and removing the copies relocates the instruction, and the number removed goes in the change. What this forbids is stripping a directive during work that had no reason to touch it.
- Use `//` for implementation notes. No block comment inside a function body, except to name an argument at a call site: `someFunction(/* shouldRender= */ true)`.

## Documentation blocks

- **Every exported symbol carries one**, and so do the members of an exported structure: interface properties, object keys, enum values. Write for a reader meeting it for the first time. Reach for what the signature cannot express (why it exists, a constraint, an invariant, a caller obligation); where nothing better exists, a plain restatement is correct. Being obvious is not a defect on a public surface; being absent is.
- **Write it from the implementation, never from the symbol's name.** If the body cannot be read, leave the symbol undocumented and say so. A block invented from a name is how drift starts.
- **Types depend on whether the file is type-checked.** In a file the compiler checks, omit `@param {string}`, `@returns {number}`, `@type`, and `@typedef`: the compiler carries the type and the annotation drifts. In a plain JavaScript file where the documentation block **is** the type system, those annotations are load-bearing and stay. Check `tsconfig.json`, `jsconfig.json`, and any `//@ts-check` directive first.
- **Leave existing tags alone unless they are factually wrong.** Do not strip a `{type}` annotation, reword accurate prose, delete a tag for looking redundant, or reorder tags. Delete one only when it is wrong and uncorrectable, such as documenting a parameter the signature no longer has.
- `@throws`, `@example`, `@deprecated`, and `@see` are encouraged; none are expressible in the type system. `@deprecated` names its replacement.
- Open a function block with a third-person verb phrase ("Returns the parsed config").
- **No Markdown link syntax.** `[text](url)` is Markdown's, and `[name](#anchor)` renders as dead text in a hover tooltip. Use `{@link SymbolName}`, `@see https://example.com`, or `{@link https://example.com Display text}`.
- The block precedes a decorator and never sits between the decorator and the declaration.

## Readability

- Braced blocks except for a single-line early exit (`if (!data) return;`, `break`, `continue`, `throw`).
- A blank line before `return`, `break`, `continue`, and `throw` when not first in the block.
- No blank lines between `switch` cases.
- Separate groups doing different work with a blank line: setup, action, assertion.

## Tests

- **Logic changes, bug fixes, and new features land with their tests in the same change.** Pure refactors need no new tests, but no existing test may be skipped, deleted, or weakened. A diff that weakens a test is a behaviour change, not a refactor.
- **One test file per source file**, colocated and same-named. No orphan test file, no test file named after a function that lives elsewhere, no second test file for one source.
- **Never**: skip, gut, or delete a failing test; use `.skip`; write a no-op assertion or one that restates the implementation; type-assert an already-typed value; build a one-row table-driven test; or add a fallback in production code to make a test pass.
- Every test answers one question: what behaviour does this lock in that a real future change could break? The review form is sharper: **would this test fail if the behaviour it names were broken?**
- Name the subject in the suite and the behaviour in the case, as a third-person verb phrase. New titles do not start with "should".
- Table-driven tests name every field; no positional rows. Rows that differ in the assertion body belong in separate cases.
- Confirm the reported test count, not just a green exit: a runner configured to pass with no tests exits 0 on zero tests.

## Mocking

**The default is not to mock.** A mock is a claim about a dependency written by the person whose code is under test, and it keeps passing after the real dependency changes. A test whose collaborators are all mocked asserts only that mocks were called. This covers every substitution technique: stubs, fakes, behaviour-replacing spies, hand-written doubles, and monkey-patched exports.

**Exhaust these first, in order:**

1. Use the real implementation with real inputs.
2. Pass the value in rather than replacing a module.
3. Build a real object or fixture and assert on real output.
4. Move the assertion to a level where the seam is real, or cover it end to end.

**Never mock code that holds logic**, whoever wrote it: helpers, utilities, domain logic, components, hooks, constants, static data modules. The test is: if this module's body changed, should some test fail? Yes means it holds logic.

**Never mock the subject under test, in whole or in part.**

**Mock only at an input or output boundary**, and only the outermost one needed: a third-party SDK that reaches the network, the project's own thin wrapper around one when testing a consumer, framework context the renderer cannot supply, the clock, platform APIs the test environment omits, or a module with an unavoidable import-time side effect. A wrapper qualifies only because its whole job is to reach outside; the moment it validates, transforms, retries, or caches, it holds logic.

**Anything outside those boundaries needs a one-line comment above the mock naming the boundary it crosses.** If that sentence cannot be written, the mock is not justified.

**Never mock to make a failing test pass.** A mock introduced while chasing a red test hides the failure.

## Flakiness

Flag wall-clock reads and date arithmetic without a frozen clock, unseeded randomness, iteration order relied on as stable, an unawaited promise, a real network call or sleep in a test, state shared between cases through a module-level variable or uncleared mock state, and an assertion racing an animation.
