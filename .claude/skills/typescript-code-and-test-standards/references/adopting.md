# Adopting this skill in a project

The skill is self-contained, so copying this directory into `.claude/skills/` is the whole install for any agent that reads the Agent Skills format.

Two drop-in templates cover the surfaces a skill directory does not reach:

- [project-rules.template.md](../assets/project-rules.template.md) goes in `.claude/rules/`. It carries a `paths:` glob array and records the project-specific conventions this skill deliberately does not hold. Claude Code and the VS Code Copilot extension both read that location.
- [copilot-instructions.template.md](../assets/copilot-instructions.template.md) goes in `.github/instructions/`. It carries an `applyTo:` glob string and is a self-contained digest rather than a pointer, because Copilot code review on github.com has no skill loader and cannot follow a link into a skill directory. Use this path when a repository policy prevents installing the skill itself.
