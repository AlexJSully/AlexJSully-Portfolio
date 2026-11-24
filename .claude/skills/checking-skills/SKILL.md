---
name: checking-skills
description: Validates every skill against the Agent Skills specification and checks that each published audit's prompt half and skill half still work alone, then delegates any semantic divergence to the prompt-skill-sync subagent. Use after editing any file under .github/prompts/, .claude/skills/, or .claude-plugin/.
argument-hint: '[skill name to focus on; omit to check everything]'
license: MIT
metadata:
    internal: true
disable-model-invocation: true
allowed-tools: Bash(make -f .claude/Makefile check-skills) Read Grep Glob
---

# Check skills

Three audits ship twice: `.github/prompts/<name>.prompt.md` for an agent that reads prompt files, and `.claude/skills/<name>/SKILL.md` for one that reads the Agent Skills format. They carry the same objective rather than the same bytes, and the full contract is in [`prompt-skill-sync.md`](../../rules/prompt-skill-sync.md).

## Run the mechanical check

Run it from the repository root, the directory holding `.claude/`, never from this skill's own directory:

```bash
make -f .claude/Makefile check-skills
```

Each failure names its file and the rule it breaks. Fix every failure it reports and run it again until it exits 0. With a skill name as the argument, the check still runs every skill, and you report only the lines naming that one.

Exit 0 means the mechanical rules hold. It does **not** mean the two halves still agree.

## Then judge parity

Whether both halves still aim at the same outcome is a judgement no script makes. Hand it to the `prompt-skill-sync` subagent, which reads both halves in its own context, builds a rule inventory for each, classifies every difference as allowed depth, allowed fallback, or real divergence, and repairs a divergence in the half that lacks the rule.

Run it after any edit to either half, not only when the mechanical check fails. The failure it catches, a hard rule present in the skill and missing from the prompt, passes the mechanical check cleanly.
