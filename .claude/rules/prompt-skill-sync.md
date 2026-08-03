---
paths:
    - '.github/prompts/*.prompt.md'
    - '.claude/skills/*/SKILL.md'
    - '.claude/skills/*/references/*.md'
    - '.claude/skills/*/agents/*.md'
    - '.claude/skills/*/assets/*.md'
---

# Published skills and their prompt halves

Three audits ship twice, once as a skill directory and once as a single prompt file:

| Prompt, for an agent that reads prompt files                               | Skill, for an agent that reads the Agent Skills format |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md)       | [`audit-docs/`](../skills/audit-docs/SKILL.md)         |
| [`audit-pr.prompt.md`](../../.github/prompts/audit-pr.prompt.md)           | [`audit-pr/`](../skills/audit-pr/SKILL.md)             |
| [`audit-quality.prompt.md`](../../.github/prompts/audit-quality.prompt.md) | [`audit-quality/`](../skills/audit-quality/SKILL.md)   |

Two audiences drive this. Someone whose employer allows a single file in the repository takes the prompt. Someone who can install a directory takes the skill, and gets the bundled `references/`, `agents/`, and `assets/` with it.

## The contract: same objective, not same bytes

**Both halves aim at the same outcome. The skill may carry more capability to reach it.**

A reader of either half should be able to run the audit and get the same kind of result, held to the same rules, producing the same shape of report. What the skill adds is depth a single file cannot carry: reference material loaded on demand, subagents, and templates.

What must never differ:

- **A hard rule.** If one half forbids something, so does the other. A rule that exists in the skill and not the prompt is a silent downgrade for every prompt reader.
- **The scope resolution**, the evidence standard, and the output format.
- **The objective.** Both halves describe the same job.

What may differ:

- **Bundled depth.** Only the skill can point at `references/`, `agents/`, or `assets/`.
- **Fallback instructions for an agent that resolves less automatically.** The skill half of `audit-docs` carries a context-resolution table the prompt does not need.
- **Frontmatter**, which was never shared. The prompt carries the prompt-file keys; the skill carries the Agent Skills keys.

**This is a judgement, not a diff.** Nothing decides it mechanically, so after editing either half, hand both to the `prompt-skill-sync` subagent and read its verdict rather than assuming.

## Each half is downloaded alone

Whichever half someone takes is the only thing they get. Four rules follow.

- **A skill never names a prompt.** No `.prompt.md`, no `.github/prompts/`. The adopter has no such file. This includes the `description`, which loads at startup on every run.
- **A prompt never names a skill or anything beside it.** No `SKILL.md`, no `references/`, no `.claude/`, and no link to a real file in this repository. It is one file in a repository that has no directory for it.
- **A skill may name its own bundled files**, because they travel with it. This is what the skill format is for.
- **Neither half names a sibling audit or this repository.** A reader may hold exactly one of the three, and knows nothing of where it came from.

An illustrative link, such as `[config.py](../src/config.py)` inside an example teaching the citation format, is not a real link and is allowed. The test is whether the target exists here: if it does, the author linked to something real and it will break.

`make -f .claude/Makefile check-skills` enforces every rule in this section, plus the specification itself: `name` matching the directory, `description` within its character limit, a body under 500 lines, a licence on every published skill, and every bundled path resolving. It is deliberately **not** part of `npm run validate`, because the repository must build, test, and lint with no agent tooling present.

## The three states

Every skill is in exactly one, and [`check-skill-publishability.mjs`](../scripts/check-skill-publishability.mjs) prints which.

- **Published**, listed in that script's `PUBLISHED` array: used outside this repository, so **codebase-agnostic** (no path, script name, framework, or convention from here) and **language-agnostic**, except `typescript-code-and-test-standards`, whose subject is the language. Where an example needs a language, vary it across examples so no single one reads as required.
- **Installable**: an installer can offer it, but it is not held to the agnosticism bar.
- **Internal**: carries `metadata: internal: true`, which hides it from `npx skills` discovery and from installation unless `INSTALL_INTERNAL_SKILLS=1` is set.

**Anything an installer can offer carries a licence**, meaning both a `license` frontmatter key and a `LICENSE.txt` in the directory, because a copied directory is the whole of what the recipient gets. Only an internal skill is exempt, and only because nobody receives it.

There is no `public` marker, because public is the absence of `internal`, and the Agent Skills specification defines no visibility field at all. `metadata` is its designated free-form map, and `internal` is the one key an installer actually reads. Note that `gh skill` documents no visibility concept, so `metadata.internal` may not hide anything from it; repository visibility is the only lever there.

**Nothing is vendored into this repository.** A third-party skill is fetched when wanted with `npx skills add <owner>/<repo> --skill <name>`, rather than copied in and then maintained.

## Frontmatter must parse as YAML

A `description` is usually the longest value in the file and the one most likely to contain a colon. An unquoted plain scalar may not contain a colon followed by a space, so a description reading `standards linters cannot catch: comment discipline` makes the whole document unparseable, and a host that uses a real YAML parser cannot load the skill at all. Quote any value containing `": "`. The check catches this class, because the script reads frontmatter with a regex that would otherwise accept what a parser rejects.

## Adding a new pair

Create `.github/prompts/<name>.prompt.md` and `.claude/skills/<name>/SKILL.md`, write both, then run the check. Add the name to `PUBLISHED` in the script only when it is meant for people outside this repository, since that list is what turns on the isolation and licensing rules.
