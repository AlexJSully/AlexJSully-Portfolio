---
paths:
    - "**/*.ts"
    - "**/*.tsx"
    - "**/*.mts"
    - "**/*.cts"
---

# Code style

**Read [`typescript-code-and-test-standards`](../skills/typescript-code-and-test-standards/SKILL.md) before editing any TypeScript file here.** It carries the comment, JSDoc, readability, and Google style guide rules this file does not repeat, and it detects this repository's Prettier, ESLint, and TypeScript configuration rather than assuming one.

This file carries only what is specific to this repository. The same rules are duplicated in full in [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md), which the automated reviews read, so keep both in sync. Testing rules live in [`testing.md`](testing.md); every change ends with `npm run validate` at exit code 0, per [`CLAUDE.md`](../../CLAUDE.md).

## Imports

- **Always use path aliases, never relative paths.** Aliases are defined in [`tsconfig.json`](../../tsconfig.json) and mirrored in [`jest.config.js`](../../jest.config.js):
  `@/`, `@components/`, `@configs/`, `@constants/`, `@data/`, `@helpers/`, `@images/`, `@layouts/`, `@styles/`, `@util/`.
- Example: `import Avatar from '@components/banner/Avatar';` - not `'../banner/Avatar'`. Tests importing their own subject are the one exception; see [`testing.md`](testing.md).
- Import Node built-in modules with the **bare specifier** (`import { readFileSync } from 'fs'`), never the `node:` prefix. Matches the existing convention, for example `require('util')` in [`jest/setup.ts`](../../jest/setup.ts).
- Use `import type { Foo }` when a symbol is used only as a type, and `export type { Foo }` when re-exporting one. [`tsconfig.json`](../../tsconfig.json) sets `isolatedModules`, which requires the latter.

## Exports

Export style follows the kind of module. Components, layouts, App Router route files such as [`page.tsx`](../../src/app/page.tsx), the data modules such as [`projects.ts`](../../src/data/projects.ts), and [`theme.ts`](../../src/styles/theme.ts) default-export their subject. Configs, constants, helpers, utilities, instrumentation, and the SVG components in [`icons.tsx`](../../src/images/icons.tsx) use named exports. One module can carry both: [`layout.tsx`](../../src/app/layout.tsx) default-exports `RootLayout` beside named `metadata` and `viewport`. Never `export let`.

## Components and styling

- Style with Material-UI `sx` only.
- Import SVGs as React components via `@svgr/webpack` (see [`src/images/icons.tsx`](../../src/images/icons.tsx)).
- Components are **Server Components by default**; add `'use client'` only when the component needs hooks, event handlers, or browser APIs.
- Every component has a colocated `.test.tsx` (see [`Banner.test.tsx`](../../src/components/banner/Banner.test.tsx)).

## TypeScript

- Strict mode is on; types must be explicit (no implicit `any`).
- Do **not** "fix" an existing `any` by swapping it to `unknown` or adding an `eslint-disable` - replace it with a specific concrete type, and respect an `any` that is intentional.
- No `@ts-ignore` or `@ts-nocheck`. `@ts-expect-error` is permitted in tests only, with a comment.

## Google style guide carve-outs

Four rules from the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) digest in the skill do **not** apply here. Do not "fix" code to match them.

- **Default exports.** Google bans them; this repository uses them for the module kinds listed under Exports above.
- **Filenames.** Google specifies `snake_case`; this repository uses kebab-case directories with PascalCase component files ([`cookie-snackbar/CookieSnackbar.tsx`](../../src/components/cookie-snackbar/CookieSnackbar.tsx)).
- **Underscore prefixes.** Google bans `_` on identifiers. Here they are required on intentionally unused bindings, because [`eslint.config.js`](../../eslint.config.js) sets `no-unused-vars` with `argsIgnorePattern: '^_'` and `varsIgnorePattern: '^_'`.
- **Return-type annotations.** Optional, as Google leaves them. Add one where a complex return benefits.

## Toolchain

- Prettier owns formatting: tabs at width 4, semicolons, single quotes including JSX, `printWidth` 120, trailing commas everywhere, and import order via `@trivago/prettier-plugin-sort-imports`. Settings live in [`.prettierrc`](../../.prettierrc). Do not hand-adjust any of it.
- ESLint applies **one rule set to every file**, JavaScript and TypeScript alike, parsed by `@typescript-eslint/parser` (see [`eslint.config.js`](../../eslint.config.js)).
- `npm run validate` runs Prettier before ESLint, and the `curly` fix inserts braces inline. After any ESLint fix sweep, run `npm run prettier` again and finish with `npm run prettier:check`, which is what CI runs.
