# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sources of truth

This repo is worked on by **both** GitHub Copilot and Claude Code. Keep these authoritative:

- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) - canonical, shared conventions. Copilot cannot read `CLAUDE.md`, and the automated code reviews read that file rather than `.claude/`, so when conventions change, update it too.
- [`docs/architecture/`](docs/architecture/index.md) and [`docs/usage/`](docs/usage/index.md) - per-area detail (read these instead of re-deriving structure).
- [`.claude/rules/`](.claude/rules/code-style.md) - Claude-specific rules that load automatically. [`code-style.md`](.claude/rules/code-style.md) loads when editing `.ts`/`.tsx`, [`testing.md`](.claude/rules/testing.md) when editing tests or test tooling, and [`docs-authoring.md`](.claude/rules/docs-authoring.md) when editing markdown.

## Commands

- `npm run dev` - dev server at localhost:3000
- `npm run validate` - full quality gate (prettier, eslint, tsc, jest, cypress, build, markdownlint)
- Individual gates: `npm run prettier:check`, `npm run eslint:check`, `npm run tsc`, `npm run test:jest`, `npm run test:cypress:e2e`, `npm run build`, `npm run lint:markdown`
- Run a **single** Jest test:
    - one file: `npx jest src/components/banner/Banner.test.tsx`
    - one case by name: `npx jest -t 'partial test name'`
    - (path aliases resolve in tests via `moduleNameMapper` in [`jest.config.js`](jest.config.js))
- Install with `npm ci`. CI runs on **Node 22.x** ([`.github/workflows/code-qa.yaml`](.github/workflows/code-qa.yaml)); there are no pre-commit hooks, so `npm run validate` is the manual equivalent.

## Validation

**Every change to logic, tests, configuration, or documentation ends with the quality gates run and green.** This is not optional and not deferrable.

- Confirm the **actual exit code** (`echo "EXIT: $?"`) after each gate. The output is long and failures surface at the end, so scrolling it is not a check.
- A single gate is never a substitute for the full set. Running `npm run test:jest` alone skips type checking, linting, the build, and markdown linting.
- If a gate fails, fix the cause and re-run until it passes. Never report work complete, or describe validation as passing, before that point. Report a pre-existing failure honestly rather than presenting it as unrelated and therefore fine.
- Run `npm run prettier` again after any ESLint fix, and finish with `npm run prettier:check`: `eslint --fix` inserts braces inline where Prettier would break the statement across lines.
- If `test:cypress:e2e` fails, quote the actual error. Treat it as an environment limit only when the Cypress **binary fails to launch**, an Electron or window-server error raised before any spec runs, since Cypress needs a GUI session that a headless agent shell may not have. A failing assertion inside a spec is a real failure. Either way, run the remaining gates (`build` and `lint:markdown` come after Cypress in the chain) and say plainly that e2e was not run.
- Delegate the run to the `validator` subagent to keep verbose Jest and build output out of this context.

A `Stop` hook blocks the first attempt to finish while gates are outstanding, and names which ones.

## Architecture

A single-page Next.js **App Router** portfolio: the whole site is [`src/app/layout.tsx`](src/app/layout.tsx) (metadata, SEO/JSON-LD, providers) plus [`src/app/page.tsx`](src/app/page.tsx). Stack is React 19 + TypeScript + Material-UI (Emotion). Portfolio content is **static TypeScript data** in [`src/data/`](src/data/projects.ts) (projects, publications, socials, keywords) imported and rendered directly: there is no CMS, database, or content fetching. State is minimal local React hooks (no Redux/global store). Cross-cutting concerns: Sentry (client/server/edge configs), Firebase analytics, Vercel Speed Insights, and a PWA service worker ([`public/sw.js`](public/sw.js) registered by [`src/components/ServiceWorkerRegister.tsx`](src/components/ServiceWorkerRegister.tsx)); security headers live in [`next.config.js`](next.config.js). For per-area detail see [`docs/architecture/`](docs/architecture/index.md).

## Conventions

Two rules trip people up most: **use tabs, not spaces**, and **import via path aliases (`@components/...`), never relative paths**. The full set (MUI `sx`-only styling, strict TypeScript, Server Components by default, JSDoc on exports, the readability rules, and the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) deltas) lives in [`.claude/rules/code-style.md`](.claude/rules/code-style.md). Testing conventions (one colocated test per source, mocking policy, `it.each` tables, naming) live in [`.claude/rules/testing.md`](.claude/rules/testing.md). Both are enforced by `prettier`, `eslint`, and `tsc`.

## Claude Code extras

- The [`.github/prompts/`](.github/prompts/readme.md) files (`audit-docs`, `audit-pr`, `audit-quality`) are **Copilot coding-agent** prompts (need an active PR + Copilot Chat), not Claude Code commands.
- Skills: `/audit-docs` (documentation audit, mirrors [`.github/prompts/audit-docs.prompt.md`](.github/prompts/audit-docs.prompt.md)), `/write-tests` (author or repair a test to house style), and `/google-ts-style` (fuller style digest for a deliberate style pass). Plus the built-in `/code-review` and `/security-review`.
- Subagent: `validator` runs the six local quality gates in its own context and returns a verdict instead of several thousand lines of output.
- Hooks ([`.claude/hooks/`](.claude/hooks/validate-gate.mts)): `markdown-audit-reminder` restates the doc-authoring rules whenever you edit a markdown file; `validate-gate` tracks which gates have run and blocks the first attempt to finish while any are outstanding.
