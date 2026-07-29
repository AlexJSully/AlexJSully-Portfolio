---
paths:
    - "**/*.test.ts"
    - "**/*.test.tsx"
    - "cypress/**/*.ts"
    - "jest/**/*.ts"
    - "jest.config.js"
    - "cypress.config.ts"
---

# Testing

Jest with [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) covers units; Cypress with `cypress-axe` covers end-to-end and accessibility. Style rules that are not test-specific live in [`code-style.md`](code-style.md).

## Test mandate

- **Logic changes, bug fixes, and new features land with their tests in the same change.** The test asserts the specific behaviour the change introduces or repairs, so it locks the change against regression.
- **Pure refactors, renames, and file moves need no new tests, but every existing test must still pass.** A diff that skips or weakens a test is a behaviour change, not a refactor.
- Run `npm run validate` before reporting any change complete. See [`CLAUDE.md`](../../CLAUDE.md).

## One test file per source file

Colocated, same name: [`Banner.tsx`](../../src/components/banner/Banner.tsx) gives [`Banner.test.tsx`](../../src/components/banner/Banner.test.tsx). No orphan test file without a same-named source beside it, no test file named after a function (`useProjectHover.test.ts` for a hook that lives in another file), and no second test file for one source.

Exempt from the rule: static data modules such as [`projects.ts`](../../src/data/projects.ts), type-only modules, metadata route exports ([`manifest.ts`](../../src/app/manifest.ts), [`robots.ts`](../../src/app/robots.ts)), and instrumentation entry points. Components are **not** exempt.

## Never

- Skip, gut, or delete a failing test. Read the test, read the source, find the cause, fix it, confirm it passes with real assertions.
- Use `it.skip`, `describe.skip`, or `test.skip`. Remove a skipped test rather than leaving it.
- Write no-op assertions (`expect(true).toBe(true)`), assertions that restate the implementation, or type assertions of already-typed values (`expect(typeof name).toBe('string')` where `name: string`).
- Build a one-row `it.each` table. Make it a plain `it()`.
- Add a fallback in production code (`?? defaultValue`) to make a test pass. Fix the test.

Every test answers one question: what behaviour does this lock in that a real future change could break? If the answer is nothing, delete it.

## Mocking

**The default is not to mock.** A mock is a claim about how a dependency behaves, written by the person whose code is under test, and it keeps passing after the real dependency changes. Every one you add subtracts from what the test proves. A test whose collaborators are all mocked asserts only that mocks were called.

This applies to every substitution technique, not just `jest.mock`: stubs, fakes, spies that replace behaviour, hand-written doubles, and monkey-patching a module's export.

**Reach for a mock only when the real thing cannot run in the test.** Exhaust these first, in order:

1. Use the real implementation with real inputs. Most helpers, utilities, hooks, and components run fine in jsdom.
2. Pass a value in rather than replacing a module. A function that takes its dependency as an argument needs no mock.
3. Build a real object or fixture and assert on the real output.
4. Move the assertion to a level where the seam is real, or cover it in Cypress instead.

**Never mock code that holds logic**, whoever wrote it. Helpers, utilities, domain logic, components, hooks, constants, and the modules in [`src/data/`](../../src/data/projects.ts) are exercised for real. Never mock the subject under test, in whole or in part: a partial mock of the module you are testing means the test no longer tests it.

**Mock only at an input/output boundary**, and only the outermost one the test needs. The permitted boundaries are closed, and each is here because the real thing cannot run in jsdom:

| Boundary | What that means here |
| --- | --- |
| A third-party SDK that reaches the network | `firebase/app`, `firebase/analytics`, and `firebase/performance`, mocked in [`firebase.test.ts`](../../src/configs/firebase.test.ts) because the wrapper under test sits directly on them |
| This repo's own wrapper around such an SDK, when testing a consumer of it | [`@configs/firebase`](../../src/configs/firebase.ts) from a component test, so rendering does not fire live analytics |
| Framework context the test renderer cannot supply | `next/navigation` |
| The clock | `jest.useFakeTimers()`, which replaces the environment rather than your code |
| Browser APIs jsdom omits | `navigator` and similar |

A wrapper qualifies only because its whole job is to reach the outside world. That is the narrow exception to the rule above, not a licence to mock a repo module that computes something.

Anything outside that table needs a one-line comment above the mock naming which boundary it crosses. If you cannot write that sentence, the mock is not justified: use the real thing.

**Never mock to make a failing test pass.** A mock introduced while chasing a red test is hiding the failure, not fixing it.

Retrieve mock state with `jest.requireMock('@configs/firebase').logAnalyticsEvent` or `usePathname as jest.MockedFunction<typeof usePathname>`, never with `require()`.

`next/image` is left unmocked, and is the pattern to follow. It rewrites `src` through its loader, so the test asserts with `expect.stringContaining('profile_pic_drawn.webp')` rather than mocking the component to get an exact path.

## Naming

`describe('<Subject>')` names the component or module; `it('<third-person verb phrase>')` names the behaviour:

```tsx
describe('ProjectsGrid', () => {
	it('logs analytics on project hover and click', () => {});
});
```

New titles do not start with "should". Titles already written that way are grandfathered; do not rewrite them in an unrelated change. A second sibling `describe` separates a distinct concern (`describe('ProjectsGrid responsive columns')`).

## Table-driven tests

Use `it.each` when rows vary input and expected output across the **same** code path, as [`ProjectsGrid.test.tsx`](../../src/components/projects/ProjectsGrid.test.tsx) does for breakpoints:

```tsx
it.each([
	{ breakpoint: 'sm', expectedColumns: 2, minWidth: '600px' },
	{ breakpoint: 'md', expectedColumns: 3, minWidth: '900px' },
] as const)('renders $expectedColumns columns from $minWidth ($breakpoint)', ({ expectedColumns, minWidth }) => {});
```

Name every field; no positional rows. Rows that differ in the assertion body rather than the data belong in separate `it()` blocks, because a table whose rows each run different code is a noisier loop.

## House patterns

- `render` and `screen` from `@testing-library/react`. Use `fireEvent`; `@testing-library/user-event` is not a dependency.
- Shared setup goes in `beforeEach(() => { jest.clearAllMocks(); render(<Subject />); })`.
- Debounced or delayed behaviour uses `jest.useFakeTimers()` in `beforeEach` with `jest.runOnlyPendingTimers()` then `jest.useRealTimers()` in `afterEach`.
- Assert accessibility through roles and accessible names (`screen.getByRole('button', { name: /view more projects/i })`), label text, and `aria-*` attributes. `jest-axe` is not installed; axe runs in Cypress.
- Wrap the subject in [`ThemeRegistry`](../../src/components/ThemeRegistry.tsx) when the assertion depends on the theme, and render it bare when it does not.
- **Import carve-out:** the subject under test is imported relatively (`import Banner from './Banner';`) while collaborators use path aliases (`@components/ThemeRegistry`). This is the one documented exception to the alias rule in [`code-style.md`](code-style.md). Prettier's `importOrder` places the relative import last automatically.

## Cypress

Specs live in [`cypress/e2e/`](../../cypress/e2e/landing.cy.ts). Every `describe` closes with `afterEach(() => { cy.a11yCheck(); })`, the custom command defined in [`commands.ts`](../../cypress/support/commands.ts). No `baseUrl` is configured, so specs call `cy.visit('http://localhost:3000')` directly. Header and policy checks use `cy.request({ failOnStatusCode: false })` rather than driving the UI.

## Running tests

- One file: `npx jest src/components/banner/Banner.test.tsx`
- One case: `npx jest -t 'partial title'`
- `npm run test:jest` carries `--passWithNoTests`, so a green run alone does not prove any test executed. Confirm the reported test count.
- End to end: `npm run test:cypress:e2e` runs headless against a dev server; `npm run test:cypress:open` opens the runner. CI runs the headless form, see [`code-qa.yaml`](../../.github/workflows/code-qa.yaml).
- If `test:cypress:e2e` fails, quote the actual error. Treat it as an environment limit only when the Cypress **binary fails to launch**, an Electron or window-server error raised before any spec runs, since Cypress needs a GUI session that a headless agent shell may not have. A failing assertion inside a spec is a real failure and is never environmental.
