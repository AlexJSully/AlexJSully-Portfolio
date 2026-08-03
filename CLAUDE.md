# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sources of truth

This repo is worked on by **both** GitHub Copilot and Claude Code. Keep these authoritative:

- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) - canonical, shared conventions. Copilot cannot read `CLAUDE.md`, and the automated code reviews read that file rather than `.claude/`, so when conventions change, update it too.
- [`docs/architecture/`](docs/architecture/index.md) and [`docs/usage/`](docs/usage/index.md) - per-area detail (read these instead of re-deriving structure).
- [`.claude/rules/`](.claude/rules/code-style.md) - path-scoped rules that load automatically. [`code-style.md`](.claude/rules/code-style.md) loads when editing `.ts`/`.tsx`, [`testing.md`](.claude/rules/testing.md) when editing tests or test tooling, [`docs-authoring.md`](.claude/rules/docs-authoring.md) when editing markdown, [`prompt-skill-sync.md`](.claude/rules/prompt-skill-sync.md) when editing either half of a mirrored prompt, and [`repo-independence.md`](.claude/rules/repo-independence.md) when editing `package.json`, a config, a workflow, or `docs/`.
- [`.claude/skills/typescript-code-and-test-standards/`](.claude/skills/typescript-code-and-test-standards/SKILL.md) - the codebase-agnostic conventions (comments, JSDoc, readability, the test mandate, the mocking policy, the Google style digest), published for reuse elsewhere. The rules files above carry only this repository's deltas and defer to it.

### The repository never depends on agentic files

**If `.claude/` and `.github/prompts/` were deleted tomorrow, everything must still build, test, and lint.** No `package.json` script, config, workflow, or page under `docs/` may reference or invoke anything in them. The dependency runs one way: agent tooling may name `npm run test:jest`; `package.json` may not name `.claude/anything`. The sole exception is an ignore or exclude glob, which is inert when the path is absent. Agent tooling that needs to be runnable gets a target in [`.claude/Makefile`](.claude/Makefile) instead, which is deleted along with the tooling it drives. Full rule: [`repo-independence.md`](.claude/rules/repo-independence.md).

### Documentation and comments describe the current state

**This applies to every file type, not only markdown**, because a path-scoped rule can only cover the extensions someone thought to list. A comment, document, or config header states what the code does now. Never narrate the past ("replaces", "used to", "formerly", "for the first time", "unlike the old") and never name a file, flag, or tool that no longer exists: git carries that history, and a reader cannot check a claim against something that is gone. The future belongs nowhere but a `TODO`. Rationale worth keeping goes in a decision record of its own under [`docs/`](docs/index.md), created when the first one is needed, rather than scattered through the files it explains.

## Commands

- `npm run dev` - dev server at localhost:3000
- `npm run validate` - full quality gate (prettier, eslint, tsc, jest, cypress, build, markdownlint)
- Individual gates: `npm run prettier:check`, `npm run eslint:check`, `npm run tsc`, `npm run test:jest`, `npm run test:cypress:e2e`, `npm run build`, `npm run lint:markdown:check`
- Run a **single** Jest test:
    - one file: `npx jest src/components/banner/Banner.test.tsx`
    - one case by name: `npx jest -t 'partial test name'`
    - (path aliases resolve in tests via `moduleNameMapper` in [`jest.config.js`](jest.config.js))
- Install with `npm ci`. CI runs on **Node 24.x** ([`.github/workflows/code-qa.yaml`](.github/workflows/code-qa.yaml)); there are no pre-commit hooks, so `npm run validate` is the manual equivalent.

## Validation

**Every change to logic, tests, configuration, or documentation ends with the quality gates run and green.** This is not optional and not deferrable.

- Confirm the **actual exit code** (`echo "EXIT: $?"`) after each gate. The output is long and failures surface at the end, so scrolling it is not a check.
- A single gate is never a substitute for the full set. Running `npm run test:jest` alone skips type checking, linting, the build, and markdown linting.
- The prompt-and-skill mirroring check is deliberately **not** a gate: `npm run validate` must work with no agent tooling present. Run it with `make -f .claude/Makefile sync-prompts`, and fix a divergence with `make -f .claude/Makefile sync-prompts-to-skill` (or `make -f .claude/Makefile sync-prompts-to-prompt`), never by hand-copying.
- If a gate fails, fix the cause and re-run until it passes. Never report work complete, or describe validation as passing, before that point. Report a pre-existing failure honestly rather than presenting it as unrelated and therefore fine.
- Run `npm run prettier` again after any ESLint fix, and finish with `npm run prettier:check`: `eslint --fix` inserts braces inline where Prettier would break the statement across lines.
- If `test:cypress:e2e` fails, quote the actual error. Treat it as an environment limit only when the Cypress **binary fails to launch**, an Electron or window-server error raised before any spec runs, since Cypress needs a GUI session that a headless agent shell may not have. A failing assertion inside a spec is a real failure. Either way, run the remaining gates (`build` and `lint:markdown` come after Cypress in the chain) and say plainly that e2e was not run.
- Delegate the run to the `validator` subagent to keep verbose Jest and build output out of this context.

A `Stop` hook blocks the first attempt to finish while gates are outstanding, and names which ones.

## Architecture

A single-page Next.js **App Router** portfolio: the whole site is [`src/app/layout.tsx`](src/app/layout.tsx) (metadata, SEO/JSON-LD, providers) plus [`src/app/page.tsx`](src/app/page.tsx). Stack is React 19 + TypeScript + Material-UI (Emotion). Portfolio content is **static TypeScript data** in [`src/data/`](src/data/projects.ts) (projects, publications, socials, keywords) imported and rendered directly: there is no CMS, database, or content fetching. State is minimal local React hooks (no Redux/global store). Cross-cutting concerns: Sentry (client/server/edge configs), Firebase analytics, Vercel Speed Insights, and a PWA service worker ([`public/sw.js`](public/sw.js) registered by [`src/components/ServiceWorkerRegister.tsx`](src/components/ServiceWorkerRegister.tsx)); security headers live in [`next.config.js`](next.config.js). For per-area detail see [`docs/architecture/`](docs/architecture/index.md).

## Conventions

Two rules trip people up most: **use tabs, not spaces**, and **import via path aliases (`@components/...`), never relative paths**.

The conventions live in two layers. The generic set (comment discipline, JSDoc, readability, the test mandate, one colocated test per source, the mocking policy, and the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) digest) is in [`typescript-code-and-test-standards`](.claude/skills/typescript-code-and-test-standards/SKILL.md), which detects a project's own configuration rather than assuming one. This repository's deltas (path aliases, MUI `sx`, Server Components, the closed mock boundary table, the test exemptions, the Google carve-outs) are in [`code-style.md`](.claude/rules/code-style.md) and [`testing.md`](.claude/rules/testing.md), which auto-load and direct you to the skill. Prettier, ESLint, and tsc enforce what they can.

## Claude Code extras

- Each [`.github/prompts/`](.github/prompts/readme.md) file ships twice: as a Copilot `.prompt.md` and as a Claude Code skill with a **byte-identical body**. Edit either half, then mirror it with `make -f .claude/Makefile sync-prompts-to-skill` (see [`prompt-skill-sync.md`](.claude/rules/prompt-skill-sync.md)). Both halves stay self-contained, with no relative links and no reference to a sibling prompt, because each is copied into other repositories on its own.
- Skills: `/audit-docs`, `/audit-pr`, and `/audit-quality` (the mirrored prompts); `/write-tests` (repo procedure for authoring a test); `/sync-audit-prompts` (reconcile a mirrored pair); and `typescript-code-and-test-standards`, which auto-loads on TypeScript and JavaScript files. Plus the built-in `/code-review` and `/security-review`.
- Subagents: `validator` runs the local quality gates in its own context and returns a verdict instead of several thousand lines; `prompt-skill-sync` reconciles a mirrored pair and returns a verdict instead of two long files.
- Hooks ([`.claude/hooks/`](.claude/hooks/validate-gate.mts)): `markdown-audit-reminder` restates the doc-authoring rules whenever you edit a markdown file; `prompt-skill-sync` names the counterpart when you edit either half of a mirrored pair; `validate-gate` tracks which gates have run and blocks the first attempt to finish while any are outstanding.
