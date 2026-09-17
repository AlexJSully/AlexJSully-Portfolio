---
name: typescript-code-and-test-standards
description: "TypeScript and JavaScript standards that formatters and linters cannot catch: comment discipline, JSDoc on every exported symbol, naming and readability, language-level defects such as an unhandled promise, logic changes shipping with tests, one colocated test per source file, a mocking policy defaulting not to mock, reuse of what a dependency provides, and structure measured rather than sensed: file length, interface size, directory shape, parameter counts, function body size, repeated logic, and a setting repeated per file. Detects the project's own tooling configuration rather than imposing one. Use when writing or reviewing a .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, or .cts file, when adding or repairing a Jest, Vitest, Mocha, or Cypress test, when a failing test tempts a mock or a skip, when a behaviour is about to be hand-written, and whenever a file, interface, directory, function, or parameter list grows or logic repeats, even when SOLID, DRY, coupling, or splitting a module are never named."
license: MIT
metadata:
    version: '1.0.0'
    origin: 'https://github.com/AlexJSully/AlexJSully-Portfolio'
---

# TypeScript code and test standards

Covers `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, and `.cts`. It carries the discipline no tool checks: what a comment is allowed to say, what a documentation block owes a reader, when a test is required, and when a mock is justified.

## What this skill decides and what it does not

The host project's own tooling owns everything it is **configured** to check, and this skill never overrides it:

- The **formatter** owns indentation, quotes, semicolons, line width, trailing commas, and import order.
- The **linter** owns unused variables, equality operators, brace enforcement, and rule-level style, for every rule the project has turned on.
- The **compiler** owns types and strictness.

**A rule the project configured off is a decision. A rule it never configured is silence, and silence cedes nothing.** A linter running two rules has taken no position on the other thousand, so reading its quiet as a verdict is how an entire category goes unreviewed while every command exits 0.

This skill owns comments, documentation blocks, readability judgement, naming, structure, the test mandate, and mocking. Structure belongs here because no tool checks it: a formatter will lay out a two-thousand-line file and a linter will pass a twenty-member interface, so file length, interface size, directory shape, and repeated logic reach a reader only if someone counts them. It reports and follows configuration. **It never creates or edits a configuration file to make a project match itself**, which is not the same as setting a value the change itself requires at the level the tool reads it.

**What makes a finding this skill's**, and the test that keeps it from drifting into a review it cannot do: you can show the code is wrong by pointing at the language, the runtime's documented behaviour, or the type system, **without knowing what the program is for**. A `for...in` over an array, an array-spread of a non-iterable, a `parseInt` with no radix, an `as` that lies: each is provable from TypeScript or JavaScript alone. A wrong threshold, a wrong business rule, a wrong status code: each needs the intended behaviour to prove it, and this skill does not have that. So every finding names the language fact behind it, and one that would read identically against a file in another language has been written at the wrong altitude.

## Step 1: Detect the project

Read the project before writing anything. Never assume a convention this skill happens to prefer.

| Signal          | Read it from                                                                                                  | It decides                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Formatting      | `.prettierrc*`, `prettier.config.*`, a `prettier` key in `package.json`, `biome.json`, `dprint.json`          | Tabs or spaces, width, quotes, semicolons, trailing commas, import order         |
| Lint rules      | `eslint.config.*`, `.eslintrc*`, `biome.json`                                                                 | Which style rules are enforced and which are off                                 |
| Type strictness | `tsconfig.json`, `jsconfig.json`                                                                              | `strict`, `isolatedModules`, `paths` aliases, whether JavaScript is type-checked |
| Import style    | `compilerOptions.paths`, and what neighbouring files actually import                                          | Aliases against relative paths                                                   |
| Commands        | `package.json` scripts, `Makefile`, `justfile`, `pyproject.toml`                                              | How to format, lint, type check, test                                            |
| Test runner     | `jest.config.*`, `vitest.config.*`, `cypress.config.*`, `playwright.config.*`, a `jest` key in `package.json` | Test file naming, location, environment, path mapping                            |
| Editor defaults | `.editorconfig`                                                                                               | Indentation and line endings for files no formatter covers                       |
| Project rules   | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.claude/rules/*.md`, `.cursor/rules/*`          | Everything, see the precedence below                                             |

Full detail, including how to read a flat against a legacy lint config, is in [project-detection.md](references/project-detection.md).

### Precedence when signals disagree

1. **A project rules file beats this skill on every conflict, without exception.** If the project says something different, the project wins and you say nothing about it.
2. **The formatter beats `.editorconfig`** for every file the formatter formats. `.editorconfig` decides only for files no formatter covers.
3. **The linter beats this skill's readability rules** where the two overlap. A rule the project turned off is a decision, not an oversight. **A rule it never configured is not an overlap at all**, so its quiet settles nothing and the judgement stays here.
4. **No configuration answers the question:** match the surrounding code. Read two or three neighbouring files of the same kind and follow what they already do.
5. Never fall back to this skill's own preference for something a project has settled, and never introduce a formatting change the project did not ask for.

## Step 2: Choose a decision procedure

Writing new code, reviewing a diff, and fixing a failing test are different jobs. Pick one.

### Writing new code

1. Detect the project if you have not already.
2. Before writing a function whose behaviour has a name outside this project, run the three-source lookup in **Reuse** below. It is cheaper before the code exists than after.
3. Write to the detected formatting and let the formatter own layout. Do not hand-align anything a formatter will rewrite. **A formatter collapses blank lines and strips them at block edges but never inserts a separating one, and it leaves an unbraced single-statement `if` at whatever width it was written.** Neither grouping nor width is settled by running it, so both stay yours: see **Readability and naming** below.
4. Give every exported symbol a documentation block before moving on, including the members of exported structures. See **Documentation blocks** below.
5. Reread every comment you wrote and delete any that narrates the change rather than describing the code.
6. If the change is logic, a bug fix, or a feature, its test lands in the same change. If it is a pure rename, move, or refactor, add no test and weaken none.
7. Run the detected format, lint, type check, and test commands, and confirm the exit codes. Reading the output is not confirming the exit code.

### Reviewing code or a diff

**The default is to report, as a code review would, editing nothing.** Where the caller asked for a fix rather than a review, run the same pass and then apply it, which is step 5.

1. Detect the project.
2. **Run the project's own format, lint, and type check commands first.** Never report by eye something a tool reports by exit code, and never report a finding the project's configuration has already turned off. A rule the project never configured is not a rule it turned off.
3. Then review what tools cannot see, in the four groups below, in this order. **Each finding names two things: the TypeScript or JavaScript fact that makes it one, and the concrete replacement**, meaning the predicate's name, the bindings proposed, which members go into which type. A finding without a replacement defers the judgement rather than making it, and a finding that would read identically against another language is written at the wrong altitude for this skill.

    **Shape.**

    - **The seven structural counts**, taken first because they need no judgement and the rest of the review reads differently once you have them. See **Structure** below.
    - A block implementing behaviour that has a name outside this project, where the project's own modules, its manifest, or the standard library already provide it. See **Reuse** below.

    **The code itself.**

    - `any`, `as`, `!`, `@ts-ignore`, `{}`, and an object literal asserted where it could be annotated. See **The style digest** below, whose type-system and assertion rules are read on every review rather than kept for a tie.
    - A language-level defect: `for...in` over an array, an array-spread of a non-iterable, `parseInt` without a radix, `NaN` compared with `===`, a `switch` case falling through, an unhandled promise, or an `async` callback handed to `forEach` when the caller needs to await its completion. Same section.
    - A function body whose length, nesting, or widest expression runs past what a reader holds at once. See **Structure** below.
    - A binding whose name does not say what it holds, and a long condition a named predicate or type guard would explain. See **Readability and naming** below.
    - A body running as one block, with no blank line between the groups doing different work. The formatter will not insert one. Same section.
    - A construct spelled differently from how the rest of the codebase spells the same thing: a built-in module specifier (`node:fs` against `fs`, whichever of the two the codebase already uses), `import type` against a value import, an alias against a relative path.

    **Comments and documentation.**

    - A comment that narrates a change, explains why something was removed, or argues the code is correct or safe.
    - A missing or wrong documentation block on an exported symbol.
    - An existing documentation tag stripped or reworded. Deleting an accurate tag is itself a defect, not tidying.
    - Commented-out code, and any deleted tooling directive. A directive removed because its setting moved to the configuration the tool reads is not this finding.

    **Tests and mocks.**

    - A logic change with no test, or a test weakened, skipped, or deleted.
    - A test that would still pass if the behaviour it names were broken, cases that cannot fail independently of one another, and setup disproportionate to what the assertion reads. See **Tests** below.
    - **Every new mock.** Require the change to name the boundary it crosses in one line. If it cannot, the finding is an unjustified mock.

4. Run the bundled procedure for each subject the review touched: the test-quality pass wherever it touched a test, the comment pass wherever it touched a public surface. See **Bundled procedures** below.
5. **Only where the caller asked for a fix**, apply the findings in the order above, then run the detected format, lint, type check, and test commands and confirm the exit codes.

### Fixing a failing test

1. Read the test, read the source, and **name the cause in one sentence before editing anything.**
2. Decide which side is wrong. If the source is wrong, fix the source. If the test encodes a behaviour the change deliberately replaced, rewrite the test to assert the new behaviour and say so explicitly.
3. These are never the fix: `.skip`, deleting the test, deleting an assertion, loosening an assertion to something that cannot fail, adding a mock, adding a production fallback such as `?? defaultValue`, widening a type, or an `eslint-disable`.
4. A mock added while chasing a red test hides the failure rather than fixing it. If a mock seems necessary, restart the mocking ladder from the top.
5. Re-run the single test, then the suite. **Confirm the reported test count**, because a runner configured to pass with no tests exits 0 on zero tests.

## Comments

- **Comments describe the code as it stands.** Never narrate a change, a fix, or a prior state ("now uses", "changed to", "previously", "no longer", "restored"). Version control carries that, and the comment outlives the change that prompted it.
- **Name the line the comment describes**, which is the test a phrase list cannot replace. Point at the code beneath the comment that it is about; a comment you cannot attach to a line is not a comment about this code. It catches the case the list above misses, a comment explaining an **absence**: why something was removed, why an approach was not taken, what an earlier version did. Nothing in the file corresponds to it, because its subject is a decision, and the reader who wants that decision is reading the commit or the pull request where the diff proving it lives. _Bad:_ `// Removed the retry wrapper here since the SDK retries internally.` _Good:_ nothing, with that sentence in the commit message.
- **Never argue that the code is correct or safe.** A note defending a decision documents the edit rather than the code. Say what something does or why it exists; do not justify that it works.
- A comment that contradicts the code is **corrected, not deleted**. When the two disagree, the code is the truth.
- Delete commented-out code rather than leaving it in place.
- Inside a function body, a comment restating the line beneath it is noise. Delete those, and keep anything carrying a constraint, hazard, or non-obvious behaviour. On a public surface, redundancy is not a defect.
- **A fact about a symbol is documented once, on its declaration.** Never repeat it above the lines that read, call, or branch on that symbol: `// isBetaEnabled mirrors the beta-features flag` belongs on the declaration of `isBetaEnabled`, not above each `if (isBetaEnabled)`. Each member of an exported structure is its own declaration and keeps its own block; a usage site is not one. Where a copy above a use carries a constraint the declaration does not, fold that into the declaration rather than leaving both.
- **Never delete a tooling directive.** `//@ts-check`, `/// <reference types="..." />`, `// @ts-expect-error`, `eslint-disable`, `biome-ignore`, `istanbul ignore`, and `prettier-ignore` are instructions to a tool, not commentary. **Moving one is not deleting it.** Where the same directive repeats across files and the tool reads that same setting from its own configuration, setting the key once and removing the copies relocates the instruction rather than discarding it, and the number of copies removed goes in the change. What this rule forbids is stripping a directive during work that had no reason to touch it.
- Use `//` for implementation notes, and consecutive `//` lines for a multi-line note. No `/* */` block inside a function body, with one exception: naming an argument at a call site, `someFunction(/* shouldRender= */ true)`.

## Documentation blocks

- **Every exported symbol carries a documentation block, without exception**, and so do the members of an exported structure: interface properties, object keys, enum values. Write for a reader meeting it for the first time. Reach for what the signature cannot express: why it exists, a constraint, an invariant, a caller obligation. Where nothing better exists, a plain restatement is correct. Being obvious is not a defect on a public surface; being absent is.
- A private helper gets a block when its behaviour is not evident from its name and signature. A binding declared inside a function body does not.
- **Types in a documentation block depend on whether the file is type-checked.** In a file TypeScript checks, omit `@param {string}`, `@returns {number}`, `@type`, and `@typedef`: the compiler already carries the type, so the annotation becomes prose that drifts from the signature. **In a plain JavaScript file where the documentation block is the type system**, those annotations are load-bearing and stay. Check `tsconfig.json`, `jsconfig.json`, and any `//@ts-check` directive before removing one.
- **Leave existing tags alone unless they are wrong.** A tag already in the tree was added deliberately, annotation and all. Read the surrounding code, correct what is factually wrong, and change nothing else: do not strip a `{type}` annotation, reword accurate prose, or delete a tag for looking redundant. Delete one only when it is wrong and uncorrectable, such as documenting a parameter the signature no longer has.
- `@throws`, `@example`, `@deprecated`, and `@see` are encouraged: none are expressible in the type system. `@deprecated` names its replacement.
- Open a function or component block with a third-person verb phrase ("Returns the parsed config"), not an imperative.
- One tag per line, tag at line start. A block stays on one line until it overflows, at which point the delimiters move to their own lines. Bodies are Markdown, so an enumeration needs a real list rather than indented text.
- **No Markdown link syntax.** `[text](url)` is Markdown's, not JSDoc's, and `[name](#anchor)` is worse: there is no document to anchor into, so it renders as dead text. Reference a symbol with `{@link SymbolName}`, which the compiler resolves into working hover and Go to Definition. Point at an external page with `@see https://example.com`, or inline it as `{@link https://example.com Display text}`.
- The block precedes a decorator and never sits between the decorator and the declaration.

Worked before-and-after examples are in [comments-and-jsdoc.md](references/comments-and-jsdoc.md).

## Readability and naming

Prefer the readable form wherever it costs nothing at runtime, and wherever the project's linter has not decided otherwise by a rule it actually enables.

- Braced blocks for anything that is not a **short** single-line early exit. `if (!data) return;` may stay unbraced on one line, as may `break`, `continue`, and `throw`. Everything else takes braces, including a single-statement body that spans lines.
- **Length is what makes that exit readable, not the fact that it exits early.** A four-hundred-character condition returning a four-hundred-character expression is one line and is unreadable, and both halves are findings: brace the statement, and extract the condition to a named predicate. A linter configured as `curly: ['error', 'multi-line']` permits the long form, and a formatter prints an unbraced single-statement `if` as written however far past the print width it runs, so neither tool will say anything and the judgement is yours.
- A blank line before `return`, `break`, `continue`, and `throw` when it is not the first statement in its block.
- No blank lines between `switch` cases.
- Separate groups that do different work with a blank line: setup, action, assertion; or fetch, transform, render. **A body with no blank line anywhere is the finding**, whatever its length, because the formatter collapses and strips blank lines and never inserts one: a file written as a single block leaves the formatter as a single block, correctly indented and still unreadable.
- **A name is clear to a reader meeting it for the first time.** Do not abbreviate by deleting letters. A short name belongs to an established idiom in a tight scope, a loop index or a caught error, where a tight scope is one whose declaration and every use a reader sees at once, in practice under about ten lines. **Scope buys an idiom, never an arbitrary letter:** a run of unrelated single letters is an absent name rather than a short one, and `a`, `b`, `c` down a function is the case this rule exists for, at any length. A local alias of an existing symbol keeps the original's naming format.
- Extracting a long condition to a named predicate answers both the previous rule and this one at once, and in TypeScript a user-defined type guard (`function isFoo(x: unknown): x is Foo`) narrows at the call site where a bare `boolean` does not.
- Where the project's formatter runs after its linter's autofix, run the formatter again afterwards. A brace-inserting fix and a line-breaking formatter disagree, and the formatter's check is what CI runs.

## Structure

**Count before judging.** Structure is the one thing here that a reader misses by reading well: nothing inside a two-thousand-line file says it is long, and nothing in a twenty-member interface says most callers use four. Seven counts, each cheap, taken on any file you write or review:

- **Lines in the file.** Compare against the neighbouring files of the same kind, which is the comparison that survives a project whose conventions differ from yours. Where several of them sit in one directory, record the longest and the shortest beside the individual numbers: a screen-level composite standing next to a one-expression primitive is two altitudes held as peers, and the two numbers with their two paths are what shows it.
- **Members in each exported interface, type, or class**, alongside how many a caller actually uses. Open two callers and count. An interface whose typical caller touches four of twenty members is the interface-segregation case, and the count is what shows it rather than an opinion about cohesion.
- **Files sitting directly in the directory**, counted whatever subdirectories sit beside them, and whether the project's other directories at that level group their own files. A directory holding one subdirectory and two dozen loose files is not grouped: it holds one group and two dozen ungrouped files. A flat directory beside grouped siblings is the finding; a flat directory in a flat project is the convention.
- **Occurrences of a repeated block.** Two may be coincidence; three is a pattern, named with all three paths. This counts test cases too: three differing only in a value are one table-driven case, and cases that cannot fail independently of one another are one case wearing three names.
- **Files repeating one declaration**, meaning a setting, directive, suppression, or bootstrap import written into each file rather than into the configuration the tool reads. Count the files and name the key. **Look for the key, not for the directive's own spelling**, since the two are rarely the same word: a per-file test environment docblock against the runner's environment key, a per-file suppression comment against the linter's per-glob ignore map, a per-file build constraint against the build configuration's default.
- **Parameters of each function**, split into those supplying data and those switching behaviour, against the other functions in the same module. A switch is a parameter the body branches on rather than operates on, whatever its type, and each one holds a second behaviour inside one name. It is the defect in a utility, meaning a function named for one operation, exported for general use, sitting where shared code sits, or having callers that do not know about each other. A function coordinating a sequence takes its modes legitimately.
- **The shape of each function body**, as three numbers taken together: lines in the body, deepest nesting level, and the widest single expression a reader must hold at once. The six counts above measure everything around a function, the file it sits in, the type it takes, the directory it lives in, the signature it presents, and none of them reaches inside one, so a three-hundred-line body nested seven deep passes every one of them. It sits here rather than with the line-by-line reading because a long body is the rare defect that is visible on every line and walked past on all of them: no single line says the body is long, which is the same failure the other six counts exist for.

**A count is a trigger to look, never a finding.** What makes it one is the count plus the concrete split: which members go into which type, which files into which subdirectory, what the shared unit would hold, which key carries the declaration. Where the outlier test finds nothing because every sibling is equally large, fall back to a file past 600 lines, a type past 15 members, more than 20 files sitting directly in a directory, a block repeated three times, one declaration repeated in three files, more than one behaviour-switching parameter on a utility, or a function body past 50 lines, nested past three levels, or holding a condition of more than about three logical operators or wider than the project's own print width. Those numbers are the point where a reader stops holding the unit in their head at once, and they are approximate on purpose.

**Name the subdirectory from what the listing already shows.** Entries sharing a name prefix are the group, and four of twenty-four sharing one names both the group and the directory it should become. That signal costs nothing beyond the listing already taken, and a directory whose files are re-exported through a single barrel produces none, which is what keeps it off code that is already factored. Grouping by kind, by feature, by layer, and colocating a unit with its own tests are each a scheme, and a project applying one consistently has a convention: **what is measured is whether any grouping covers the files counted, never which scheme a project ought to adopt.**

**A repeated declaration is fixed by hoisting the majority and leaving the minority declared.** Count the majority over every file the setting governs rather than over the files in front of you, since a default taken from the files you happen to be reading can be the wrong value for the rest, and say what the new default does to the files already governed by it. Two conditions retire this count without a finding: values that differ file by file with no majority, so no default would carry them, and a tool that defines no project-level key for the setting. The second is a sentence to write rather than a count to drop, naming the key you looked for and the configuration file you read, because a key you did not find is not a key that does not exist.

TypeScript gives the split its own tools, so a proposal can be concrete without being a rewrite. An oversized interface separates into the interfaces each caller group actually needs, composed with `extends` or an intersection where a caller genuinely wants both, and `Pick<T, K>` narrows a parameter to the members a function reads without touching the declaration. A module carrying two reasons to change separates along that seam rather than by line count. A function taking a behaviour switch separates into one exported function per behaviour, which a union of literal types narrows only where the modes genuinely share a body; each resulting function has one caller the day it lands, and that is what a split looks like rather than a reason to keep the flag. A barrel file re-exporting a flat directory hides the shape rather than fixing it, and it costs tree shaking. An over-wide condition is usually type narrowing written inline, so it splits by extraction to a named predicate, and to a user-defined type guard (`function isFoo(x: unknown): x is Foo`) wherever the caller needs the narrowing to survive, which a bare `boolean` discards. A deeply nested body splits by early return, which keeps narrowing flat rather than indenting it, and a nested chain of `typeof`, `in`, and truthiness checks is the signal for a discriminated union read by an exhaustive `switch`.

**Duplication is reported; unifying it is a judgement.** Copies that would change for different reasons are not duplication, and merging them couples two things that only look alike. Say where the copies are and let the person decide, because an abstraction with a single caller costs more than the repetition it removed.

## Reuse

**Behaviour with a name outside this project is looked up before it is written.** Parsing or emitting a wire format, ordering version ranges, hashing, signing, verifying a token, scheduling retries with backoff, normalizing a path or a URL: each is specified somewhere, and a hand-written copy is a second implementation that the next fix to the first one will not reach. Check three sources in order, and say which you read:

1. **The project's own modules.** A helper doing this under a different name is the common case, and the structural counts above are where it surfaces.
2. **`package.json` and the lockfile.** A package the project already declares is the answer wherever it covers the case. A package present only transitively is not: importing it depends on another package's resolution, which is free to change.
3. **The standard library and the runtime platform**, read against the project's stated target rather than the newest runtime. `URL`, `URLSearchParams`, `Intl`, `structuredClone`, `AbortController`, and `crypto.subtle` each retire hand-written code where the target supports them.

**The third rung is reached by searching, not by failing to find.** Name the manifest you opened and the query you ran before concluding that nothing present provides the behaviour. **Read the imports at the top of the file you are in**, because a block hand-rolling half of what the file already imports is the shape this misses most often: the library verifies the signature, and the checks below it are written by hand. Read the lockfile beside the manifest, since the manifest lists what the project asked for and the lockfile lists what is actually resolved. **The import list is the trigger that does not depend on recognizing anything.** A named behaviour is looked up only once it is recognized, so the block that survives is the one whose name meant nothing to you: read the exported surface of a module a hand-written block sits beneath and appears to duplicate, and check it against that block.

**The tell is vocabulary.** Code spelling a specification's own field names is implementing that specification, whatever the enclosing function is called. Renaming those fields implements it too, so read what each value means rather than matching names against a list.

**This matters most where the code decides something.** Anything that signs, verifies, encrypts, hashes a credential, or settles an authorization outcome cannot be shown correct by reading it, and its failures are silent. There, a hand-written version is wrong even when nothing in it looks wrong.

**Where nothing present provides it, write that down and stop.** Adding a dependency is a supply-chain decision with a cost of its own and it belongs to the project, so this is never resolved by installing something.

**Three cases are not this.** A test building a value by hand to exercise a rejection path, since constructing the malformed input is the point of the test and routing it through the library under test deletes the case. A shim standing in for a platform feature the project's stated target lacks. And a project whose own subject is the behaviour.

## Tests

**The mandate.** Logic changes, bug fixes, and new features land with their tests in the same change, asserting the specific behaviour the change introduces or repairs. Pure refactors, renames, and file moves need no new tests, but every existing test must still pass. A change that skips or weakens a test is a behaviour change, not a refactor.

**One test file per source file**, colocated and same-named, following whatever suffix the project already uses. No orphan test file without a same-named source beside it, no test file named after a function that lives in another file, and no second test file for one source.

Files typically exempt: static data modules, type-only modules, generated files, framework metadata or route manifest exports, and instrumentation entry points. Components are **not** exempt. Confirm the project's own exemption list rather than assuming this one.

**Never:**

- Skip, gut, or delete a failing test. Read the test, read the source, find the cause, fix it, confirm it passes with real assertions.
- Use `.skip` on a test or suite. Remove a skipped test rather than leaving it.
- Write a no-op assertion (`expect(true).toBe(true)`), an assertion that restates the implementation, or a type assertion of an already-typed value.
- Build a one-row table-driven test. Make it a plain single case.
- Add a fallback in production code to make a test pass.
- Leave a test that would still pass if the behaviour it names were broken. Break the behaviour in your head and ask which assertion fails; if none does, the test names something it does not check.
- Write cases that cannot fail independently of one another. Several cases breaking together lock in one behaviour, not several, and the extra names cost a reader time while buying no coverage.
- Build setup or a fixture disproportionate to what the assertion reads. A forty-line object feeding a test that asserts one field states forty facts the test does not check, and every one of them is a reason the test breaks for the wrong reason.

Every test answers one question: what behaviour does this lock in that a real future change could break? **Each prohibition above is that question applied**, since each names a way a test can exist while answering nothing. If the answer is nothing, delete it.

Naming, table-driven discipline, and the full exemption reasoning are in [test-standards.md](references/test-standards.md).

## Mocking

**The default is not to mock.** A mock is a claim about how a dependency behaves, written by the person whose code is under test, and it keeps passing after the real dependency changes. Every one you add subtracts from what the test proves. A test whose collaborators are all mocked asserts only that mocks were called.

This applies to every substitution technique, not just a module mocker: stubs, fakes, spies that replace behaviour, hand-written doubles, and monkey-patching a module's export.

**Reach for a mock only when the real thing cannot run in the test.** Exhaust these first, in order:

1. Use the real implementation with real inputs. Most helpers, utilities, hooks, and components run fine in the test environment.
2. Pass a value in rather than replacing a module. A function that takes its dependency as an argument needs no mock.
3. Build a real object or fixture and assert on the real output.
4. Move the assertion to a level where the seam is real, or cover it in an end-to-end test instead.

**Never mock code that holds logic**, whoever wrote it. Helpers, utilities, domain logic, components, hooks, constants, and static data modules are exercised for real. **Never mock the subject under test, in whole or in part**: a partial mock of the module you are testing means the test no longer tests it.

**Mock only at an input or output boundary**, and only the outermost one the test needs. A boundary qualifies when the real thing cannot run in the test environment: a third-party SDK that reaches the network, the project's own thin wrapper around such an SDK when testing a consumer of it, framework context the test renderer cannot supply, the clock, and platform APIs the test environment omits.

A wrapper qualifies only because its whole job is to reach the outside world. That is a narrow exception, not a licence to mock a project module that computes something.

**Anything outside those boundaries needs a one-line comment above the mock naming which boundary it crosses.** If you cannot write that sentence, the mock is not justified: use the real thing.

**Never mock to make a failing test pass.** A mock introduced while chasing a red test is hiding the failure.

The escalation ladder, the logic-against-boundary test, and worked examples are in [mocking-policy.md](references/mocking-policy.md).

## The style digest

The [Google TypeScript Style Guide digest](references/google-typescript-style-digest.md) carries the rules a formatter and linter do not already enforce, and it is read two ways.

**Its quality half is a review input, read on every review rather than held for a tie.** That is the type system, assertions and suppressions, errors, and the language-defect rules. Each of those decides whether code is wrong, not which of two spellings a project prefers, so gating them on a question being open waits for a trigger a configured project never pulls.

**Its preference half settles a question the project left open**: imports and exports, naming case, the rules frameworks commonly override, and the stylistic remainder of the language features. Reach for those only when the project's configuration, its rules files, and the surrounding code all leave the question open.

A project that consistently applies a different variant of any of them has a preference, not a defect. Follow the project.

## Bundled procedures

Two procedure files ship with this skill. Each is self-contained, restating every rule it enforces so that it can be followed without any of this context. **Both of those procedures report findings and edit nothing**, whatever mode the run itself is in: where the caller asked for a fix, the fix is applied by the run that dispatched them, from what they returned.

**Subject decides whether a pass happens; size decides only whether to delegate it.** Run the test-quality pass wherever the work touched a test and the comment pass wherever it touched a public surface, however small the change. Handing one to a subagent is a question about keeping reading out of the main context, which is a cost, and a cost is never a reason a judgement goes unmade.

- [test-quality-reviewer.md](agents/test-quality-reviewer.md), for a test-quality pass weighted to over-mocking. Judging whether a mocked module holds logic means opening that module, its imports, and the subject under test, which is a lot of reading for a short answer.
- [comment-and-jsdoc-auditor.md](agents/comment-and-jsdoc-auditor.md), for a comment and documentation pass. Enumerating every export in a file set means reading whole files to produce a short list.

**Open the file and follow it yourself.** That works wherever this skill is installed and cannot fail. Where your host registers these files as agents you can delegate to, handing one off keeps that reading out of the main context, which is why both exist at all. Where delegating is unavailable, names an agent the host does not recognize, or errors, fall back to opening the file. **Never improvise instructions from a file's name or from its one-line summary above:** what each file is worth is the rules it restates, and a paraphrase carries none of them.

**A returned finding is a lead to verify, never a source to publish from.** It names a file and a symbol to open, and a judgement about a mock or a missing test is made against the code rather than against a summary of it.

There is deliberately no third procedure for style, because the review above covers it directly, and what a project's own linter and compiler are configured to report they report more reliably and at no token cost.

## Adopting this skill in a project

The skill is self-contained, so copying this directory into `.claude/skills/` is the whole install for any agent that reads the Agent Skills format.

Two drop-in templates cover the surfaces a skill directory does not reach:

- [project-rules.template.md](assets/project-rules.template.md) goes in `.claude/rules/`. It carries a `paths:` glob array and records the project-specific conventions this skill deliberately does not hold. Claude Code and the VS Code Copilot extension both read that location.
- [copilot-instructions.template.md](assets/copilot-instructions.template.md) goes in `.github/instructions/`. It carries an `applyTo:` glob string and is a self-contained digest rather than a pointer, because Copilot code review on github.com has no skill loader and cannot follow a link into a skill directory. Use this path when a repository policy prevents installing the skill itself.

## Verify

Run the project's own commands and confirm exit codes rather than reading output. Where a lint autofix ran, run the formatter again afterwards and finish with the formatter's check command, which is what CI runs. Confirm the reported test count, not just a green exit.
