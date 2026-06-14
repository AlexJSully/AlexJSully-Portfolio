# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sources of truth

This repo is worked on by **both** GitHub Copilot and Claude Code. Keep these authoritative:

- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) — canonical, shared conventions. Copilot cannot read `CLAUDE.md`, so when conventions change, update that file too.
- [`docs/architecture/`](docs/architecture/index.md) and [`docs/usage/`](docs/usage/index.md) — per-area detail (read these instead of re-deriving structure).
- [`.claude/rules/`](.claude/rules/) — Claude-specific rules that load automatically. [`code-style.md`](.claude/rules/code-style.md) loads when editing `.ts`/`.tsx`; [`docs-authoring.md`](.claude/rules/docs-authoring.md) loads when editing markdown.

## Commands

- `npm run dev` — dev server at localhost:3000
- `npm run validate` — full quality gate (prettier → eslint → tsc → jest → cypress → build → markdownlint). **Run before committing.**
- Individual gates: `npm run prettier:check`, `npm run eslint:check`, `npm run tsc`, `npm run test:jest`, `npm run test:cypress:e2e`, `npm run build`, `npm run lint:markdown`
- Run a **single** Jest test:
    - one file: `npx jest src/components/banner/Banner.test.tsx`
    - one case by name: `npx jest -t 'partial test name'`
    - (path aliases resolve in tests via `moduleNameMapper` in [`jest.config.js`](jest.config.js))
- Install with `npm ci`. CI runs on **Node 22.x** ([`.github/workflows/code-qa.yaml`](.github/workflows/code-qa.yaml)); there are no pre-commit hooks, so `npm run validate` is the manual equivalent.

## Architecture

A single-page Next.js **App Router** portfolio: the whole site is [`src/app/layout.tsx`](src/app/layout.tsx) (metadata, SEO/JSON-LD, providers) plus [`src/app/page.tsx`](src/app/page.tsx). Stack is React 19 + TypeScript + Material-UI (Emotion). Portfolio content is **static TypeScript data** in [`src/data/`](src/data/projects.ts) (projects, publications, socials, keywords) imported and rendered directly — there is no CMS, database, or content fetching. State is minimal local React hooks (no Redux/global store). Cross-cutting concerns: Sentry (client/server/edge configs), Firebase analytics, Vercel Speed Insights, and a PWA service worker ([`public/sw.js`](public/sw.js) registered by [`src/components/ServiceWorkerRegister.tsx`](src/components/ServiceWorkerRegister.tsx)); security headers live in [`next.config.js`](next.config.js). For per-area detail see [`docs/architecture/`](docs/architecture/index.md).

## Conventions

Two rules trip people up most — **use tabs, not spaces**, and **import via path aliases (`@components/...`), never relative paths**. The full set (MUI `sx`-only styling, strict TypeScript, Server Components by default, colocated `.test.tsx`, etc.) lives in [`.claude/rules/code-style.md`](.claude/rules/code-style.md) and is enforced by `prettier`/`eslint`/`tsc`.

## Claude Code extras

- The [`.github/prompts/`](.github/prompts/readme.md) files (`audit-docs`, `audit-pr`, `audit-quality`) are **Copilot coding-agent** prompts (need an active PR + Copilot Chat) — not Claude Code commands.
- Claude Code equivalents: the `/audit-docs` skill (documentation audit, mirrors [`.github/prompts/audit-docs.prompt.md`](.github/prompts/audit-docs.prompt.md)), plus the built-in `/code-review` and `/security-review`.
- A PostToolUse hook reminds you of the doc-authoring rules whenever you edit a markdown file.
