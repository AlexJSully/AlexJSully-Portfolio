# Node built-in modules

Import every Node built-in by its `node:` specifier (`node:fs`, `node:path`, `node:assert/strict`), never by its bare name. This file gives the runtime facts behind that rule, every position it applies to, its one exception, and the lint rules that check it.

## Why the prefix is a runtime fact rather than a preference

- **A misspelling fails instead of loading a package.** In Node, a bare name that exactly matches a built-in always loads the built-in, so an installed package cannot shadow `fs`. A bare name matching no built-in, such as a misspelling, is resolved through `node_modules` like any package ([the resolution algorithm](https://nodejs.org/api/modules.html#all-together)), so a package published under that misspelling loads and runs. Under the prefix the same misspelling throws `ERR_UNKNOWN_BUILTIN_MODULE`. See [built-in modules](https://nodejs.org/api/modules.html#built-in-modules) in the Node.js documentation.
- **Newer built-ins exist only under the prefix.** `node:test`, `node:test/reporters`, `node:sqlite`, and `node:sea` have no bare name. Node gives the reason as preventing "newly introduced built-in modules from having a conflict with user land packages that already have taken the name" ([built-in modules with mandatory `node:` prefix](https://nodejs.org/api/modules.html#built-in-modules-with-mandatory-node-prefix)).
- **Other resolvers read a bare name differently.** A bundler's fallback configuration can map `buffer`, `events`, or `util` to npm packages of those names, and Deno resolves a bare name to a `package.json` dependency of the same name ahead of the built-in ([use a Node built-in module](https://docs.deno.com/runtime/fundamentals/node/#use-a-node-built-in-module)). The prefixed name means the built-in to every one of them.

## Where it applies

Every position that names a module: a static `import`, an `export ... from`, a dynamic `import()`, `require()` and `require.resolve()`, a test runner's module mock such as `jest.mock('node:fs')` or `vi.mock('node:fs')`, and a type position such as `import type` or `typeof import('node:fs')`.

## The one exception

A project whose stated target predates the scheme cannot use it. Node accepts `node:` in `import` from 12.20 and 14.13.1, and in `require()` from 14.18 and 16.0 ([`node:` imports](https://nodejs.org/api/esm.html#node-imports)). The same holds for a tool in the project that does not resolve the scheme at its pinned version: Jest, for example, resolves a prefixed `require()` from 27.1 and mocks a prefixed name from 29.6 ([Jest changelog](https://github.com/jestjs/jest/blob/main/CHANGELOG_PRE_v30.md)). Name the target or the tool version instead of reporting the import, as a shim for a missing platform feature is treated under **Reuse** in [SKILL.md](../SKILL.md).

## Lint rules that check it

Where the project already runs one of these, the rule is the check, and an enabled rule configured the other way is the project's decision:

- [`unicorn/prefer-node-protocol`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md) in eslint-plugin-unicorn.
- [`n/prefer-node-protocol`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-node-protocol.md) in eslint-plugin-n, which applies only where the project's `engines` field allows the prefix.
- [`import/enforce-node-protocol-usage`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/enforce-node-protocol-usage.md) in eslint-plugin-import, set to `'always'`.
- [`useNodejsImportProtocol`](https://biomejs.dev/linter/rules/use-nodejs-import-protocol/) in Biome, which skips a name the project declares as a dependency.

ESLint's core `no-restricted-imports`, given every name in `module.builtinModules` that does not start with `node:` or `_`, checks static imports and `export ... from` with no new dependency, though it does not see `require()`. Recommend one of these to the project rather than adding it: this skill never edits configuration, and a new plugin is a dependency decision of its own.
