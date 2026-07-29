---
name: google-ts-style
description: Digest of the Google TypeScript Style Guide with this repository's Next.js carve-outs marked. Use for a deliberate style pass over TypeScript, or to settle a style question that .claude/rules/code-style.md does not answer.
---

# Google TypeScript style

Digest of the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html), limited to rules that Prettier and ESLint do not already enforce here. The day-to-day subset lives in [`code-style.md`](../../rules/code-style.md); this file is the fuller reference.

Anything Prettier settles (quotes, semicolons, line width, blank lines at block edges, import order, trailing commas) is out of scope: run `npm run prettier`, do not hand-adjust.

## Carve-outs, read first

Four of Google's rules do not apply here. Do not "fix" code to match them.

- **Default exports.** Google bans them. Next.js App Router requires them for `page`, `layout`, `error`, `global-error`, `loading`, `not-found`, `template`, `manifest`, `robots`, `instrumentation`, and `middleware`. Named exports everywhere else.
- **Filenames.** Google specifies `snake_case`. This repository uses kebab-case directories with PascalCase component files ([`cookie-snackbar/CookieSnackbar.tsx`](../../../src/components/cookie-snackbar/CookieSnackbar.tsx)).
- **Underscore prefixes.** Google bans `_` on identifiers. Here, intentionally unused variables and arguments require it, because ESLint's `no-unused-vars` is configured with `argsIgnorePattern: '^_'`.
- **Return-type annotations.** Google leaves these to the author rather than mandating them. Treat them as optional and add them where a complex return benefits.

## Naming

- `UpperCamelCase` for classes, interfaces, types, enums, decorators, and type parameters.
- `lowerCamelCase` for variables, parameters, functions, methods, properties, and module aliases.
- `CONSTANT_CASE` for module-level constants and enum values that are genuinely immutable, not for every `const`.
- Treat acronyms as words: `loadHttpUrl`, not `loadHTTPURL`.
- Names must be clear to a new reader. Do not abbreviate by deleting letters. Variables in scope for ten lines or fewer may use short names.
- A local alias of an existing symbol keeps the original's naming format.

## Type system

- Rely on inference. Omit annotations for values initialized to a literal or a `new` expression.
- `interface` for object shapes, not a `type` alias of an object literal.
- Use interfaces rather than classes to define structural types, and state the type at the symbol's declaration.
- Optional fields and parameters (`href?: string`) rather than `href: string | undefined`.
- Do not bake `| null` or `| undefined` into a type alias; add nullability at the use site.
- Google expresses no preference between `null` and `undefined`. This codebase uses `undefined`, matching React and Next.js.
- Avoid `any`. Provide a concrete type, or use `unknown` and narrow it with a type guard. Never launder an existing `any` into `unknown` to quiet a linter, and respect an `any` that is deliberate.
- Do not use `{}` as a type. Use `unknown`, `object`, or `Record<string, T>`.
- `T[]` and `readonly T[]` for simple element types; `Array<T>` for anything more complex.
- Give index signatures a meaningful key label (`{ [userName: string]: number }`), and consider `Map`, `Set`, or `Record<Keys, Value>` instead.
- Use the simplest type construct that expresses the code. Repetition costs less than clever conditional and mapped types.
- Never `String`, `Boolean`, or `Number` as types or constructors. Use the lowercase primitives.
- Avoid APIs whose generic appears only in the return type; when consuming one, pass the generic explicitly.

## Assertions and suppressions

- `as` and `!` are unsafe. Prefer a runtime check, and comment why when one is impossible.
- Use `as`, never the angle-bracket form.
- Annotate object literals (`const config: Foo = { ... }`) rather than asserting them. The assertion silences excess-property checking, which is where this rule earns its keep.
- No `@ts-ignore` or `@ts-nocheck`: a specific compiler error usually signals a larger problem. `@ts-expect-error` is permitted in tests, with a comment.

## Imports and exports

- Named exports. Only export what is used outside the module.
- `export let` is not allowed; expose a getter instead.
- `import type` when a symbol is used only as a type; `export type` when re-exporting one. [`tsconfig.json`](../../../tsconfig.json) sets `isolatedModules`, which requires the latter.
- Prefer named imports for frequently used symbols; prefer a namespace import when pulling many symbols from a large API.
- Renaming on import (`{ X as Y }`) is fine for collisions or clarity.
- Side-effect-only loads use `import '...';`.
- This repository additionally requires path aliases over relative paths, and bare specifiers over the `node:` prefix. See [`code-style.md`](../../rules/code-style.md).

## Language features

- `const` by default, `let` when reassignment is needed, never `var`. One variable per declaration.
- `===` and `!==` always, except `== null` when both `null` and `undefined` should match.
- Braced blocks for control flow. See the readability rules in [`code-style.md`](../../rules/code-style.md), which are narrower than Google's.
- Every `switch` has a `default`, placed last, and non-empty groups do not fall through.
- Prefer `for...of`. Never unfiltered `for...in`; use `Object.keys()` or a `hasOwnProperty` check.
- Spread objects into objects and arrays into arrays only; never spread a primitive, `null`, or `undefined`.
- Prefer function declarations for named functions; use arrow functions rather than function expressions. Use a concise arrow body only when the return value is used.
- Classes should not hold properties initialized to arrow functions, which obscures `this`.
- Convert types with `String()`, `Boolean()`, `Number()`, template literals, or `!!`, never with `new`. Do not use unary `+` for string to number. Check for `NaN` explicitly. Reserve `parseInt` for non-decimal bases.
- Do not write an explicit boolean coercion where the context already coerces, such as an `if` or `while` condition. Enum values are the exception: compare them explicitly.
- No `const enum`. No `eval`, `with`, `debugger` in production, builtin prototype modification, `Array()` or `Object()` constructors, `require()` imports, or `namespace Foo {}`.
- Do not set non-numeric properties on an array; use a `Map` or an object.

## Errors

- Prefer throwing exceptions to ad hoc error handling.
- Always `new Error()`, never `Error()`.
- Throw only `Error` or a subclass; other values carry no stack trace.
- Treat caught values as `Error`, narrowing where needed. Doing nothing in a `catch` is rarely correct and requires a comment explaining why.
- Keep the body of a `try` small where that does not hurt readability.

## Comments and JSDoc

- `/** JSDoc */` for what a consumer of the code needs to know. `//` for implementation notes. Multi-line implementation comments use several `//` lines, never a `/* */` block.
- Document all top-level exports.
- Do not restate types in JSDoc. TypeScript ignores `@param {string}`, `@returns {number}`, `@type`, `@typedef`, `@implements`, and `@enum` in `.ts` and `.tsx` files, so they become prose that drifts from the signature.
- `@param` and `@returns` lines are required only where they add information beyond the name and type. A block with a good summary and no tags is idiomatic.
- Do not use `@override`; the compiler does not enforce it, so it drifts.
- Document a non-obvious argument at the call site with a block comment (`foo(/* silent= */ true)`), or prefer an options object with destructuring.
- Write the JSDoc block before a decorator, not between the decorator and the declaration.
- JSDoc is Markdown. Use `-` lists rather than whitespace alignment, and give each tag its own line.
