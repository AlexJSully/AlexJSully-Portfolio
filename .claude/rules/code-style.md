---
paths:
    - "**/*.ts"
    - "**/*.tsx"
---

# Code style

These rules mirror [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) (the Copilot-side source); keep both in sync. Enforced in CI by `npm run prettier:check`, `npm run eslint:check`, and `npm run tsc`. Testing rules live in [`testing.md`](testing.md); every change ends with `npm run validate` at exit code 0, per [`CLAUDE.md`](../../CLAUDE.md).

## Formatting

- **Tabs, not spaces** for indentation, enforced by Prettier (`useTabs`, `tabWidth` 4 in [`.prettierrc`](../../.prettierrc)).
- Semicolons required; single quotes including JSX (`jsxSingleQuote`); `printWidth` 120; trailing commas everywhere.
- Imports are sorted automatically by `@trivago/prettier-plugin-sort-imports` - don't hand-order them.
- Prefix intentionally-unused variables/args with `_` (e.g. `_event`), which `no-unused-vars` ignores. This is a deliberate departure from the Google guide, which bans `_` on identifiers.
- ESLint applies **one rule set to every file**, JavaScript and TypeScript alike, parsed by `@typescript-eslint/parser` (see [`eslint.config.js`](../../eslint.config.js)).

## Imports

- **Always use path aliases, never relative paths.** Aliases are defined in [`tsconfig.json`](../../tsconfig.json) and mirrored in [`jest.config.js`](../../jest.config.js):
  `@/`, `@components/`, `@configs/`, `@constants/`, `@data/`, `@helpers/`, `@images/`, `@layouts/`, `@styles/`, `@util/`.
- Example: `import Avatar from '@components/banner/Avatar';` - not `'../banner/Avatar'`. Tests importing their own subject are the one exception; see [`testing.md`](testing.md).
- Import Node built-in modules with the **bare specifier** (`import { readFileSync } from 'fs'`), never the `node:` prefix (`'node:fs'`). Matches the existing convention - e.g. `require('util')` in [`jest/setup.ts`](../../jest/setup.ts).
- Use `import type { Foo }` when a symbol is used only as a type, and `export type { Foo }` when re-exporting one. [`tsconfig.json`](../../tsconfig.json) sets `isolatedModules`, which requires the latter.
- Export style follows the kind of module. Components, layouts, App Router route files such as [`page.tsx`](../../src/app/page.tsx), the data modules such as [`projects.ts`](../../src/data/projects.ts), and [`theme.ts`](../../src/styles/theme.ts) default-export their subject. Configs, constants, helpers, utilities, instrumentation, and the SVG components in [`icons.tsx`](../../src/images/icons.tsx) use named exports. One module can carry both: [`layout.tsx`](../../src/app/layout.tsx) default-exports `RootLayout` beside named `metadata` and `viewport`. Never `export let`.

## Components & styling

- Import SVGs as React components via `@svgr/webpack` (see [`src/images/icons.tsx`](../../src/images/icons.tsx)).
- Components are **Server Components by default**; add `'use client'` only when the component needs hooks, event handlers, or browser APIs.
- Every component has a colocated `.test.tsx` (see [`src/components/banner/Banner.test.tsx`](../../src/components/banner/Banner.test.tsx)).

## TypeScript

- Strict mode is on; types must be explicit (no implicit `any`).
- Do **not** "fix" an existing `any` by swapping it to `unknown` or adding an `eslint-disable` - replace it with a specific concrete type, and respect an `any` that is intentional.

### Google style guide

Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) except where this file or the framework overrides it. The rules below are the ones Prettier and ESLint do not already cover; the `/google-ts-style` skill holds the fuller digest for a deliberate style pass.

- `UpperCamelCase` for types and components, `lowerCamelCase` for values, `CONSTANT_CASE` for module-level constants and enum values.
- Treat acronyms as words: `loadHttpUrl`, not `loadHTTPURL`.
- `===` and `!==` always, except `== null` when both `null` and `undefined` should match.
- Annotate object literals (`const config: Foo = { ... }`) rather than asserting them (`{ ... } as Foo`). The assertion suppresses excess-property checking.
- `as` and `!` are unsafe. Prefer a runtime check, and say why in a comment when one is not possible. Use `as`, never the angle-bracket form.
- No `@ts-ignore` or `@ts-nocheck`. `@ts-expect-error` is permitted in tests only, with a comment.
- `interface` for object shapes, not a `type` alias of an object literal.
- Optional properties and parameters (`href?: string`) rather than `href: string | undefined`. Add nullability at the use site, not inside a type alias.
- `T[]` for simple element types, `Array<T>` for complex ones. Never `String`, `Number`, or `Boolean` as types.
- Throw only `Error` or a subclass, always via `new Error(...)`. An empty `catch` needs a comment saying why.
- Prefer `for...of`; never unfiltered `for...in`.

Not adopted from the guide: `snake_case` filenames (this repo uses kebab-case directories with PascalCase components), the ban on `_` identifier prefixes (unused arguments require it here), and any expectation of mandatory return-type annotations (the guide leaves that to the author).

## Readability

Prefer the readable form wherever it costs nothing at runtime.

- Braced blocks for anything that is not a single-line early exit. `if (!data) return;` may stay unbraced on one line, as may `break`, `continue`, and `throw`. Everything else takes `{ }`, including a single-statement body that spans lines. `curly` enforces this.
- A blank line before `return`, `break`, `continue`, and `throw` when it is not the first statement in its block. `padding-line-between-statements` enforces this for `return`, `continue`, and `throw`; `break` is written discipline, because the rule cannot tell a loop `break` from a `switch` `break`.
- No blank lines between `switch` cases.
- Separate groups that do different work with a blank line: setup, action, assertion; or fetch, transform, render.
- JSX props sorted alphabetically, or grouped by purpose (identity, data, behaviour, styling). Choose one per component and do not mix the two.

`npm run validate` runs Prettier before ESLint, and the `curly` fix inserts braces inline. After any ESLint fix sweep, run `npm run prettier` again and finish with `npm run prettier:check`, which is what CI runs.

## Comments

- **Comments describe the code as it stands.** Never narrate a change, a fix, or a prior state ("now uses", "changed to", "previously", "no longer", "restored"). Git history and pull requests carry that, and the comment outlives the change that prompted it.
- **Never argue that the code is correct or safe.** A note defending a decision, such as "`createStars` is declared below and is already initialized by the time this callback runs", documents the edit rather than the code. Say what something does or why it exists; do not justify that it works.
- A comment that contradicts the code is corrected, not deleted. When the two disagree, the code is the truth.
- Delete commented-out code rather than leaving it in place.
- Redundancy is not a defect on a public surface, but inside a function body a comment that restates the line beneath it is noise. Delete those; keep anything carrying a constraint, hazard, or non-obvious behaviour.
- Compiler and tooling directives are never comments to delete: `//@ts-check`, `/// <reference types="..." />`, `// @ts-expect-error`, and `eslint-disable` lines.

## JSDoc

- **Every exported symbol carries a [JSDoc](https://jsdoc.app/) `/** */` block, without exception**, and so do the members of an exported structure: interface properties, object keys, enum values. Write for a reader meeting it for the first time. Reach for what the signature cannot express (why it exists, a constraint, an invariant, a caller obligation); where nothing better exists, a plain restatement is correct. Being obvious is not a defect on a public surface; being absent is.
- A private helper gets a block when its behaviour is not evident from its name and signature. A binding declared inside a function body does not: the name and type already carry it.
- **In a block you are writing, do not put types in JSDoc.** TypeScript ignores `@param {string}`, `@returns {number}`, `@type`, and `@typedef` in `.ts`/`.tsx` files, so they become prose that drifts from the signature. Skip `@implements`, `@enum`, `@private`, and `@override` beside the corresponding keyword too, and add `@param`/`@returns` lines where they say more than the name and type already do.
- **Leave existing tags alone unless they are wrong.** A `@param` or `@returns` already in the tree was added deliberately, annotation and all. Read the surrounding code, correct what is factually wrong, and change nothing else: do not strip a `{type}` annotation, reword accurate prose, or delete a tag for looking redundant. Delete one only when it is wrong and uncorrectable, such as documenting a parameter the signature no longer has.
- `@throws`, `@example`, `@deprecated`, and `@see` are encouraged: none of them are expressible in the type system. `@deprecated` names its replacement.
- Open a function or component block with a third-person verb phrase ("Returns the parsed config"), not an imperative.
- One tag per line, tag at line start. A block stays on one line until it overflows, at which point `/**` and `*/` move to their own lines. Bodies are Markdown, so an enumeration needs a real list rather than indented text.
- **No Markdown link syntax in JSDoc.** `[text](url)` is Markdown's, not JSDoc's, and `[name](#anchor)` is worse still: there is no document to anchor into, so it renders as dead text. JSDoc has its own forms, so use them. Reference a symbol with `{@link SvgIconProps}`, which TypeScript resolves through its symbol table into working hover and Go to Definition. Point at an external page with `@see https://example.com`, or inline it as `{@link https://example.com Display text}`.
- `//` line comments for implementation notes; a multi-line note uses consecutive `//` lines. No `/* */` block inside a function body, with one exception: naming an argument at a call site, `someFunction(/* shouldRender= */ true)`.
