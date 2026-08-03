# Prompts directory

Reusable audit prompts for code review, documentation, and codebase quality. Each one ships **twice**, so it works whether or not you can install a directory into your repository:

| Prompt file, one file you can copy                   | Skill directory, for any Agent Skills host                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| [`audit-docs.prompt.md`](audit-docs.prompt.md)       | [`audit-docs/SKILL.md`](../../.claude/skills/audit-docs/SKILL.md)       |
| [`audit-pr.prompt.md`](audit-pr.prompt.md)           | [`audit-pr/SKILL.md`](../../.claude/skills/audit-pr/SKILL.md)           |
| [`audit-quality.prompt.md`](audit-quality.prompt.md) | [`audit-quality/SKILL.md`](../../.claude/skills/audit-quality/SKILL.md) |

**The two halves carry the same objective, not the same bytes.** Both describe the same job, hold you to the same rules, and produce the same shape of report. The skill can carry more to get there, because a directory can bundle reference material, subagents, and templates that a single file cannot.

Take whichever suits your constraints. Each half works alone: a prompt names nothing beside it, a skill names nothing outside itself, and neither refers to the other or to a sibling audit.

> [!CAUTION]
> **AI makes mistakes and hallucinations.** These prompts drive AI-driven analysis and documentation generation, so review all output before merging. Verify that changes are factually accurate against your codebase, aligned with your standards, free of invented function names, file paths, or logic, and tested. Do not blindly merge AI-generated changes.

## Picking one

- **`audit-pr`** reviews a diff: what a change does, what it breaks, and whether it should merge. Eighteen categories entered selectively through a triage table, every finding quoting the changed line, and a refutation pass that deletes findings which do not survive scrutiny.
- **`audit-quality`** audits code as it stands rather than a change. Thirteen categories, discovery before findings, and the same evidence and refutation discipline.
- **`audit-docs`** owns documentation accuracy for both. Evidence is a file, a symbol, and a verbatim quote rather than a line number, and unverifiable claims go to an explicit "unverified" list instead of into the prose.

Run one, not all three.

## Scope defaults

None of them audits your whole repository by default, which matters on a large codebase or a monorepo.

`audit-docs` and `audit-quality` resolve scope in order, stopping at the first rule that applies: an explicit instruction, the active pull request, uncommitted changes, the component the surrounding task concerns, and only then the whole repository. Both state which rule applied in their output.

`audit-pr` stops at the branch's own commits and has no whole-repository rung at all: with no change to review it reports nothing rather than widening.

## Installing

**As a single prompt file.** Copy the `.prompt.md` into `.github/prompts/` and invoke it with `/audit-pr` in chat. Use this path when repository policy prevents installing anything else, since it is one file with no dependencies.

**As a skill, by package manager.** Both installers place the directory wherever your agent reads it:

```bash
npx skills add AlexJSully/AlexJSully-Portfolio --skill audit-pr
gh skill install AlexJSully/AlexJSully-Portfolio --skill audit-pr --agent claude
```

`npx skills` (Vercel Labs) and `gh skill` (GitHub CLI 2.90.0 or later, in preview) both target Claude Code, Copilot, Cursor, Codex, and Gemini. `gh skill` additionally pins to a tag or commit with `--pin`.

**As a skill, by hand.** Copy the directory into `.claude/skills/`, `.github/skills/`, or `.agents/skills/`, whichever your agent reads. Invoke it with `/audit-pr`, or let the agent pick it up from its `description`. Either way this is the fuller half: it brings its bundled `references/`, `agents/`, and `assets/` with it.

**Resolving the `#` references.** Some hosts resolve `#codebase`, `#changes`, and the rest automatically; the ones that do not need a **context resolution** table, which maps each reference to the command to run instead. `audit-pr` and `audit-quality` carry that table in both halves. `audit-docs` carries it in the skill half only, since every host that reads a prompt file resolves those three itself. Which references appear varies: all three use `#codebase` and `#changes`, `audit-docs` and `audit-pr` add `#activePullRequest`, `audit-quality` adds `#file:path`, and `audit-pr` alone adds `#issue_fetch`.

## Keeping the two halves honest

Only relevant if you keep both. Since they are no longer identical, a diff cannot tell you whether they still agree, and the question splits in two.

```bash
make -f .claude/Makefile check-skills   # the mechanical rules, exits 0 when they hold
```

That decides what a machine can: the frontmatter against the [Agent Skills specification](https://agentskills.io/specification), a licence on every published skill, every bundled path resolving, and each half naming nothing it will not ship with.

Whether both halves still aim at the same outcome is a judgement, so it goes to a subagent that reads both, inventories the hard rules in each, and classifies every difference as bundled depth, a host fallback, or a real divergence. The failure worth catching is a rule that exists in the skill and not the prompt, which is a silent downgrade for everyone holding the prompt, and which passes the mechanical check cleanly.

In this repository both run on demand rather than as part of the build, so the project still builds and lints with no agent tooling present.

## Whether a run applies changes

**The prompts do not decide this.** The mode you invoke them in does: an agent mode with edits enabled applies changes, a plan or ask mode does not, and a permission prompt may sit between. `audit-pr` produces a review and never edits. `audit-docs` edits documentation only, never behaviour. `audit-quality` reports, and applies changes only where the invoking mode allows it.

## Related resources

- [Copilot prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) for the `.prompt.md` frontmatter schema
- [Agent Skills specification](https://agentskills.io/specification) for the `SKILL.md` format
- [Workspace Wiki](https://marketplace.visualstudio.com/items?itemName=alexjsully.workspace-wiki), a VS Code extension that organizes Markdown files into a unified tree
