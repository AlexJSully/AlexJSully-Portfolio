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

**Read [`typescript-code-and-test-standards`](../skills/typescript-code-and-test-standards/SKILL.md) before writing or repairing a test here.** It carries the test mandate, the one-file-per-source rule, the prohibitions, naming, table-driven discipline, and the full mocking policy this file does not repeat.

Jest with [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) covers units; Cypress with `cypress-axe` covers end-to-end and accessibility. Style rules that are not test-specific live in [`code-style.md`](code-style.md). Every change ends with `npm run validate` at exit code 0, per [`CLAUDE.md`](../../CLAUDE.md).

This file carries only this repository's instances of the skill's rules.

## Mock boundaries in this repository

The permitted boundaries are closed. Each is here because the real thing cannot run in jsdom.

| Boundary | What that means here |
| --- | --- |
| A third-party SDK that reaches the network | `firebase/app`, `firebase/analytics`, and `firebase/performance`, mocked in [`firebase.test.ts`](../../src/configs/firebase.test.ts) because the wrapper under test sits directly on them |
| This repository's own wrapper around such an SDK, when testing a consumer of it | [`@configs/firebase`](../../src/configs/firebase.ts) from a component test, so rendering does not fire live analytics |
| Framework context the test renderer cannot supply | `next/navigation` |
| The clock | `jest.useFakeTimers()`, which replaces the environment rather than your code |
| Browser APIs jsdom omits | `navigator` and similar |

Anything outside that table needs a one-line comment above the mock naming which boundary it crosses.

Retrieve mock state with `jest.requireMock('@configs/firebase').logAnalyticsEvent` or `usePathname as jest.MockedFunction<typeof usePathname>`, never with `require()`.

`next/image` is left unmocked, and is the pattern to follow. It rewrites `src` through its loader, so the test asserts with `expect.stringContaining('profile_pic_drawn.webp')` rather than mocking the component to get an exact path.

## Test file exemptions

Exempt from needing a colocated test: static data modules such as [`projects.ts`](../../src/data/projects.ts), type-only modules, metadata route exports ([`manifest.ts`](../../src/app/manifest.ts), [`robots.ts`](../../src/app/robots.ts)), and instrumentation entry points. Components are **not** exempt.

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
- If `test:cypress:e2e` fails, quote the actual error. Treat it as an environment limit only when the Cypress **binary fails to launch**, an Electron or window-server error raised before any spec runs. A failing assertion inside a spec is a real failure and is never environmental.
