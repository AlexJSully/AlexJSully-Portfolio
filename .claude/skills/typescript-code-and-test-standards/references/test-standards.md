# Test standards

The test mandate, the one-file-per-source rule and its exemptions, the prohibitions, naming, and table-driven discipline. The compressed rules are in the skill body; mocking has its own reference.

## Contents

- The mandate
- One test file per source file
- Exemptions and why each one is exempt
- The prohibitions
- The question every test answers
- Naming
- Table-driven tests
- Shared setup
- Time, timers, and other flakiness sources
- Accessibility assertions
- Running tests and reading the result

## The mandate

**Logic changes, bug fixes, and new features land with their tests in the same change.** The test asserts the specific behaviour the change introduces or repairs, which is what locks the change against regression. A follow-up commit that promises tests later is a change without tests.

**Pure refactors, renames, and file moves need no new tests, but every existing test must still pass.** A diff that skips, deletes, or weakens a test is a behaviour change wearing a refactor's label.

For a bug fix specifically, the test should fail against the unfixed source. A test written after the fix that passes either way locks in nothing.

## One test file per source file

Colocated, same name, using whatever suffix the project already uses. A source file gives exactly one test file beside it.

That means no orphan test file without a same-named source beside it, no test file named after a function that lives in another file, and no second test file for one source. A second file for one source splits the picture of what that module guarantees, and the split is invisible from either half.

Where a source file has grown enough to want two test files, the signal is about the source, not the tests: it is doing more than one thing and wants splitting first.

## Exemptions and why each one is exempt

Each of these is exempt because there is no behaviour to lock in, not because testing them is inconvenient:

- **Static data modules.** A module that exports a literal has no code path. A test asserting the literal equals itself fails only when someone edits the data deliberately.
- **Type-only modules.** They emit nothing. The compiler already checks them.
- **Generated files.** The generator is the thing to test.
- **Framework metadata and route manifest exports.** They return a configuration object the framework consumes; the framework's own behaviour is not yours to test.
- **Instrumentation entry points.** They run once at process start and their effect is observed elsewhere.

**Components are not exempt.** They hold conditional rendering, event wiring, and prop handling, all of which are behaviour.

Confirm the host project's own exemption list before applying this one. A project that tests its data modules has a reason.

## The prohibitions

- **Never skip, gut, or delete a failing test.** Read the test, read the source, find the cause, fix it, and confirm it passes with real assertions.
- **Never use `.skip`** on a test or a suite. A skipped test is invisible failure with a maintenance cost. Remove it instead, and open an issue if the behaviour still matters.
- **Never write a no-op assertion.** `expect(true).toBe(true)` and its variants pass unconditionally.
- **Never assert the implementation back at itself.** A test that mirrors the code line for line fails only when the code changes shape, not when it breaks.
- **Never type-assert an already-typed value.** Checking that a `string` is a string tests the compiler, and the compiler already ran.
- **Never build a one-row table.** A table with one row is a loop that runs once, which is a plain test case written indirectly.
- **Never add a fallback in production code to make a test pass.** A `?? defaultValue` inserted to satisfy an assertion moves a defect from the test into production.

## The question every test answers

**What behaviour does this lock in that a real future change could break?**

If the answer is nothing, delete the test. If the answer is hard to state, the test is probably asserting an implementation detail.

The sharper version, useful in review: **would this test fail if the behaviour it names were broken?** A test that would keep passing through the break is not protecting anything, whatever its coverage contribution.

## Naming

The suite names the subject. The case names the behaviour, as a third-person verb phrase.

```ts
describe('SearchResults', () => {
	it('logs an analytics event when a result is opened', () => {});
	it('renders a fallback when the result list is empty', () => {});
});
```

New titles do not start with "should": it adds a word to every title and expresses doubt about the thing being asserted. Titles already written that way are grandfathered, so do not rewrite them in an unrelated change.

A second sibling suite separates a distinct concern rather than nesting deeper.

## Table-driven tests

Use a table when rows vary input and expected output across the **same** code path:

```ts
it.each([
	{ role: 'viewer', expectedActions: 1, label: 'Viewer' },
	{ role: 'editor', expectedActions: 3, label: 'Editor' },
] as const)('renders $expectedActions actions for $label ($role)', ({ expectedActions, label }) => {});
```

Name every field. Positional rows make the case unreadable at the call site and unmaintainable when a column is added.

Rows that differ in the assertion body rather than the data belong in separate cases: a table whose rows each run different code is a noisier loop with a shared title template.

## Shared setup

Put shared setup in the runner's before-each hook, and clear mock state there too. State that leaks between cases makes the order of the file load-bearing, which is a flakiness source that only shows up under a randomized or parallel run.

Prefer building a fresh subject per case over sharing one across the file.

## Time, timers, and other flakiness sources

- **Debounced or delayed behaviour** uses the runner's fake timers, installed in the before-each hook and torn down in the after-each hook after running pending timers. Real waiting in a test is slow and non-deterministic.
- **Wall-clock reads** (`Date.now()`, `new Date()`) and **unseeded randomness** (`Math.random()`) make a test depend on when and where it runs. Freeze the clock and seed or inject the randomness.
- **Iteration order** of a map, set, or directory listing relied on as stable will eventually differ. Sort before asserting.
- **An unawaited promise** produces a race between the assertion and the work.
- **A real network call or a sleep** in a test is a flake and a slowdown at once.
- **An assertion racing an animation or transition** passes on a fast machine and fails on a loaded one.

## Accessibility assertions

Assert through roles and accessible names rather than through class names or test identifiers where the framework's testing library supports it. A query by role fails when the element stops being reachable to assistive technology, which is behaviour worth locking in; a query by class name passes right through that break.

Where a dedicated accessibility assertion library is not installed for unit tests, that check usually lives in the project's end-to-end suite. Confirm which, rather than adding a dependency.

## Running tests and reading the result

- Run the single file first, then the suite.
- **Confirm the reported test count.** A runner configured to pass when no tests matched exits 0 on zero tests, so a green exit alone does not prove anything executed.
- **Confirm the exit code rather than reading the output.** Failures surface at the end of a long log, and scrolling is not a check.
- Where the project chains its gates with `&&`, a failure in an early step means the later steps never ran. Never record those as passed.
