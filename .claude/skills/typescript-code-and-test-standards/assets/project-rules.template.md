---
paths:
    - "**/*.ts"
    - "**/*.tsx"
    - "**/*.js"
    - "**/*.jsx"
---

# Code and test conventions

Copy this file to `.claude/rules/code-and-test-conventions.md` in your own repository, or any `.md` name you prefer there, and fill in each section. Claude Code loads it automatically when a matching file is touched, and the VS Code Copilot extension reads the same location. Delete each instruction sentence as you replace it, and delete any heading your project has nothing to put under.

**Read `../skills/typescript-code-and-test-standards/SKILL.md` before editing any TypeScript or JavaScript file here.** It carries the comment, documentation, readability, testing, and mocking rules this file does not repeat. Convert that path to a markdown link once this file sits in `.claude/rules/`, where it resolves.

That imperative sentence is the point of this file. A path-scoped rule loads reliably whenever a matching file is edited, while a skill loads when its description matches the request, so this file is what guarantees the skill is read.

## Imports

Record whether your project uses path aliases or relative imports, and name every alias. Name the one documented exception if you have one, such as a test importing its own subject. State whether Node built-ins use the bare specifier or the `node:` prefix.

## Exports

Record which kinds of module default-export their subject and which use named exports, since frameworks usually force a default export on route and page files while the rest of the codebase may not want one.

## Components and styling

Record how components are styled, how assets such as icons are imported, and any framework rule about which components run on the server by default and what opts one into the client.

## Types

Record your strictness posture and anything a contributor gets wrong repeatedly, such as how to treat an existing `any` or where a compiler-error suppression is permitted.

## Style guide carve-outs

Record every rule from the skill's Google TypeScript Style Guide digest that your project deliberately does not follow, and why. The four most commonly overridden are default exports, file naming, underscore prefixes on intentionally unused bindings, and mandatory return-type annotations.

## Mock boundaries in this project

Record the exact modules your tests are allowed to mock and what boundary each one crosses. The skill states the principle; this list is the project's application of it, and it is what makes an unjustified mock visible in review.

## Test file exemptions

Record which files in your project do not need a colocated test, and state explicitly which categories are **not** exempt.

## Test patterns

Record the render helpers, event helpers, and setup shape your tests use, plus any library that is deliberately not a dependency so nobody reaches for it.

## Validation

Record the exact command that runs your full gate, what it covers, and anything a contributor must know about reading its result, such as a flag that lets a zero-test run exit successfully.
