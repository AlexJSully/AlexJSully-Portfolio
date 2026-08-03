---
paths:
    - ".github/prompts/*.prompt.md"
    - ".claude/skills/audit-*/SKILL.md"
---

# Prompt and skill mirroring

Each audit prompt ships twice, and the two copies carry a **byte-identical body below the frontmatter**:

| Prompt, for GitHub Copilot | Skill, for Claude Code and other agents |
| --- | --- |
| [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md) | [`audit-docs/SKILL.md`](../skills/audit-docs/SKILL.md) |
| [`audit-pr.prompt.md`](../../.github/prompts/audit-pr.prompt.md) | [`audit-pr/SKILL.md`](../skills/audit-pr/SKILL.md) |
| [`audit-quality.prompt.md`](../../.github/prompts/audit-quality.prompt.md) | [`audit-quality/SKILL.md`](../skills/audit-quality/SKILL.md) |

Only the frontmatter differs: the prompt carries Copilot's keys (`description`, `name`, `argument-hint`, `agent`), the skill carries the Agent Skills keys (`name`, `description`, `argument-hint`).

**Frontmatter is deliberately never synced, so it drifts silently.** The checker compares bodies only, because the two halves need different keys. A change to what a `description` or `argument-hint` claims must therefore be made on **both** halves by hand. This matters most for a claim about behaviour: the skill's `description` is loaded at startup and drives automatic invocation, so a stale one pushes against the body it introduces.

## Edit one, mirror the other before finishing

Run the propagation in the direction you edited, then confirm:

```bash
node .claude/scripts/check-prompt-skill-sync.mjs --fix=to-skill   # you edited the prompt
node .claude/scripts/check-prompt-skill-sync.mjs --fix=to-prompt  # you edited the skill
node .claude/scripts/check-prompt-skill-sync.mjs                  # confirm, exits 0 when in sync
```

The direction is never inferred, because guessing it would overwrite the side you just edited. `npm run validate` runs the check and fails while any pair differs.

## The shared body must stay self-contained

Both halves are copied into other people's repositories on their own: personal and open-source adopters install the skill, and corporate adopters who cannot clone copy the single prompt file. Neither can reach anything this repository has.

So the shared body must never contain:

- **A relative link.** A copied file resolves none of them, and `./audit-pr.prompt.md` does not resolve from a skill directory anyway. Use a code span for a file reference, which the documentation rules already permit where no particular file is meant.
- **A reference to a sibling prompt.** A reader may hold only one of the three. Each body describes its own job and nothing else.
- **Anything specific to this repository:** a command from `package.json`, a path from `src/`, or a convention only this project follows.

Repository-specific procedure belongs in [`CLAUDE.md`](../../CLAUDE.md) or a rules file, never in a mirrored body.

## Adding a new pair

The checker pairs files by name automatically: `.github/prompts/<name>.prompt.md` with `.claude/skills/<name>/SKILL.md`. Create the skill with its frontmatter and any placeholder body, then run `--fix=to-skill`. A prompt with no matching skill directory is skipped rather than reported, so the pair only starts being enforced once both halves exist.
