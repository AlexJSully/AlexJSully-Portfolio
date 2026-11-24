# Google TypeScript Style Guide digest

Digest of the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html), limited to rules a formatter and linter do not already enforce. It is read two ways.

**Type system**, **Assertions and suppressions**, **Errors**, and the **Defects** half of **Language features** are read on every review. Each decides whether code is wrong, provable from the language or the runtime without knowing what the program is for, so none of them waits for a question to be open.

The rest settles a question the host project's configuration, its rules files, and the surrounding code all leave open.

Anything the project's formatter settles (quotes, semicolons, line width, blank lines at block edges, import order, trailing commas) is out of scope: run the formatter, do not hand-adjust.

**What a formatter settles is narrower than it looks.** It collapses runs of blank lines and strips them at a block's edges, and it never inserts a separating one, so a body written without blank lines stays without them. It does not narrow an over-wide expression either: an unbraced single-statement `if` is printed as written however far past the print width it runs. Both of those judgements are the reader's, not the formatter's.

**A project that consistently applies a different variant of a rule below has a preference, not a defect.** Follow the project. Several of these rules are commonly and deliberately overridden, and each such rule says so where it applies.

A link in parentheses after a rule names the guide's own section for it, on the page linked above.

## Contents

- Naming
- Type system
- Assertions and suppressions
- Imports and exports
- Language features (defects, then preferences)
- Classes
- Errors
- Comments and documentation
- Rules frameworks commonly override

## Naming

From the guide's [Naming](https://google.github.io/styleguide/tsguide.html#naming) section unless another link is given.

- `UpperCamelCase` for classes, interfaces, types, enums, decorators, type parameters, and component functions in TSX ([rules by identifier type](https://google.github.io/styleguide/tsguide.html#rules-by-identifier-type)).
- `lowerCamelCase` for variables, parameters, functions, methods, properties, and module aliases.
- `CONSTANT_CASE` for module-level constants, static fields of module-level classes, and module-level enum values. It tells a reader the value must not be modified, and may mark one that technically can be, such as an object that is not deeply frozen. A value instantiated more than once, such as a local inside a function, takes `lowerCamelCase` ([constants](https://google.github.io/styleguide/tsguide.html#constants)).
- Treat acronyms as words: `loadHttpUrl`, not `loadHTTPURL`.
- A local alias of an existing symbol keeps the original's naming format.
- **A `_` prefix marks a syntactically required identifier that is never used**, and a standalone `_` is allowed. Never use `_` as a suffix, never use a leading or trailing `_` to mark a property or method private, and omit a trailing unused parameter rather than prefixing it, except on a method meant to be overridden ([underscore prefix/suffix](https://google.github.io/styleguide/tsguide.html#underscore-_-prefixsuffix)).

## Type system

From the guide's [Type system](https://google.github.io/styleguide/tsguide.html#type-system) section unless another link is given.

- Rely on inference. Omit the annotation on an unexported variable or parameter initialized to a string, number, or boolean literal, and do not repeat a generic the annotation already states (`const x = new Set<string>()`). An exported symbol keeps an annotation where `isolatedDeclarations` requires one ([type inference](https://google.github.io/styleguide/tsguide.html#type-inference)).
- `interface` for object shapes, not a `type` alias of an object literal.
- Use interfaces rather than classes to define structural types, and state the type at the symbol's declaration.
- Do not bake `| null` or `| undefined` into a type alias; add nullability at the use site ([nullable/undefined type aliases](https://google.github.io/styleguide/tsguide.html#nullableundefined-type-aliases)).
- Google expresses no preference between `null` and `undefined`. Follow the host project's prevailing convention, which the surrounding code will show.
- Avoid `any`. Provide a concrete type, or use `unknown` and narrow it with a type guard. **Never launder an existing `any` into `unknown` to quiet a linter**, and respect an `any` that is deliberate.
- Do not use `{}` as a type. Use `unknown`, `object`, or `Record<string, T>`.
- `T[]` and `readonly T[]` for simple element types; `Array<T>` for anything more complex.
- Give index signatures a meaningful key label (`{ [userName: string]: number }`), and consider `Map`, `Set`, or `Record<Keys, Value>` instead.
- Use the simplest type construct that expresses the code. Repetition costs less than clever conditional and mapped types.
- Never `String`, `Boolean`, `Number`, or `Object` as types, and never call a primitive wrapper with `new`. Use `string`, `boolean`, `number`, and `object` ([wrapper types](https://google.github.io/styleguide/tsguide.html#wrapper-types)).
- Avoid APIs whose generic appears only in the return type; when consuming one, pass the generic explicitly.

## Assertions and suppressions

From the guide's [type and non-nullability assertions](https://google.github.io/styleguide/tsguide.html#type-and-non-nullability-assertions) and [@ts-ignore](https://google.github.io/styleguide/tsguide.html#ts-ignore) rules unless another link is given.

- `as` and `!` are unsafe. Prefer a runtime check, and say why in a comment when one is impossible.
- Use `as`, never the angle-bracket form.
- **Annotate object literals (`const config: Foo = { ... }`) rather than asserting them.** The assertion silences excess-property checking, which is where this rule earns its keep.
- An assertion between types that do not overlap goes through `unknown`, never `any` or `{}`, with a comment saying why it holds: `(x as unknown as Foo)` ([double assertions](https://google.github.io/styleguide/tsguide.html#double-assertions)).
- No `@ts-ignore` or `@ts-nocheck`: a specific compiler error usually signals a larger problem. `@ts-expect-error` is allowed only in unit tests, and the guide adds "though you generally should not", because it suppresses every error on the line. Prefer casting the one expression to the expected type, or to `any`, with a comment ([@ts-ignore](https://google.github.io/styleguide/tsguide.html#ts-ignore)).

## Imports and exports

From the guide's [Imports](https://google.github.io/styleguide/tsguide.html#imports) and [Exports](https://google.github.io/styleguide/tsguide.html#exports) sections unless another link is given.

- Named exports, exporting only what is used outside the module. See the override note below, since many frameworks require a default export for route and page files.
- `export let` is not allowed; expose a getter instead.
- `import type` when a symbol is used only as a type; `export type` when re-exporting one. A project that sets `isolatedModules` requires the latter.
- No `import('./foo').Foo` inside a type annotation; use `import type` ([dynamic import() type](https://google.github.io/styleguide/tsguide.html#dynamic-import-type)).
- Prefer named imports for frequently used symbols; prefer a namespace import when pulling many symbols from a large API.
- Renaming on import (`{ X as Y }`) is fine for collisions or clarity.
- Side-effect-only loads use `import '...';`.
- No class holding only static methods or properties for the sake of namespacing; export the constants and functions individually ([container classes](https://google.github.io/styleguide/tsguide.html#container-classes)).

## Language features

From the guide's [Language features](https://google.github.io/styleguide/tsguide.html#language-features) section unless another link is given.

Split by what a violation is, because the two halves are read at different times. A **defect** is provable from the language or the runtime without knowing what the program is for, and is read on every review. A **preference** is read only where the project has left the question open.

### Defects

- Never `var`. Its function scoping makes a binding captured inside a loop hold the loop's final value in every closure.
- `===` and `!==` always, except `== null` when both `null` and `undefined` should match.
- Every `switch` has a `default`, placed last, and non-empty groups do not fall through.
- Prefer `for...of`. Never unfiltered `for...in`, which walks inherited enumerable keys and hands back an array's indices as strings; use `Object.keys()` or an own-property check.
- Never array-spread a non-iterable. `[...null]`, `[...undefined]`, and `[...42]` throw at runtime. Object spread is total, so `{...null}` evaluates to `{}` rather than throwing, which is why only the array form sits here.
- Convert types with `String()`, `Boolean()`, `Number()`, template literals, or `!!`, never with `new`. Do not use unary `+` or `parseFloat` to turn a string into a number: the first is easy to miss in review and the second silently ignores trailing garbage. Use `parseInt` only where a non-decimal radix is required, after checking that every character is a valid digit. Check the result of any numeric conversion for `NaN`, since it compares unequal to everything including itself ([coercing to numbers](https://google.github.io/styleguide/tsguide.html#coercing-to-numbers)).
- **Never coerce an enum value to a boolean**, whether with `Boolean()` or `!!` or implicitly in an `if` or `while` condition. The first declared member of a numeric enum is `0` and falsy, so the check reads a valid value as absent; compare against a named member instead ([type coercion](https://google.github.io/styleguide/tsguide.html#type-coercion)).
- No `eval` or `Function(...string)` constructor outside a code loader, and no `with`, `debugger` in production, builtin prototype modification, or the `Array()` and `Object()` constructors. `Array(3)` builds three empty slots rather than an element ([dynamic code evaluation](https://google.github.io/styleguide/tsguide.html#dynamic-code-evaluation)).
- Do not set non-numeric properties on an array; use a `Map` or an object.
- `sort()` compares by string by default, so sorting numbers without a comparator puts 10 before 9.
- **Pass an arrow function that forwards its arguments, not a named function, as a callback**, unless both signatures are known to be stable. The callback receives every argument its caller passes: `['1', '2', '3'].map(parseInt)` hands each index to `parseInt` as its radix and returns `[1, NaN, NaN]` ([prefer passing arrow functions as callbacks](https://google.github.io/styleguide/tsguide.html#prefer-passing-arrow-functions-as-callbacks)).
- **A mishandled promise fails silently, which is what puts these here rather than among the preferences.** Flag a promise whose rejection is neither handled nor propagated, because the rejection surfaces as an unhandled rejection far from its cause. Flag an `async` callback handed to a non-awaiting iterator, `forEach` being the common one, when the caller needs to await the work it starts. Flag `map` producing promises without awaiting or returning an aggregate such as `Promise.all`.

### Preferences

- `const` by default, `let` when reassignment is needed. One variable per declaration.
- Braced blocks for control flow. Google lets an `if` statement that fits on one line drop its braces; the readability rules in [SKILL.md](../SKILL.md) deliberately narrow that to a short early exit ([control flow statements and blocks](https://google.github.io/styleguide/tsguide.html#control-flow-statements-and-blocks)).
- Prefer function declarations for named functions; use arrow functions rather than function expressions. Use a concise arrow body only when the return value is used.
- Do not write an explicit boolean coercion where the context already coerces, such as an `if` or `while` condition.
- Spread objects into objects and arrays into arrays only.
- No `const enum`, no `require()` imports in a module file, and no `namespace Foo {}`.

## Classes

From the guide's [Classes](https://google.github.io/styleguide/tsguide.html#classes) section unless another link is given.

- A getter is a pure function and never changes observable state: `get next() { return this.id++; }` turns reading a property into a write ([getters and setters](https://google.github.io/styleguide/tsguide.html#getters-and-setters)). This one is a defect, read on every review.
- TypeScript's `private`, not a `#private` field ([no #private fields](https://google.github.io/styleguide/tsguide.html#no-private-fields)).
- `readonly` on a property never reassigned outside the constructor ([use readonly](https://google.github.io/styleguide/tsguide.html#use-readonly)), and a parameter property, `constructor(private readonly service: Service) {}`, rather than copying a constructor parameter into a field by hand ([parameter properties](https://google.github.io/styleguide/tsguide.html#parameter-properties)). A project that sets `erasableSyntaxOnly` cannot use parameter properties, `enum` declarations, or a `namespace` with runtime code, and that setting wins over this preference.
- No `public` modifier, except on a non-readonly parameter property ([visibility](https://google.github.io/styleguide/tsguide.html#visibility)).
- Classes should not hold properties initialized to arrow functions, which obscures `this`.

## Errors

From the guide's [Exceptions](https://google.github.io/styleguide/tsguide.html#exceptions) rules unless another link is given.

- Prefer throwing exceptions to ad hoc error handling.
- Always `new Error()`, never `Error()`.
- **Throw only `Error` or a subclass**, and reject a promise or abort a signal with one too: `Promise.reject(new Error('...'))`, and `controller.abort()` with no argument or with an `Error`. Other values carry no stack trace ([only throw errors](https://google.github.io/styleguide/tsguide.html#only-throw-errors)).
- Treat a caught value as `Error`, narrowing where needed. Do not defensively handle a non-`Error` throw unless the called API is known to throw one, and then a comment names where it comes from ([catching and rethrowing](https://google.github.io/styleguide/tsguide.html#catching-and-rethrowing)). Doing nothing in a `catch` is rarely correct and requires a comment explaining why.
- `new Error(message, { cause })` takes an `Error` as `cause`. Passing the caught error as the second argument itself type-checks, because `Error` is assignable to `ErrorOptions`, and the guide calls that "very likely a bug in the code" ([ErrorOptions cause](https://google.github.io/styleguide/tsguide.html#erroroptions-cause-must-be-an-error-object)).
- Keep the body of a `try` small where that does not hurt readability.

## Comments and documentation

From the guide's [Comments and documentation](https://google.github.io/styleguide/tsguide.html#comments-and-documentation) section unless another link is given.

Google's own rules on this, which the skill's comment guidance extends rather than replaces:

- A documentation block for what a consumer of the code needs to know; `//` for implementation notes. Multi-line implementation comments use several `//` lines, never a block comment.
- Document all top-level exports.
- Do not restate types in a documentation block in a file the compiler type-checks. `@param {string}`, `@returns {number}`, `@type`, `@typedef`, `@implements`, and `@enum` are ignored there, so they become prose that drifts from the signature.
- `@param` and `@returns` lines are required only where they add information beyond the name and type. A block with a good summary and no tags is idiomatic.
- Do not write `@implements`, `@enum`, `@private`, or `@override` on code that already uses the matching keyword ([JSDoc type annotations](https://google.github.io/styleguide/tsguide.html#jsdoc-type-annotations)).
- Document a non-obvious argument at the call site with a block comment (`foo(/* silent= */ true)`), or prefer an options object with destructuring.
- Write the documentation block before a decorator, not between the decorator and the declaration.
- Bodies are Markdown. Use `-` lists rather than whitespace alignment, and give each tag its own line.

## Rules frameworks commonly override

The Google rule behind each is in [Exports](https://google.github.io/styleguide/tsguide.html#exports), [import identifiers](https://google.github.io/styleguide/tsguide.html#identifiers-imports) for filenames, [underscore prefix and suffix](https://google.github.io/styleguide/tsguide.html#underscore-_-prefixsuffix), and [return types](https://google.github.io/styleguide/tsguide.html#return-types).

These four are the ones a host project most often contradicts on purpose. Check the project before applying any of them, and never "fix" code to match Google where the project has chosen otherwise.

- **Default exports.** Google bans them. Many frameworks require a default export for route, page, layout, and component files, and many projects extend that to their own components by convention.
- **Filenames.** Google specifies `snake_case`. Most JavaScript and TypeScript projects use kebab-case directories with either kebab-case or PascalCase file names.
- **Underscore prefixes.** Google allows a `_` prefix only on an unused, syntactically required identifier, and bans a leading or trailing `_` that marks a member private. A linter configuring `no-unused-vars` with an `argsIgnorePattern` or `varsIgnorePattern` of `^_` agrees with the first half. A project that prefixes private members with `_` by convention overrides the second.
- **Return-type annotations.** Google leaves these to the author rather than mandating them. Treat them as optional and add them where a complex return benefits, unless the project's linter requires them.
