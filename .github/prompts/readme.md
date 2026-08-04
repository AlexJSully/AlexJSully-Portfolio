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

`audit-docs` and `audit-quality` resolve scope in order, stopping at the first rule that applies: an explicit instruction, the active pull request, uncommitted changes, the component or system the surrounding task concerns, and only then everything. That last rung differs by what each one edits: the whole documentation set for `audit-docs`, the whole repository for `audit-quality`. Both state which rule applied in their output.

`audit-pr` stops at the branch's own commits and has no whole-repository rung at all: with no change to review it reports nothing rather than widening.

## Installing

**As a single prompt file.** Copy the `.prompt.md` into `.github/prompts/` and invoke it with `/audit-pr` in chat. Use this path when repository policy prevents installing anything else, since it is one file with no dependencies.

**As a skill, by package manager.** Every prompt above also ships as a skill directory. Two installers do the job, and either places it wherever your agent reads it. The skill names are `audit-docs`, `audit-pr`, and `audit-quality`.

With [`npx skills`](https://github.com/vercel-labs/skills), from Vercel Labs:

```bash
npx skills add AlexJSully/AlexJSully-Portfolio                     # pick from a list
npx skills add AlexJSully/AlexJSully-Portfolio --skill audit-docs  # or name one
npx skills add AlexJSully/AlexJSully-Portfolio --all               # or take every one
npx skills update                                                  # take later changes
```

It clones the repository and reads the default branch, so what you get is the current state of `main`. `list` and `remove` manage what you already have.

With [`gh skill`](https://cli.github.com/manual/gh_skill), from the GitHub CLI, in public preview. The skills sit in this repository's `.claude/skills/`, a hidden directory that `gh skill` skips unless told to include it, so every command below carries `--allow-hidden-dirs`. That flag puts the floor at version 2.91.0:

```bash
gh skill install AlexJSully/AlexJSully-Portfolio audit-pr --allow-hidden-dirs
gh skill install AlexJSully/AlexJSully-Portfolio audit-pr --allow-hidden-dirs --pin <tag-or-commit>
gh skill install AlexJSully/AlexJSully-Portfolio audit-pr --allow-hidden-dirs --force   # take later changes
```

Three things differ from `npx skills`. The skill name is positional rather than a `--skill` value. Given no version, `gh skill` resolves the newest tagged release rather than the default branch, so `--pin`, which takes a tag or a commit SHA and not a branch name, is how to ask for something newer than the last release. And `gh skill update` accepts no `--allow-hidden-dirs` of its own; where it does not pick up a change, re-running `install --force` does. Expect a warning that skills in a hidden directory may be copies from another publisher: this repository is where these ones are written.

Both target Claude Code, Copilot, Cursor, Codex, and Gemini CLI. `gh skill` installs for Copilot by default and reaches the others through `--agent`.

**Resolving the `#` references.** Some hosts resolve `#codebase`, `#changes`, and the rest automatically; the ones that do not need a **context resolution** table, which maps each reference to the command to run instead. `audit-pr` and `audit-quality` carry that table in both halves. `audit-docs` carries it in the skill half only, since every host that reads a prompt file resolves those three itself. Which references appear varies: all three use `#codebase` and `#changes`, `audit-docs` and `audit-pr` add `#activePullRequest`, `audit-quality` adds `#file:path`, and `audit-pr` alone adds `#issue_fetch`.

### Other skills in the same repository

One more is published from the same place and has no prompt half, because it is not an audit you run. Either installer takes it:

```bash
npx skills add AlexJSully/AlexJSully-Portfolio --skill typescript-code-and-test-standards
gh skill install AlexJSully/AlexJSully-Portfolio typescript-code-and-test-standards --allow-hidden-dirs
```

`typescript-code-and-test-standards` loads while you write rather than after, carrying the TypeScript and JavaScript rules a formatter and a linter cannot check: comment discipline, documentation on every exported symbol, tests shipping alongside logic changes, and a mocking policy whose default is not to mock. It reads the host project's own Prettier, ESLint, and test-runner configuration instead of imposing one, and activates on `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, and `.cts`. It pairs with `audit-quality` rather than overlapping it: one applies as the code is written, the other audits it once it exists.

Two further skills live in that directory carrying `metadata.internal`. What that hides depends on the installer: `npx skills` reads the key and offers four skills, while `gh skill` reads no visibility field at all and lists all six, so `--all` there takes the other two as well. They drive this repository's own tooling and would do nothing in yours, though they carry the same MIT licence as the rest, so nothing arrives unlicensed.

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
