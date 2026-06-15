---
name: audit-docs
description: Audit and update the project's documentation so it matches the current code. Use when creating or editing Markdown/docs, after implementing a feature, before merging a PR, or whenever asked to audit, sync, fact-check, or refresh documentation. Mirrors `.github/prompts/audit-docs.prompt.md` for Claude Code.
---

# Audit docs

This skill is the Claude Code counterpart to the Copilot prompt [`.github/prompts/audit-docs.prompt.md`](../../../.github/prompts/audit-docs.prompt.md), which is the canonical, fuller spec. **Read that prompt and apply it.** The hard rules also live in [`.claude/rules/docs-authoring.md`](../../rules/docs-authoring.md) and load automatically when editing Markdown. This file is the operating procedure.

**Scope: documentation only.** Change docs, comments, and docstrings, never executable code or behaviour; if you notice a code problem (a stale variable, dead code, a bug), note it for a human instead of fixing it. The only exception is when the task explicitly asks for code changes.

## Phases (run in order)

1. **PR sync** - If there are uncommitted changes or an active PR, treat that diff as the source of truth. Identify what the code changes actually do (read the implementation) and update `docs/` to reflect only those changes. Report whether docs changed or were already accurate.
2. **General audit** - Audit the whole [`docs/`](../../../docs/index.md) tree against the current code. Correct statements that contradict the code; add docs only for exported/public APIs or genuinely complex logic that lacks them; remove bloat and redundant narration. Prefer correcting over deleting (delete only if a file describes a removed feature or is unsalvageably wrong). New directories need an `index.md`.
3. **In-code docs** - Scan Markdown outside `docs/`, plus JSDoc/docstrings/module headers and inline comments, for the files you touched. Fix or remove inaccurate/stale content; don't add narration that restates obvious code.

## Hard rules (quick reference)

Full detail in [`.claude/rules/docs-authoring.md`](../../rules/docs-authoring.md):

- **Documentation only.** Change docs/comments/docstrings, never executable code or behaviour (note code problems for a human instead), unless the task explicitly asks for code changes.
- **Zero hallucination / prove it.** Document only what the code provably does: read it, don't infer from names, types, comments, or structure. If you can't point to the proof, don't write it. No "appears to" / "should" / planned behaviour.
- **Objective tone.** No subjective adjectives (important, critical, robust, …). Fix existing claims that contradict the code.
- **Links.** Every file reference is a clickable relative markdown link to a *file* (never a bare name, never a directory; link its `index.md`/`README.md`). Verify the path resolves.
- **Snippets.** Link to files instead of pasting definitions; inline only 3-10 lines for a usage example or critical config line.
- **Mermaid.** Every diagram includes `accTitle` and `accDescr`; valid syntax; reflects real code; choose the fitting diagram type.
- **No placeholders or TODOs.**

## Validate

After doc changes, run `npm run lint:markdown` (and `npm run prettier:check` for formatting). Report exactly which files changed, or state that everything was already accurate.
