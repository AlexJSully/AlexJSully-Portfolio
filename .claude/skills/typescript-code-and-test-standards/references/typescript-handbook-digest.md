# TypeScript Handbook digest

Digest of the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) rules that decide whether TypeScript code is wrong, each provable from the type system without knowing what the program is for. It is read on every review, beside the quality half of the [Google style digest](google-typescript-style-digest.md); where the two cover the same ground they agree.

Every rule links the documentation section it comes from, and quotes it where the page states the rule in words. A project whose configuration or rules file settles a question differently has decided it, and the project wins.

## Contents

- Types to avoid
- Generics
- Callbacks and overloads
- Narrowing
- Read-only parameters and `satisfies`
- Compiler options to recommend

## Types to avoid

- **Never `Number`, `String`, `Boolean`, `Symbol`, or `Object` as a type.** The Handbook: "These types refer to non-primitive boxed objects that are almost never used appropriately in JavaScript code." Use `number`, `string`, `boolean`, `symbol`, and `object` ([Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object)).
- **Never `Function` as a type.** A value of that type can be called with anything and the call returns `any`: "This is an untyped function call and is generally best avoided because of the unsafe any return type." Write the signature, or `() => void` for a function that is accepted but never called ([More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#function)).

## Generics

- **A type parameter that appears in one position is not doing anything.** "If a type parameter only appears in one location, strongly reconsider if you actually need it." `function greet<S extends string>(s: S): void` is `function greet(s: string): void` ([type parameters should appear twice](https://www.typescriptlang.org/docs/handbook/2/functions.html#type-parameters-should-appear-twice)).
- A generic type that never uses its type parameter is a defect: "Don't ever have a generic type which doesn't use its type parameter" ([Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#generics)).
- Prefer the type parameter itself to a constraint on it, and as few type parameters as possible: "Always use as few type parameters as possible" ([use fewer type parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#use-fewer-type-parameters)).

## Callbacks and overloads

All from [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#callback-types) unless another link is given.

- **A callback whose return value is ignored returns `void`, not `any`.** "Using void is safer because it prevents you from accidentally using the return value of x in an unchecked way."
- **A callback parameter is optional only when the caller really omits it.** "When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument." A callback can always accept fewer parameters than it is passed, so the optional marker buys nothing and makes every implementation handle `undefined` ([optional parameters in callbacks](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters-in-callbacks)).
- One overload at the maximum callback arity, never separate overloads that differ only in how many parameters the callback takes: "Providing a shorter callback first allows incorrectly-typed functions to be passed in because they match the first overload."
- **Specific overloads come before general ones.** "TypeScript chooses the first matching overload when resolving function calls. When an earlier overload is “more general” than a later one, the later one is effectively hidden and cannot be called." ([ordering](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#ordering)).
- Optional parameters rather than overloads that differ only in trailing parameters, where the return types match, and a union rather than overloads that differ by type in one position: "Always prefer parameters with union types instead of overloads when possible" ([writing good overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#writing-good-overloads)).

## Narrowing

- **A truthiness check used as a presence check is a defect where a falsy value of the type is meaningful.** `0`, `""`, `NaN`, and `0n` all coerce to `false`, so `if (count)` on a `number | undefined` treats a count of zero as missing. A check that means "non-zero" or "non-empty", such as `if (items.length)`, is intended and stays. The Handbook: "truthiness checking on primitives can often be error prone." Compare with `!== undefined` or `!= null` instead ([truthiness narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing)).
- **Variants are a discriminated union, not one type with optional fields read through `!`.** A `kind` field with a literal type per variant lets the compiler narrow each branch; the optional-field version needs non-null assertions, and "those assertions are error-prone if we start to move code around" ([discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)).
- **A `switch` over a discriminated union proves it is exhaustive** by assigning the value to `never` in its `default`, so adding a variant fails to compile: "you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement" ([exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)).

```ts
default: {
	const unhandled: never = shape;
	throw new Error(`Unhandled shape: ${JSON.stringify(unhandled)}`);
}
```

## Read-only parameters and `satisfies`

- **An array parameter the function does not mutate is `readonly T[]`.** "When we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents." A mutable array is assignable to it, so callers change nothing ([the ReadonlyArray type](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)).
- **`satisfies` rather than `as` where the value should be checked against a type and keep its own narrower type.** "The new satisfies operator lets us validate that the type of an expression matches some type, without changing the resulting type of that expression." An `as` checks nothing, and an annotation widens the value to the annotated type ([the satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)).

## Compiler options to recommend

Report these as recommendations and never set them: changing a project's configuration is the project's decision (see [project-detection.md](project-detection.md#when-nothing-answers-the-question)). Where one is off, the defect it would catch is still reviewed by hand. All are in the [TSConfig reference](https://www.typescriptlang.org/tsconfig/).

- **`exactOptionalPropertyTypes`**, which the reference marks Recommended. Without it, `prop?: T` also accepts an explicit `undefined`; with it, only absence, because "colorThemeOverride: undefined is not the same as colorThemeOverride not being defined". Under it, `prop?: T` and `prop?: T | undefined` are different types ([exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes)).
- **`noUncheckedIndexedAccess`**: "Turning on noUncheckedIndexedAccess will add undefined to any un-declared field in the type", so a read through an index signature must be narrowed before use ([noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess)).
- **`noImplicitOverride`**, which keeps a subclass in step with a renamed base member "by ensuring that functions which override include the keyword override" ([noImplicitOverride](https://www.typescriptlang.org/tsconfig/#noImplicitOverride)).
- **`erasableSyntaxOnly`** is a constraint to detect rather than recommend: where it is set, `enum` declarations, a `namespace` with runtime code, parameter properties, `import =` and `export =`, and angle-bracket assertions are compile errors, so a finding never proposes one ([erasableSyntaxOnly](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)).
