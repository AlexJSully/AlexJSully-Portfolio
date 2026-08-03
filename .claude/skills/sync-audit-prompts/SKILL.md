---
name: sync-audit-prompts
description: Reconciles the mirrored prompt and skill pairs so their bodies match byte for byte. Use after editing any file under .github/prompts/ or .claude/skills/audit-*/, or when make -f .claude/Makefile sync-prompts reports the pairs out of sync.
argument-hint: '[to-skill | to-prompt; omit to check only]'
disable-model-invocation: true
allowed-tools: Bash(make -f .claude/Makefile sync-prompts*) Read Grep Glob
---

# Sync audit prompts

Each audit prompt ships twice with a byte-identical body below the frontmatter: `.github/prompts/<name>.prompt.md` for GitHub Copilot, and `.claude/skills/<name>/SKILL.md` for Claude Code and other agents. The obligation and its rationale are in [`prompt-skill-sync.md`](../../rules/prompt-skill-sync.md).

Manual only, because propagating in the wrong direction overwrites the edit you just made.

## Check first

```bash
make -f .claude/Makefile sync-prompts
```

Exit 0 means every pair matches; report that and stop.

## Then delegate

On any divergence, hand the reconciliation to the `prompt-skill-sync` subagent, which holds the full procedure: establishing which half carries the intended edit, propagating mechanically, merging by hand when both halves changed, and auditing the shared body for what the byte check cannot catch. It reads both halves in its own context and returns a verdict rather than several hundred lines.

The procedure lives in that one file on purpose. Restating it here would be a second hand-maintained copy of instructions about keeping hand-maintained copies in sync, with nothing checking this one.
