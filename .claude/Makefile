# Entry points for the AI agent tooling in this directory.
#
# Run from the repository root:
#
#   make -f .claude/Makefile sync-prompts
#
# This lives here rather than at the repository root because it contains nothing but
# agent tooling, and the root is the product. Nothing in `npm run validate` or in a
# workflow may invoke any of it. See `rules/repo-independence.md`.

SYNC := .claude/scripts/check-prompt-skill-sync.mjs

.PHONY: help sync-prompts sync-prompts-to-skill sync-prompts-to-prompt

help: ## List the available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-24s %s\n", $$1, $$2}'

sync-prompts: ## Check that each audit prompt and its mirrored skill carry the same body
	@node $(SYNC)

sync-prompts-to-skill: ## Copy each prompt body onto its skill, after editing the prompt
	@node $(SYNC) --fix=to-skill

sync-prompts-to-prompt: ## Copy each skill body onto its prompt, after editing the skill
	@node $(SYNC) --fix=to-prompt
