# Project detection

How to read a host project's configuration and turn it into decisions. The compressed table lives in the skill body; this file carries the detail, the parsing traps, and what to do when a signal is absent.

## Contents

- Why detection replaces assumption
- Formatting
- Lint rules
- Type strictness and path aliases
- Commands
- Test runner
- Editor defaults
- Project rules files
- Precedence, restated with worked cases
- When nothing answers the question

## Why detection replaces assumption

Every mechanical convention in a JavaScript or TypeScript project is already written down somewhere machine-readable. Tabs against spaces, quote style, print width, semicolons, import ordering, alias names, and strictness are all declared in configuration, and the configuration is the truth. A skill that asserts its own preference for any of them is wrong in every project that chose differently, and it is wrong silently.

So the rule is: look it up. The only things worth carrying between projects are the judgements no configuration file can express, which are the rest of this skill.

## Formatting

Read, in the order a formatter itself resolves them:

- `.prettierrc`, `.prettierrc.json`, `.prettierrc.yaml`, `.prettierrc.yml`, `.prettierrc.json5`, `.prettierrc.js`, `.prettierrc.cjs`, `.prettierrc.mjs`, `prettier.config.js`, `prettier.config.cjs`, `prettier.config.mjs`
- a `prettier` key in `package.json`
- `biome.json` or `biome.jsonc` under `formatter`
- `dprint.json`
- `.editorconfig`, which Prettier reads for `indent_style`, `indent_size`, `end_of_line`, and `max_line_length` when the corresponding option is unset

Fields that matter: `useTabs`, `tabWidth`, `printWidth`, `semi`, `singleQuote`, `jsxSingleQuote`, `trailingComma`, `arrowParens`, `endOfLine`, and `overrides`, which can change all of the above for a subset of files.

**Traps.** A `plugins` entry can change behaviour a config field does not describe: an import-sorting plugin means import order is the formatter's business and hand-ordering is a defect. An `overrides` block means the answer differs per glob, so match the file you are editing rather than reading the top-level value. A `.prettierignore` entry means the file is not formatted at all, and `.editorconfig` decides it instead.

## Lint rules

Flat config (`eslint.config.js`, `eslint.config.mjs`, `eslint.config.cjs`, `eslint.config.ts`) exports an array of objects, each with `files`, `rules`, `languageOptions`, and `plugins`. Later entries override earlier ones, so the effective rule set for a file is the merge of every entry whose `files` glob matches it. There is no cascade from parent directories.

Legacy config (`.eslintrc`, `.eslintrc.json`, `.eslintrc.js`, `.eslintrc.yml`, or an `eslintConfig` key in `package.json`) cascades from the file's directory upward unless an entry sets `root: true`, and `overrides` blocks apply per glob.

Biome declares its rules under `linter.rules` in `biome.json`.

**What to extract:** whether `curly`, `eqeqeq`, `no-unused-vars` (and its `argsIgnorePattern` and `varsIgnorePattern`), `padding-line-between-statements`, `no-explicit-any`, and any import-order rule are on, off, or warn-only.

**The load-bearing trap:** a rule the project turned off is a decision. Do not report a violation of a rule the project disabled, and do not re-enable it. Read the config before flagging anything a linter could have flagged.

## Type strictness and path aliases

From `tsconfig.json`, or `jsconfig.json` in a JavaScript project:

- `compilerOptions.strict` and the individual flags it implies, since a project can enable `strict` and then disable one member of it
- `compilerOptions.isolatedModules`, which makes `export type` mandatory when re-exporting a type
- `compilerOptions.paths` and `baseUrl`, which define the alias set
- `compilerOptions.allowJs` and `checkJs`, which decide whether JavaScript files are type-checked, and therefore whether documentation-block type annotations are load-bearing or noise
- `verbatimModuleSyntax`, which changes how `import type` is emitted
- `extends`, which can point at a shared base config in a dependency, so the effective options are the merge

**Traps.** A monorepo often has a root config plus one per package, and `references` entries mean several programs exist. A test directory frequently has its own `tsconfig.json` with a different `types` array, so the same source file can be checked twice under different settings.

## Commands

Look for a single entry point first: a `validate`, `check`, `ci`, `verify`, or `all` script in `package.json`, a target of the same name in a `Makefile` or `justfile`, or a task in `Taskfile.yml`. Where one exists, prefer it over running the steps individually, because it encodes the project's own ordering.

Where none exists, the order is format, then lint, then type check, then unit tests, then integration and end-to-end tests. Read the CI workflow to confirm: the workflow is what actually gates a merge, and it sometimes runs a different command than the local script.

**Confirm exit codes.** A chained command joined by `&&` stops at the first failure, so a failure in step two means steps three onward never ran. Never record those as passed.

## Test runner

- `jest.config.js`, `jest.config.ts`, `jest.config.mjs`, or a `jest` key in `package.json`
- `vitest.config.ts` or a `test` key in `vite.config.ts`
- `cypress.config.ts`, `playwright.config.ts`
- `.mocharc.*`, or a `mocha` key in `package.json`
- a `test` script in `package.json`, which reveals the runner even when its config is defaulted

**What to extract:** `testMatch` or `testRegex` and `testEnvironment` (which decide the naming convention and whether browser APIs exist), `moduleNameMapper` or `resolve.alias` (which decide whether aliases resolve inside tests), `setupFiles` and `setupFilesAfterEach` (which reveal global mocks already in place), and any `passWithNoTests` flag.

**The `passWithNoTests` trap:** when it is set, a run that matched zero test files exits 0. A green exit alone does not prove any test executed, so confirm the reported test count.

## Editor defaults

`.editorconfig` declares `indent_style`, `indent_size`, `end_of_line`, `charset`, `trim_trailing_whitespace`, `insert_final_newline`, and `max_line_length` per glob. It decides only for files no formatter covers, since a formatter that reads it will already have applied it, and a formatter that overrides it wins for the files it formats.

## Project rules files

`AGENTS.md`, `CLAUDE.md` and `CLAUDE.local.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.claude/rules/*.md`, `.cursor/rules/*`, and `CONTRIBUTING.md`.

These are the project speaking directly, so they outrank every inference and every rule in this skill. Read them before writing anything. A path-scoped file (`applyTo:` or `paths:` frontmatter) applies only to files matching its globs, so check whether the file you are editing is in scope.

## Precedence, restated with worked cases

1. **Project rules file.** It wins outright.
2. **Formatter** for anything it formats.
3. **Linter** for anything it checks.
4. **Compiler** for types.
5. **`.editorconfig`** for files no formatter covers.
6. **Surrounding code**, read from two or three neighbouring files of the same kind.
7. **This skill**, for the judgements none of the above express.

Worked cases:

- _The formatter says spaces, `.editorconfig` says tabs, for a `.ts` file._ The formatter wins; the `.editorconfig` entry is dead for that glob.
- _The linter has `curly` off, and this skill wants braces._ The linter wins. Do not flag an unbraced block.
- _A rules file mandates relative imports, and `tsconfig.json` declares aliases._ The rules file wins. Aliases existing is not an instruction to use them.
- _Nothing declares a quote style and no formatter is installed._ Match the neighbouring files, and change nothing that already exists.

## When nothing answers the question

Match the surrounding code, and if the surrounding code is inconsistent, match the newest file that looks deliberate. Say in your output that the project declares no convention for it, so the choice is visible rather than silently invented.

**Never create or edit a configuration file to make the project match this skill.** Adding a `.prettierrc`, enabling a lint rule, or tightening `tsconfig.json` is a project decision with consequences across every file, and it is not yours to make from inside an editing task. Note it as a recommendation instead.
