---
paths:
    - '**/*.ts'
    - '**/*.tsx'
    - '**/*.mts'
    - '**/*.cts'
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

## Structure and reuse

The counts, thresholds, and carve-outs behind these live in the skill. What follows is how they land here.

- **A component gets a directory, not a loose file.** Every one lives in its own kebab-case directory under `src/components/` with a PascalCase file and a colocated test, as [`navbar/Navbar.tsx`](../../src/components/navbar/Navbar.tsx) does. Six of the seven directories spell the name that way, and [`Stars/`](../../src/components/Stars/StarsBackground.tsx) is the single PascalCase exception rather than a second convention: match the six. Related files are grouped into a subdirectory rather than left flat beside unrelated ones, and entries sharing a name prefix are the group to propose.
- **Count the files sitting directly in a directory**, whatever subdirectories sit beside them: one subdirectory does not make the loose files next to it grouped. [`src/components/ServiceWorkerRegister.tsx`](../../src/components/ServiceWorkerRegister.tsx) and the two `ThemeRegistry` files sit directly in `src/components/` beside seven component directories, so the count there is three rather than ten.
- **A setting the tooling reads from configuration is set once, never per file.** [`jest.config.js`](../../jest.config.js) already sets `testEnvironment: 'jsdom'` for every test, so no test file carries a `@jest-environment` docblock. Path aliases are declared in [`tsconfig.json`](../../tsconfig.json) and mirrored in [`jest.config.js`](../../jest.config.js) rather than re-declared per import. Where the same directive would go into three or more files, **search for the key rather than for the directive's own spelling**, since the two are rarely the same word, and hoist the majority while leaving the minority declared. Moving a directive into the key the tool reads is not deleting it.
- **Reuse before writing.** Check this repository's own [`helpers`](../../src/helpers/ascii.ts) and [`util`](../../src/util/cookieConsent.ts) modules, then [`package.json`](../../package.json), then the platform, before hand-writing behaviour that has a name outside this repository. Where nothing present provides it, say so rather than adding a dependency. Never hand-roll anything that signs, verifies, hashes a credential, or settles an authorization outcome.

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
