# Entry points for the AI agent tooling in this directory.
#
# Run from the repository root:
#
#   make -f .claude/Makefile check-skills
#
# This lives here rather than at the repository root because it contains nothing but
# agent tooling, and the root is the product. Nothing in `npm run validate` or in a
# workflow may invoke any of it. See `rules/repo-independence.md`.

CHECK := .claude/scripts/check-skill-publishability.mjs

.PHONY: help check-skills

help: ## List the available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-24s %s\n", $$1, $$2}'

check-skills: ## Validate every skill against the Agent Skills spec, and each published half against the isolation rules
	@node $(CHECK)
