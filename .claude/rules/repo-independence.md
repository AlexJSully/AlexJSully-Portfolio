---
paths:
    - 'package.json'
    - 'package-lock.json'
    - '.claude/Makefile'
    - '*.config.js'
    - '*.config.ts'
    - '*.config.mjs'
    - 'tsconfig.json'
    - 'jsconfig.json'
    - '.prettierignore'
    - '.markdownlint-cli2.jsonc'
    - '**/.markdownlint-cli2.jsonc'
    - '.github/workflows/**'
    - 'docs/**'
---

# The repository never depends on agentic files

**If `.claude/` and `.github/prompts/` were deleted tomorrow, every command, build, test, and lint must still work.** The portfolio is the product; the agent tooling is scaffolding around it. Scaffolding may lean on the building, never the reverse.

## The rule

No `package.json` script, configuration file, workflow, build step, test, or page under [`docs/`](../../docs/index.md) may reference, invoke, import, or require anything under `.claude/` or `.github/prompts/`.

That includes indirect reliance: a script that shells out to a file there, a config that imports one, a test that reads one, and a documented procedure that tells a reader to run one.

**The dependency runs one way.** Agent tooling may reference the main codebase freely: `.claude/rules/testing.md` naming `npm run test:jest` is correct. `package.json` naming `.claude/scripts/anything` is not.

## The one exception

**An ignore or exclude glob may name an agentic path**, because it is inert when the path is absent: Prettier, ESLint, markdownlint, and `tsc` all treat a glob matching nothing as a no-op rather than an error. These are fine and are the only permitted form:

- `eslint.config.js` listing `.claude/**/*` under `ignores`
- `tsconfig.json` listing `.claude` under `exclude`
- `.prettierignore` naming the vendored `.claude/skills/skill-creator/`
- `.markdownlint-cli2.jsonc` naming it under `ignores`

## Where agent tooling gets an entry point

[`.claude/Makefile`](../Makefile), run from the repository root as `make -f .claude/Makefile <target>`. It sits inside the agent tooling rather than at the repository root, because a root file containing nothing but agent targets is itself the clutter this rule exists to prevent, and because it then disappears along with the tooling it drives. It is never called by `npm run validate` or by any workflow.

Rule of thumb for a new rule file, hook, or script: it lives under `.claude/`, nothing outside `.claude/` learns its name, and if a human needs to run it, it gets a target in `.claude/Makefile`.

## How to check

```bash
grep -rn '\.claude/\|\.github/prompts/' package.json docs/ README.md CONTRIBUTING.md \
  *.config.* tsconfig.json .github/workflows/
```

Every hit must be an ignore glob. Anything else is a violation. Note that `.claude/Makefile` is not a hit, because the search covers only non-agentic files.

The real proof is the delete simulation: move `.claude/` and `.github/prompts/` aside, run `npm run validate` end to end, and confirm exit 0. Restore afterwards.

## Why this is written down

The portfolio is the product; the agent tooling is one contributor's scaffolding around it. A gate, script, or documented procedure that reaches into `.claude/` fails for everyone who clones the repository without that tooling, and it fails as a broken build rather than as a missing convenience. The cost of the rule is one indirection through the Makefile; the cost of breaking it is borne by someone who never opted into the tooling at all.
