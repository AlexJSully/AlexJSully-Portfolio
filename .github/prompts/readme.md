# Prompts directory

Reusable audit prompts for code review, documentation, and codebase quality. Each one ships **twice**, so it works whether or not you can install a directory into your repository:

| Prompt file, for GitHub Copilot                      | Skill, for Claude Code and other agents                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| [`audit-docs.prompt.md`](audit-docs.prompt.md)       | [`audit-docs/SKILL.md`](../../.claude/skills/audit-docs/SKILL.md)       |
| [`audit-pr.prompt.md`](audit-pr.prompt.md)           | [`audit-pr/SKILL.md`](../../.claude/skills/audit-pr/SKILL.md)           |
| [`audit-quality.prompt.md`](audit-quality.prompt.md) | [`audit-quality/SKILL.md`](../../.claude/skills/audit-quality/SKILL.md) |

**The body below the frontmatter is byte-identical between each pair.** Only the frontmatter differs: the prompt carries Copilot's keys, the skill carries the Agent Skills keys. Each file is self-contained, with no relative links and no reference to a sibling prompt, so a single copied file works on its own.

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

**As a Copilot prompt.** Copy the `.prompt.md` file into `.github/prompts/` in your repository and invoke it with `/audit-pr` in Copilot Chat. Use this path when repository policy prevents installing anything else, since it is a single file with no dependencies.

**As a Claude Code skill.** Copy the skill directory into `.claude/skills/`. Invoke it with `/audit-pr`, or let the agent pick it up from its description.

**With another agent.** The body is host-neutral. Every prompt carries a **context resolution** table mapping the references Copilot resolves automatically to the equivalent command any other agent should run. Which references appear depends on the prompt: all three list `#codebase` and `#changes`, `audit-docs` and `audit-pr` add `#activePullRequest`, `audit-docs` and `audit-quality` add `#file:path`, and `audit-pr` alone adds `#issue_fetch`.

## Keeping the pair in sync

Only relevant if you keep both halves. Edit one, then propagate:

```bash
make -f .claude/Makefile sync-prompts-to-skill    # you edited the prompt
make -f .claude/Makefile sync-prompts-to-prompt   # you edited the skill
make -f .claude/Makefile sync-prompts             # confirm, exits 0 when in sync
```

The direction is never inferred, because guessing it would overwrite the side you just edited. In this repository the check is run on demand rather than as part of the build, so that the project still builds and lints with no agent tooling present.

## Whether a run applies changes

**The prompts do not decide this.** The mode you invoke them in does: an agent mode with edits enabled applies changes, a plan or ask mode does not, and a permission prompt may sit between. `audit-pr` produces a review and never edits. `audit-docs` edits documentation only, never behaviour. `audit-quality` reports, and applies changes only where the invoking mode allows it.

## Related resources

- [Copilot prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) for the `.prompt.md` frontmatter schema
- [Agent Skills specification](https://agentskills.io/specification) for the `SKILL.md` format
- [Workspace Wiki](https://marketplace.visualstudio.com/items?itemName=alexjsully.workspace-wiki), a VS Code extension that organizes Markdown files into a unified tree
