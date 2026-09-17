# Google TypeScript Style Guide digest

Digest of the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html), limited to rules a formatter and linter do not already enforce. It is read two ways.

**Type system**, **Assertions and suppressions**, **Errors**, and the **Defects** half of **Language features** are read on every review. Each decides whether code is wrong, provable from the language or the runtime without knowing what the program is for, so none of them waits for a question to be open.

The rest settles a question the host project's configuration, its rules files, and the surrounding code all leave open.

Anything the project's formatter settles (quotes, semicolons, line width, blank lines at block edges, import order, trailing commas) is out of scope: run the formatter, do not hand-adjust.

**What a formatter settles is narrower than it looks.** It collapses runs of blank lines and strips them at a block's edges, and it never inserts a separating one, so a body written without blank lines stays without them. It does not narrow an over-wide expression either: an unbraced single-statement `if` is printed as written however far past the print width it runs. Both of those judgements are the reader's, not the formatter's.

**A project that consistently applies a different variant of a rule below has a preference, not a defect.** Follow the project. Several of these rules are commonly and deliberately overridden, and each such rule says so where it applies.

## Contents

- Naming
- Type system
- Assertions and suppressions
- Imports and exports
- Language features (defects, then preferences)
- Errors
- Comments and documentation
- Rules frameworks commonly override

## Naming

- `UpperCamelCase` for classes, interfaces, types, enums, decorators, and type parameters.
- `lowerCamelCase` for variables, parameters, functions, methods, properties, and module aliases.
- `CONSTANT_CASE` for module-level constants and enum values that are genuinely immutable, not for every `const`.
- Treat acronyms as words: `loadHttpUrl`, not `loadHTTPURL`.
- A local alias of an existing symbol keeps the original's naming format.

## Type system

- Rely on inference. Omit annotations for values initialized to a literal or a `new` expression.
- `interface` for object shapes, not a `type` alias of an object literal.
- Use interfaces rather than classes to define structural types, and state the type at the symbol's declaration.
- Optional fields and parameters (`href?: string`) rather than `href: string | undefined`.
- Do not bake `| null` or `| undefined` into a type alias; add nullability at the use site.
- Google expresses no preference between `null` and `undefined`. Follow the host project's prevailing convention, which the surrounding code will show.
- Avoid `any`. Provide a concrete type, or use `unknown` and narrow it with a type guard. **Never launder an existing `any` into `unknown` to quiet a linter**, and respect an `any` that is deliberate.
- Do not use `{}` as a type. Use `unknown`, `object`, or `Record<string, T>`.
- `T[]` and `readonly T[]` for simple element types; `Array<T>` for anything more complex.
- Give index signatures a meaningful key label (`{ [userName: string]: number }`), and consider `Map`, `Set`, or `Record<Keys, Value>` instead.
- Use the simplest type construct that expresses the code. Repetition costs less than clever conditional and mapped types.
- Never `String`, `Boolean`, or `Number` as types or constructors. Use the lowercase primitives.
- Avoid APIs whose generic appears only in the return type; when consuming one, pass the generic explicitly.

## Assertions and suppressions

- `as` and `!` are unsafe. Prefer a runtime check, and say why in a comment when one is impossible.
- Use `as`, never the angle-bracket form.
- **Annotate object literals (`const config: Foo = { ... }`) rather than asserting them.** The assertion silences excess-property checking, which is where this rule earns its keep.
- No `@ts-ignore` or `@ts-nocheck`: a specific compiler error usually signals a larger problem. `@ts-expect-error` is permitted in tests, with a comment.

## Imports and exports

- Named exports, exporting only what is used outside the module. See the override note below, since many frameworks require a default export for route and page files.
- `export let` is not allowed; expose a getter instead.
- `import type` when a symbol is used only as a type; `export type` when re-exporting one. A project that sets `isolatedModules` requires the latter.
- Prefer named imports for frequently used symbols; prefer a namespace import when pulling many symbols from a large API.
- Renaming on import (`{ X as Y }`) is fine for collisions or clarity.
- Side-effect-only loads use `import '...';`.

## Language features

Split by what a violation is, because the two halves are read at different times. A **defect** is provable from the language or the runtime without knowing what the program is for, and is read on every review. A **preference** is read only where the project has left the question open.

### Defects

- Never `var`. Its function scoping makes a binding captured inside a loop hold the loop's final value in every closure.
- `===` and `!==` always, except `== null` when both `null` and `undefined` should match.
- Every `switch` has a `default`, placed last, and non-empty groups do not fall through.
- Prefer `for...of`. Never unfiltered `for...in`, which walks inherited enumerable keys and hands back an array's indices as strings; use `Object.keys()` or an own-property check.
- Never array-spread a non-iterable. `[...null]`, `[...undefined]`, and `[...42]` throw at runtime. Object spread is total, so `{...null}` evaluates to `{}` rather than throwing, which is why only the array form sits here.
- Convert types with `String()`, `Boolean()`, `Number()`, template literals, or `!!`, never with `new`. Do not use unary `+` for string to number. Check for `NaN` explicitly, since it compares unequal to everything including itself. Use `Number()` for a complete conversion and `parseInt` only to read a non-decimal base or a leading numeric substring, always with a radix.
- No `eval`, `with`, `debugger` in production, builtin prototype modification, or the `Array()` and `Object()` constructors. `Array(3)` builds three empty slots rather than an element.
- Do not set non-numeric properties on an array; use a `Map` or an object.
- `sort()` compares by string by default, so sorting numbers without a comparator puts 10 before 9.
- **A mishandled promise fails silently, which is what puts these here rather than among the preferences.** Flag a promise whose rejection is neither handled nor propagated, because the rejection surfaces as an unhandled rejection far from its cause. Flag an `async` callback handed to a non-awaiting iterator, `forEach` being the common one, when the caller needs to await the work it starts. Flag `map` producing promises without awaiting or returning an aggregate such as `Promise.all`.

### Preferences

- `const` by default, `let` when reassignment is needed. One variable per declaration.
- Braced blocks for control flow.
- Prefer function declarations for named functions; use arrow functions rather than function expressions. Use a concise arrow body only when the return value is used.
- Do not write an explicit boolean coercion where the context already coerces, such as an `if` or `while` condition. Enum values are the exception: compare them explicitly.
- Spread objects into objects and arrays into arrays only.
- Classes should not hold properties initialized to arrow functions, which obscures `this`.
- No `const enum`, no `require()` imports in a module file, and no `namespace Foo {}`.

## Errors

- Prefer throwing exceptions to ad hoc error handling.
- Always `new Error()`, never `Error()`.
- Throw only `Error` or a subclass; other values carry no stack trace.
- Treat caught values as `Error`, narrowing where needed. Doing nothing in a `catch` is rarely correct and requires a comment explaining why.
- Keep the body of a `try` small where that does not hurt readability.

## Comments and documentation

Google's own rules on this, which the skill's comment guidance extends rather than replaces:

- A documentation block for what a consumer of the code needs to know; `//` for implementation notes. Multi-line implementation comments use several `//` lines, never a block comment.
- Document all top-level exports.
- Do not restate types in a documentation block in a file the compiler type-checks. `@param {string}`, `@returns {number}`, `@type`, `@typedef`, `@implements`, and `@enum` are ignored there, so they become prose that drifts from the signature.
- `@param` and `@returns` lines are required only where they add information beyond the name and type. A block with a good summary and no tags is idiomatic.
- Do not use `@override`; the compiler does not enforce it, so it drifts.
- Document a non-obvious argument at the call site with a block comment (`foo(/* silent= */ true)`), or prefer an options object with destructuring.
- Write the documentation block before a decorator, not between the decorator and the declaration.
- Bodies are Markdown. Use `-` lists rather than whitespace alignment, and give each tag its own line.

## Rules frameworks commonly override

These four are the ones a host project most often contradicts on purpose. Check the project before applying any of them, and never "fix" code to match Google where the project has chosen otherwise.

- **Default exports.** Google bans them. Many frameworks require a default export for route, page, layout, and component files, and many projects extend that to their own components by convention.
- **Filenames.** Google specifies `snake_case`. Most JavaScript and TypeScript projects use kebab-case directories with either kebab-case or PascalCase file names.
- **Underscore prefixes.** Google bans `_` on identifiers. A project whose linter configures `no-unused-vars` with an `argsIgnorePattern` or `varsIgnorePattern` of `^_` requires the prefix on intentionally unused bindings, which inverts the rule.
- **Return-type annotations.** Google leaves these to the author rather than mandating them. Treat them as optional and add them where a complex return benefits, unless the project's linter requires them.
