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

Mock external I/O and platform APIs only: [`@configs/firebase`](../../src/configs/firebase.ts), `next/navigation`, timers, and `navigator`. Never mock internal helpers, utilities, or domain logic; exercise those with real inputs and real outputs. Mocking everything tests nothing.

Retrieve mock state with `jest.requireMock('@configs/firebase').logAnalyticsEvent` or `usePathname as jest.MockedFunction<typeof usePathname>`, never with `require()`.

`next/image` is left unmocked. It rewrites `src` through its loader, so assert with `expect.stringContaining('profile_pic_drawn.webp')` rather than an exact path.

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
