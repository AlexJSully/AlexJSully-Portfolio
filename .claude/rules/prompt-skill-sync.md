---
paths:
    - '.claude-plugin/marketplace.json'
    - '.claude/skills/*/.claude-plugin/plugin.json'
    - '.claude/skills/*/README.md'
    - '.claude/skills/*/SKILL.md'
    - '.claude/skills/*/agents/*.md'
    - '.claude/skills/*/assets/*.md'
    - '.claude/skills/*/references/*.md'
    - '.github/prompts/*.prompt.md'
---

# Published skills and their prompt halves

Three audits ship twice, once as a skill directory and once as a single prompt file:

| Prompt, for an agent that reads prompt files                               | Skill, for an agent that reads the Agent Skills format |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md)       | [`audit-docs/`](../skills/audit-docs/SKILL.md)         |
| [`audit-pr.prompt.md`](../../.github/prompts/audit-pr.prompt.md)           | [`audit-pr/`](../skills/audit-pr/SKILL.md)             |
| [`audit-quality.prompt.md`](../../.github/prompts/audit-quality.prompt.md) | [`audit-quality/`](../skills/audit-quality/SKILL.md)   |

Two audiences drive this. Someone whose employer allows a single file in the repository takes the prompt. Someone who can install a directory takes the skill, and gets the bundled `references/`, `agents/`, and `assets/` with it, subject to the caveat in [the plugin manifest section](#the-plugin-manifest-and-what-it-does-not-change) about which of those the specification actually covers.

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

`make -f .claude/Makefile check-skills` enforces every rule in this section, plus the specification itself: `name` matching the directory, `description` within its character limit, a body under 500 lines, a licence on every skill, and every bundled path resolving. It also gives each prompt a character budget: 36,000 for [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md), whose subject is narrower, and 52,000 for the other two. A skill can move detail into `references/`; a prompt is one file a reader scrolls, so its budget is the whole of what it can say. **Growth past a budget is a signal to condense, never to raise it.** What a prompt loses first is a rule restated across sections and a worked example following the rule it illustrates, and never a rule, a checklist item, or a category.

**Characters, because a line here is a paragraph.** `MD013` is off repository-wide and Prettier leaves prose unwrapped, so a single line runs to seventeen hundred characters. A line budget charges a prompt for its blank lines and its headings and lets it pay by deleting them, which makes the document harder to read while the number improves and nothing is condensed at all. Characters do not move when a file is reformatted, so the only way down is to cut what the prompt says. It is deliberately **not** part of `npm run validate`, because the repository must build, test, and lint with no agent tooling present.

## The plugin manifest, and what it does not change

A skill directory is a plugin root in two ways. In the repository holding it, a `.claude-plugin/plugin.json` inside it makes Claude Code load it as `<name>@skills-dir` on the next session, with no marketplace and no install step, and that manifest is what turns the files in `agents/` into agents a run can delegate to. Everywhere else, the marketplace at [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json) lists it with a `source` of `./.claude/skills/<name>`, and VS Code and Claude Code install the directory as a plugin whose root `SKILL.md` is its one skill and whose `agents/` they find by default, manifest or not. Without either route the files in `agents/` stay ordinary files, which is what each `SKILL.md` already treats as the default when it tells the run to open one and follow it: `agents/` is a host extension, not part of the Agent Skills specification, which defines `references/`, `assets/`, and `scripts/` and nothing else.

**The manifest is an optimization, never a dependency.** Every bundled procedure is written to be run by opening its file, and each `SKILL.md` says so before it mentions delegating, because a skill that tells an agent to delegate to something the host never registered has no documented fallback: the call fails and the run improvises. An improvised prompt carries none of the scope bound or evidence bar written inside the procedure, which is the whole reason the file exists.

Consequences to know before editing a skill, its manifest, or the marketplace:

- **The delegation identifier differs by route.** It is `<skill>@skills-dir:<agent>` in place and `<skill>:<agent>` after a Claude Code marketplace install. Write neither into a published skill: naming the file and letting the run resolve the identifier is what keeps the instruction true on every host.
- **The skill's manifest and `agents/` travel with every install.** `npx skills` copies every file except `metadata.json` and the `.git`, `__pycache__`, and `__pypackages__` directories, and `gh skill` copies every file in the tree, so a recipient's copy carries `.claude-plugin/` and loads as `<name>@skills-dir` in their repository too.
- **No manifest carries a `version`.** Claude Code keys a marketplace install on it, so a fixed value freezes every recipient on the copy they first installed. Left out, the version is the commit the plugin came from, and a push to `main` reaches marketplace installs the way it reaches `npx skills`. VS Code ignores the field and pulls the repository instead.
- **A marketplace entry carries only `name`, `source`, and `description`.** VS Code reads `name`, `description`, `version`, and `source` from an entry and drops the rest, so a component declared there would exist in Claude Code alone, and `npx skills` skips any path without the leading `./`. The entry repeats the manifest's `description` because that is the copy VS Code shows. For the same reason the marketplace sets no `metadata.pluginRoot`, which VS Code applies to `./` sources and Claude Code does not.
- **Every listed skill carries a `README.md`, and it travels too.** VS Code renders `<source>/README.md` as the plugin's page, under exactly that name and with no fallback to `SKILL.md`, so a skill without one shows an empty page. Every installer copies it with the skill, so it names nothing outside the skill directory, links nothing relative (VS Code renders it with no base address), and invokes the skill by name rather than by one host's command form.
- **One manifest per skill, one marketplace per repository.** VS Code reads `.plugin/plugin.json`, or a root `plugin.json` declaring the Agent Plugins `$schema`, ahead of `.claude-plugin/plugin.json`, and that format finds skills only under `skills/`, which would leave the directory's own `SKILL.md` unloaded. The Copilot CLI reads `.plugin/plugin.json`, any root `plugin.json`, and `.github/plugin/plugin.json` first. For marketplaces, VS Code and the Copilot CLI try `marketplace.json`, `.plugin/marketplace.json`, and `.github/plugin/marketplace.json` before `.claude-plugin/marketplace.json`, and the first one found is the whole catalogue.

[`plugin-manifests.mjs`](../scripts/plugin-manifests.mjs), which `make -f .claude/Makefile check-skills` runs, holds every manifest to these rules: it parses, its `name` matches the directory, it sets no `version`, no competing manifest sits beside it, and every path in an `agents` key starts with `./`, stays inside the skill directory, and resolves. It requires the marketplace to list every skill that is not internal and nothing else, each entry carrying exactly the three keys above, with a `description` equal to its manifest's and a `README.md` beside the skill. That comparison is why a listed skill needs a manifest even though the marketplace route does not. [`plugin-manifests.test.mjs`](../scripts/plugin-manifests.test.mjs) covers each of these rules, and `make -f .claude/Makefile test-scripts` runs it.

## A published skill stays reachable by name

**A published skill carries neither `user-invocable: false` nor `paths:`.** An adopter installs the directory and has the name on it and nothing else, so a key narrowing who may reach the skill, or when it activates, takes away the only handle they have. `user-invocable: false` hides it from the `/` menu outright. `paths:` is documented as limiting "when this skill is activated", and a skill carrying it did not answer to its own name here, though the documentation does not describe what happens when the command is typed while no matching file is open.

Where a project wants a skill to load automatically on certain files, the path glob belongs on a rules file, which is where [`code-style.md`](code-style.md) carries one. That mechanism stays inside the project and leaves the skill reachable everywhere.

An installable or internal skill may use both keys freely, and [`check-skill-publishability.mjs`](../scripts/check-skill-publishability.mjs) enforces this only against the `PUBLISHED` list. Nothing in the specification defines either key, so this is a policy of this repository rather than a rule of the format.

## The three states

Every skill is in exactly one, and [`check-skill-publishability.mjs`](../scripts/check-skill-publishability.mjs) prints which.

- **Published**, listed in that script's `PUBLISHED` array: used outside this repository, so **codebase-agnostic** (no path, script name, framework, or convention from here) and **language-agnostic**, except `typescript-code-and-test-standards`, whose subject is the language. Where an example needs a language, vary it across examples so no single one reads as required.
- **Installable**: an installer can offer it, but it is not held to the agnosticism bar.
- **Internal**: carries `metadata: internal: true`, which hides it from `npx skills` discovery and from installation unless `INSTALL_INTERNAL_SKILLS=1` is set, and keeps it out of the plugin marketplace, which offers every published and installable skill.

**Every skill carries a licence**, meaning both a `license` frontmatter key and a `LICENSE.txt` in the directory, because a copied directory is the whole of what the recipient gets. Nothing is exempt, internal skills included.

There is no `public` marker, because public is the absence of `internal`, and the Agent Skills specification defines no visibility field at all. `metadata` is its designated free-form map, and `internal` is the one key an installer actually reads, which is why the state does not survive every installer. `gh skill` reads none of it: `gh skill install <owner>/<repo> <skill> --allow-hidden-dirs` installs any of the six here by name, and the same command without the name lists all six. Repository visibility is the only lever there, and the licence on every skill is what keeps that harmless. That flag is also what makes the skills visible at all, since `gh skill` skips `.claude/` as a hidden directory; `npx skills` clones the repository and reads `.claude/skills/` without one.

**Nothing is vendored into this repository.** A third-party skill is fetched when wanted with `npx skills add <owner>/<repo> --skill <name>`, rather than copied in and then maintained.

## Frontmatter must parse as YAML

A `description` is usually the longest value in the file and the one most likely to contain a colon. An unquoted plain scalar may not contain a colon followed by a space, so a description reading `standards linters cannot catch: comment discipline` makes the whole document unparseable, and a host that uses a real YAML parser cannot load the skill at all. Quote any value containing `": "`. The check catches this class, because the script reads frontmatter with a regex that would otherwise accept what a parser rejects.

## Adding a new pair

Create `.github/prompts/<name>.prompt.md` and `.claude/skills/<name>/SKILL.md`, write both, then run the check. Add the name to `PUBLISHED` in the script only when it is meant for people outside this repository, since that list is what turns on the isolation and licensing rules.
