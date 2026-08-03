# Comments and documentation blocks

The comment and documentation rules at full length, with worked before-and-after pairs. The compressed rules are in the skill body.

## Contents

- The single idea behind every comment rule
- Comments that narrate a change
- Comments that argue the code is safe
- Correcting rather than deleting
- Comments that restate the line beneath them
- Tooling directives are not comments
- Documentation blocks: what carries one
- Types in a documentation block
- Leaving existing tags alone
- Tags worth adding
- Form
- Links inside a documentation block

## The single idea behind every comment rule

A comment outlives the change that prompted it. That one fact generates most of the rules: anything written for the moment of the edit becomes wrong or meaningless later, while anything written about the code as it stands survives until the code changes, at which point it is corrected alongside.

So the test for any comment is: **will this still be true and still be useful to someone who never saw the change that introduced it?**

## Comments that narrate a change

Never write a comment about a change, a fix, or a prior state. Version control carries that, and it carries it better, with an author, a date, and a diff.

Banned openers, and any paraphrase of them: "now uses", "changed to", "updated to", "previously", "no longer", "restored", "switched from", "fixed to".

```ts
// Bad: narrates the edit
// Now uses the cached lookup instead of hitting the API on every call
const value = cache.get(key);

// Good: describes the code
// Cache is populated at startup, so a miss means the key is genuinely unknown
const value = cache.get(key);
```

The bad version becomes a lie the first time someone adds a second cache, and it was never useful to a reader who did not know what the code used to do.

## Comments that argue the code is safe

Never write a comment defending a decision or asserting that the code works. That documents the edit rather than the code, and it is usually written in response to a review comment rather than to a reader's need.

```ts
// Bad: argues for correctness
// This is safe because renderChart is declared below and is already
// initialized by the time this callback runs
renderChart();

// Good: states the constraint that makes it true
// Runs after the first paint, so the container has real dimensions by here
renderChart();
```

The good version tells a reader something they can act on. The bad version tells them the author was worried.

Say what something does, or why it exists. Do not justify that it works.

## Correcting rather than deleting

**When a comment contradicts the code, the code is the truth and the comment is corrected.** Deleting it loses whatever the comment was reaching for, and the mismatch is often the most interesting thing in the file: it usually means either the comment described an intent the code abandoned, or the code drifted from a constraint that still holds.

Delete a comment only when it restates the line beneath it, or when it is commented-out code.

## Comments that restate the line beneath them

Inside a function body, a comment that says what the next line already says is noise:

```ts
// Bad
// Increment the counter
counter += 1;

// Good: no comment at all
counter += 1;
```

Keep anything carrying a constraint, a hazard, or non-obvious behaviour, even where it is short.

On a public surface the calculation is different: redundancy there is not a defect, because the reader is meeting the symbol for the first time and cannot see the implementation.

## Tooling directives are not comments

Never delete these while tidying. They are instructions to a tool, and removing one changes behaviour:

`//@ts-check`, `/// <reference types="..." />`, `// @ts-expect-error`, `// @ts-ignore`, `eslint-disable` and `eslint-disable-next-line`, `biome-ignore`, `istanbul ignore`, `prettier-ignore`, `v8 ignore`, `c8 ignore`, `webpackChunkName` and similar bundler magic comments, `'use client'` and `'use server'` directives, and license headers.

A bundler magic comment in particular looks like commentary and is load-bearing.

## Documentation blocks: what carries one

**Every exported symbol, without exception**, and every member of an exported structure: interface properties, object keys, enum values, and class members that are part of the public surface.

A private helper carries one when its behaviour is not evident from its name and signature. A binding declared inside a function body does not: the name and type already carry it.

Write for a reader meeting the symbol for the first time who can infer nothing from its name. Reach for what the signature cannot express:

- Why it exists, where that is not obvious
- A constraint on the input beyond its type
- An invariant it maintains
- An obligation on the caller, such as cleanup, ordering, or a resource to release

Where none of those exist, a plain restatement of what the symbol does is correct. **Being obvious is not a defect on a public surface; being absent is.**

## Types in a documentation block

This rule is conditional on whether the file is type-checked, and getting it backwards destroys working type information.

**In a file the compiler type-checks**, omit `@param {string}`, `@returns {number}`, `@type`, and `@typedef`. The compiler already carries the type, the annotation is ignored, and it becomes prose that drifts from the signature. The same applies to `@implements`, `@enum`, `@private`, `@public`, `@protected`, `@readonly`, `@abstract`, and `@override` beside the corresponding keyword.

**In a plain JavaScript file where the documentation block is the type system**, those annotations are the type information and they stay. Before removing one, check `tsconfig.json` or `jsconfig.json` for `checkJs` and `allowJs`, and check the file for a `//@ts-check` directive. If the file is checked through its documentation blocks, stripping an annotation is a type regression, not a cleanup.

Add `@param` and `@returns` lines where they say more than the name and type already do. A block with a clear summary and no tags is idiomatic.

## Leaving existing tags alone

**A tag already in the tree was added deliberately, annotation and all.** Read the surrounding code, correct what is factually wrong, and change nothing else.

Specifically, do not:

- Strip a `{type}` annotation because the file is TypeScript. The author may have had a reason, and the rule above governs new blocks you write.
- Reword accurate prose for style.
- Delete a tag for looking redundant.
- Reorder tags.

Delete a whole tag only when it is wrong and uncorrectable, such as one documenting a parameter the signature no longer has.

This is the rule most often broken during an automated pass, because a reviewer reading only the convention sees a redundant tag and removes it. Removing an accurate tag is restyling someone else's work, not auditing it.

## Tags worth adding

None of these are expressible in the type system, so each one adds information:

- `@throws`, naming the error type and the condition
- `@example`, where a usage is not obvious from the signature
- `@deprecated`, which **names its replacement**. A deprecation without migration directions is incomplete.
- `@see`, pointing at a related symbol or an external page

## Form

- Open a function or component block with a third-person verb phrase: "Returns the parsed config", not "Return the parsed config" and not "Parses config".
- A documentation comment is a complete sentence, capitalized and punctuated. A short trailing comment may be a fragment.
- One tag per line, tag at line start.
- A block stays on one line until it overflows, at which point the delimiters move to their own lines.
- Bodies are Markdown, so an enumeration needs a real list. Indented plain text collapses into one run-on line when rendered.
- Never box a comment in asterisks or other decorative characters.
- The block precedes a decorator and never sits between the decorator and the declaration.
- Use `//` for implementation notes, and consecutive `//` lines for a multi-line note. No `/* */` block inside a function body, with one exception: naming an argument at a call site, `someFunction(/* shouldRender= */ true)`.

## Links inside a documentation block

**Markdown link syntax does not belong in a documentation block.** `[text](url)` is Markdown's form, and `[name](#anchor)` is worse: there is no document to anchor into, so it renders as dead text in every hover tooltip.

Use the documentation format's own forms:

- `{@link SymbolName}` for a symbol. The compiler resolves it through its symbol table, so hover and Go to Definition both work.
- `@see https://example.com` for an external page.
- `{@link https://example.com Display text}` to inline an external link.
