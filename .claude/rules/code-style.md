---
paths:
    - "**/*.ts"
    - "**/*.tsx"
---

# Code style

These rules mirror [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) (the Copilot-side source); keep both in sync. Enforced in CI by `npm run prettier:check`, `npm run eslint:check`, and `npm run tsc`.

## Formatting

- **Tabs, not spaces** for indentation (ESLint errors otherwise).
- Semicolons required; single quotes (including JSX); `printWidth` 120; trailing commas everywhere.
- Imports are sorted automatically by `@trivago/prettier-plugin-sort-imports` — don't hand-order them.
- Prefix intentionally-unused variables/args with `_` (e.g. `_event`) so ESLint ignores them.

## Imports

- **Always use path aliases, never relative paths.** Aliases are defined in [`tsconfig.json`](../../tsconfig.json) and mirrored in [`jest.config.js`](../../jest.config.js):
  `@/`, `@components/`, `@configs/`, `@constants/`, `@data/`, `@helpers/`, `@images/`, `@layouts/`, `@styles/`, `@util/`.
- Example: `import Avatar from '@components/banner/Avatar';` — not `'../banner/Avatar'`.
- Import Node built-in modules with the **bare specifier** (`import { readFileSync } from 'fs'`), never the `node:` prefix (`'node:fs'`). Matches the existing convention — e.g. `require('util')` in [`jest/setup.ts`](../../jest/setup.ts).

## Components & styling

- Import SVGs as React components via `@svgr/webpack` (see [`src/images/icons.tsx`](../../src/images/icons.tsx)).
- Components are **Server Components by default**; add `'use client'` only when the component needs hooks, event handlers, or browser APIs.
- Every component has a colocated `.test.tsx` (see [`src/components/banner/Banner.test.tsx`](../../src/components/banner/Banner.test.tsx)).

## TypeScript

- Strict mode is on; types must be explicit (no implicit `any`).
- Do **not** "fix" an existing `any` by swapping it to `unknown` or adding an `eslint-disable` — replace it with a specific concrete type, and respect an `any` that is intentional.
