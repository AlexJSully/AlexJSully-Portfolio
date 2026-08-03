# Alexander Sullivan's Portfolio - AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js portfolio website** using the **App Router** (not Pages Router), React, TypeScript, and Material-UI with Emotion. The project follows a modular structure with path aliases, comprehensive testing, and Progressive Web App (PWA) capabilities.

### Key Technologies & Integrations

- **Framework**: Next.js App Router with React Server Components
- **Styling**: Material-UI (MUI) + Emotion (use `sx` prop, not CSS modules)
- **Testing**: Jest (unit tests), Cypress (E2E tests with accessibility via cypress-axe)
- **Monitoring**: Sentry error tracking, Firebase Analytics/Performance, Vercel Speed Insights
- **PWA**: Service Worker in `public/sw.js`, manifest via `src/app/manifest.ts`

## Critical Workflows

### Development Commands

```bash
npm run dev               # Start dev server at localhost:3000
npm run validate          # Full check: prettier → eslint → tsc → jest → cypress → build → markdown
npm run test:jest         # Unit tests only
npm run test:cypress:e2e  # E2E tests headless
npm run build             # Production build
```

**Always run `npm run validate` before committing**, and frequently while making changes. This is the quality gate CI runs.

**Never make the repository depend on AI agent files.** If `.claude/` and `.github/prompts/` were deleted, everything must still build, test, and lint. No `package.json` script, config, workflow, or page under `docs/` may reference or invoke anything in them. The dependency runs one way: agent tooling may name a project command, never the reverse. The only exception is an ignore or exclude glob, which is inert when the path is absent. Agent tooling that needs running gets a target in `.claude/Makefile`, which is deleted along with the tooling it drives.

**Documentation and comments describe the current state, in every file type.** A comment, document, or config header states what the code does now. Never narrate the past ("replaces", "used to", "formerly", "for the first time", "unlike the old") and never name a file, flag, or tool that no longer exists: git carries that history, and a reader cannot check a claim against something that is gone. The future belongs nowhere but a `TODO`. Rationale worth keeping goes in a decision record of its own under `docs/`, created when the first one is needed, rather than scattered through the files it explains.

### Testing Requirements

- **One test file per source file**, colocated and same-named: `Banner.tsx` gives `Banner.test.tsx` (see `src/components/banner/Banner.test.tsx`). No orphan tests, no test file named after a function, no second test file for one source.
- **Logic changes, bug fixes, and new features land with their tests in the same change.** Pure refactors need no new tests, but every existing test must still pass. A diff that skips or weakens a test is a behaviour change, not a refactor.
- **Exempt** from needing a test: static data (`src/data/*`), type-only modules, metadata routes (`manifest.ts`, `robots.ts`), instrumentation entry points. Components are not exempt.
- **Never** skip, gut, or delete a failing test: read the test, read the source, fix the cause. No `it.skip`/`describe.skip`, no `expect(true).toBe(true)`, no assertions that restate the implementation, no `expect(typeof x).toBe('string')` on an already-typed value, no one-row `it.each` table, and never add a `?? fallback` in production code to make a test pass.
- **Do not mock.** Start from zero and add one only when the real dependency cannot run in the test. This covers every substitution technique: mocks, stubs, fakes, behaviour-replacing spies, hand-written doubles. A test whose collaborators are all mocked asserts only that mocks were called. Try first, in order: the real implementation with real inputs; passing the dependency in as an argument instead of replacing a module; a real fixture asserted on its real output; moving the assertion to where the seam is real, or into Cypress
- **Never mock code that holds logic**, whoever wrote it: helpers, utilities, domain logic, components, hooks, constants, `src/data/*`. Never mock the subject under test, even partially
- **Mock only at an I/O boundary**, outermost one needed, from this closed list: a third-party SDK that reaches the network (`firebase/*` in the wrapper's own test); this repo's wrapper around one when testing a consumer (`@configs/firebase` from a component test); framework context the renderer cannot supply (`next/navigation`); the clock (`jest.useFakeTimers()`); browser APIs jsdom omits (`navigator`). A wrapper qualifies only because its whole job is reaching the outside world. Anything else needs a comment naming which boundary it crosses; if you cannot write that sentence, use the real thing
- **Never mock to make a failing test pass** - that hides the failure. Read mock state with `jest.requireMock(...)` or `as jest.MockedFunction<typeof fn>`, never `require()`
- **Naming**: `describe('<Subject>')` plus `it('<third-person verb phrase>')`, e.g. `renders the ProjectsGrid title`. New titles do not start with "should"; existing ones are grandfathered.
- **Table-driven**: use `it.each` when rows vary input and expected output across the same code path, and name every field. Rows that differ in the assertion body belong in separate `it()` blocks.
- **House patterns**: `render`/`screen` from `@testing-library/react`; `fireEvent` (`@testing-library/user-event` is not a dependency); `beforeEach(() => { jest.clearAllMocks(); render(<X />); })`; fake timers via `jest.useFakeTimers()` with `jest.runOnlyPendingTimers()` in `afterEach`. Assert accessibility through roles and accessible names. `next/image` is not mocked, so assert its rewritten `src` with `expect.stringContaining`.
- **Import carve-out**: the subject under test is imported relatively (`./Banner`) while collaborators use path aliases. This is the one exception to the alias rule below.
- **Setup and E2E**: `jest/setup.ts` with the jsdom environment; Cypress specs in `cypress/e2e/`, every `describe` closing with `afterEach(() => { cy.a11yCheck(); })` (cypress-axe). No `baseUrl` is set, so specs call `cy.visit('http://localhost:3000')`.
- `npm run test:jest` carries `--passWithNoTests`, so exit code 0 alone does not prove a test ran. Check the reported count.
- **Coverage**: `npm run test:jest:coverage`. No threshold is configured, so it is a report rather than a gate.

## Project-Specific Conventions

### Path Aliases (Critical!)

Always use TypeScript path aliases defined in `tsconfig.json`:

```typescript
import Avatar from '@components/banner/Avatar';
// NOT '../components/banner/Avatar'
import { DELAYS } from '@constants/index';
// NOT '../../constants'
import { isNetworkFast } from '@util/isNetworkFast';
```

Also: import Node built-ins with the **bare specifier** (`import { readFileSync } from 'fs'`), never the `node:` prefix. Use `import type { Foo }` when a symbol is used only as a type, and `export type { Foo }` when re-exporting one (`isolatedModules` is on).

Export style follows the kind of module. Components, layouts, App Router route files (`src/app/page.tsx`), the data modules (`src/data/projects.ts`), and `src/styles/theme.ts` default-export their subject. Configs, constants, helpers, utilities, instrumentation, and the SVG components in `src/images/icons.tsx` use named exports. One module can carry both: `src/app/layout.tsx` default-exports `RootLayout` beside named `metadata` and `viewport`. Never `export let`.

### Component Patterns

#### Material-UI Styling

Use `sx` prop for styling, never inline styles or CSS modules:

```typescript
<Box
  component='div'
  sx={{
    display: 'flex',
    margin: '3rem auto',
    fontSize: 'clamp(1.5rem, 2.5rem, 2.5rem)',
  }}
>
```

#### SVG Icons Pattern

SVGs are imported as React components via `@svgr/webpack`. See `src/images/icons.tsx`:

```typescript
import Icon from './icons/example.svg';
export const ExampleIcon = (props: SvgIconProps) =>
  <SvgIcon component={Icon} inheritViewBox {...props} />;
```

### Data Management

Static data lives in `src/data/`:

- `projects.ts`: Project portfolio with typed interface
- `publications.ts`: Academic publications
- `socials.ts`: Social media links
- `keywords.ts`: SEO keywords array

### Constants Pattern

Centralized constants in `src/constants/index.ts` with `as const` for type safety:

```typescript
DELAYS.PROJECT_HOVER_VIDEO; // 1000ms before video plays on hover
THRESHOLDS.SNEEZE_TRIGGER_INTERVAL; // Easter egg triggers
NETWORK.SLOW_DOWNLINK_THRESHOLD; // Network performance checks
```

The module also exports `ANIMATIONS` and `MAX_STARS`.

## Code Style & Quality

### Linting & Formatting

- **Indentation**: Tabs (not spaces) - enforced by Prettier (`useTabs`, `tabWidth` 4 in `.prettierrc`)
- **Quotes and punctuation**: single quotes including JSX (`jsxSingleQuote`), semicolons required, trailing commas everywhere
- **Line length**: Prettier wraps at `printWidth` 120 (`.prettierrc`)
- **Import sorting**: Handled by `@trivago/prettier-plugin-sort-imports`

### ESLint Rules (see `eslint.config.js`)

**One rule set for every file**, JavaScript and TypeScript alike, parsed by `@typescript-eslint/parser`:

- Tabs for indentation (indent: ['error', 'tab']) and required semicolons
- Console logs allowed (`no-console: off`)
- Unused vars are an error, with `_`-prefixed names ignored (e.g. `_unusedParam`)
- `curly` and `padding-line-between-statements` enforce the readability rules below

### TypeScript

- **Strict mode**: Enabled in `tsconfig.json`
- **No implicit any**: All types must be explicit
- **React 19**: Uses new `react-jsx` transform
- Run `npm run tsc` to check types (no emit)
- Do **not** "fix" an existing `any` by swapping it to `unknown` or adding an `eslint-disable`. Replace it with a concrete type, and respect an `any` that is intentional.

Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) except where this file or the framework overrides it. The deltas that matter (fuller digest in [`google-typescript-style-digest.md`](../.claude/skills/typescript-code-and-test-standards/references/google-typescript-style-digest.md)):

- **Naming**: `UpperCamelCase` types and components, `lowerCamelCase` values, `CONSTANT_CASE` module-level constants and enum values. Acronyms are words: `loadHttpUrl`, not `loadHTTPURL`
- **Types**: `interface` for object shapes, not a `type` alias of an object literal; optional properties (`href?: string`) over `href: string | undefined`, with nullability added at the use site; `T[]` for simple element types and `Array<T>` for complex ones; never `String`, `Number`, or `Boolean` as types
- **Assertions**: annotate object literals (`const config: Foo = { ... }`) rather than asserting them, since `as` suppresses excess-property checking. `as` and `!` are unsafe, so prefer a runtime check and say why in a comment when one is impossible. Use `as`, never angle brackets
- **Suppressions**: no `@ts-ignore` or `@ts-nocheck`. `@ts-expect-error` is permitted in tests only, with a comment
- **Control flow**: `===` and `!==` always, except `== null` when both `null` and `undefined` should match. Prefer `for...of`, never unfiltered `for...in`
- **Errors**: throw only `Error` or a subclass, always via `new Error(...)`. An empty `catch` needs a comment saying why

Not adopted: `snake_case` filenames (kebab-case directories with PascalCase components here), the ban on `_` identifier prefixes (unused arguments require it), and mandatory return-type annotations.

### Readability

- Braced blocks for anything that is not a single-line early exit. `if (!data) return;` may stay unbraced on one line, as may `break`, `continue`, and `throw`; everything else takes `{ }`
- A blank line before `return`, `break`, `continue`, and `throw` when it is not the first statement in its block
- No blank lines between `switch` cases
- Separate groups that do different work with a blank line: setup, action, assertion; or fetch, transform, render
- JSX props sorted alphabetically, or grouped by purpose (identity, data, behaviour, styling). Choose one per component and do not mix

### Comments & JSDoc

- **Comments describe the code as it stands.** Never narrate a change, fix, or prior state ("now uses", "previously", "no longer", "restored", "replaces", "used to", "formerly", "for the first time"), and never name a file, flag, or tool that no longer exists; git history carries that. Never argue that the code is correct or safe, which documents the edit rather than the code. Delete commented-out code. A comment contradicting the code is corrected, not deleted
- **Every exported symbol carries a `/** */` block, without exception**, as do the members of an exported structure (interface properties, object keys, enum values). Write for a reader meeting it for the first time; where nothing beyond a restatement is true, restate. Being obvious is not a defect on a public surface, being absent is
- A private helper gets a block when its name and signature do not carry it; a binding inside a function body does not, and a comment there that restates the next line is noise
- **In a block you write, do not put types in JSDoc.** TypeScript ignores `@param {string}`, `@returns {number}`, `@type`, and `@typedef` in `.ts`/`.tsx`, so they drift from the signature. Skip `@implements`, `@enum`, `@private`, and `@override` beside the keyword, and add `@param`/`@returns` where they say more than the name and type do
- **Leave existing tags alone unless wrong.** A `@param`/`@returns` already in the tree was added deliberately, annotation and all. Read the surrounding code, fix what is factually wrong, change nothing else: do not strip a `{type}`, reword accurate prose, or delete a tag for looking redundant. Delete only when wrong and uncorrectable, such as documenting a parameter the signature no longer has
- `@throws`, `@example`, `@deprecated` (naming its replacement), and `@see` are encouraged: none are expressible in the type system. Open a block with a third-person verb phrase; one tag per line; bodies are Markdown
- **No Markdown link syntax in JSDoc.** `[text](url)` is Markdown's, not JSDoc's, and `[name](#anchor)` has no document to anchor into so it renders as dead text. Reference a symbol with `{@link SvgIconProps}`, which TypeScript resolves into working hover and Go to Definition; point at an external page with `@see https://example.com` or `{@link https://example.com Display text}`
- `//` for implementation notes, consecutive `//` for multi-line. No `/* */` inside a function body except to name an argument at a call site: `someFunction(/* shouldRender= */ true)`
- Never delete a directive: `//@ts-check`, `/// <reference types="..." />`, `// @ts-expect-error`, `eslint-disable`

## Next.js App Router Specifics

### Metadata & SEO

All metadata configured in `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: { template: `%s | ${metadataValues.title}`, default: metadataValues.title },
  keywords: seoKeywords,
  openGraph: { ... },
  robots: { index: true, follow: true },
};
```

### Server Components vs Client Components

- Default: Server Components (no `'use client'`)
- Client-only: Components with hooks, event handlers, browser APIs
- Example client component: `src/components/ServiceWorkerRegister.tsx`

### Security Headers

Security headers configured in `next.config.js` headers() function. The `/` route includes:

- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS)
- Referrer-Policy: same-origin
- Permissions-Policy

The `/sw.js` route sets Content-Type, Cache-Control, and Service-Worker-Allowed headers.

## Special Features

### Network Performance Optimization

`src/util/isNetworkFast.ts` checks Network Information API to conditionally load heavy assets based on connection speed.

### Easter Eggs

- `src/helpers/aaaahhhh.ts`: Fun image replacement logic triggered by avatar interactions
- `src/helpers/ascii.ts`: Console ASCII art

### Service Worker

- Lives in `public/sw.js` and served by Next.js from the public directory at `/sw.js`
- Registration in `src/components/ServiceWorkerRegister.tsx`
- Used for PWA offline support

## Firebase & Analytics

Initialize Firebase only client-side (see `src/configs/firebase.ts`):

```typescript
import { init, logAnalyticsEvent } from '@configs/firebase';

init(); // Call once on client mount
logAnalyticsEvent('event_name', { params });
```

## Documentation

Architecture docs in `docs/architecture/`:

- [`index.md`](../docs/architecture/index.md): system overview
- [`components/index.md`](../docs/architecture/components/index.md): per-component docs for Avatar, Projects, Publications, and the rest

When writing or editing any Markdown, the canonical spec is [`audit-docs.prompt.md`](prompts/audit-docs.prompt.md). The always-apply subset:

- **Zero hallucination**: document only what the code provably does. Know the file that proves a claim before writing it
- **No em-dashes or en-dashes**: replace each with a comma, parenthesis, colon, separate sentence, or a spaced hyphen, including existing ones in any file you edit
- **Canadian English** for prose you write or change (colour, behaviour, standardize), never for code identifiers, config keys, or package names
- **No subjective adjectives** (important, robust, seamless). State the fact that would earn the adjective
- Every file reference is a clickable Markdown link to a **file**, never a bare filename or a directory, and every Mermaid diagram carries both `accTitle` and `accDescr`
