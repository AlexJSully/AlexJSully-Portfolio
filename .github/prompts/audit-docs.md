---
title: 'Audit and Update docs/ Directory'
scope: 'repo'
targets:
    - 'docs/'
    - 'codebase'
labels:
    - 'documentation'
    - 'audit'
    - 'mermaid'
---

**Purpose:**
While reviewing this #activePullRequest, analyze the entire #codebase and ensure the #file:docs directory is accurate, up to date, and fully aligned with the current implementation.

---

## HARD RULES (Do Not Violate)

1. **No forward-looking or speculative content.**
    - Do NOT generate a `roadmap.md`.
    - Do NOT document planned features, hypothetical designs, or imagined improvements.
    - Document only what exists in the current codebase.

2. **No invented code.**
    - Only reference functions, hooks, classes, types, modules, files, directories, system architecture & design or packages that actually exist.
    - Verify existence before describing or linking anything.

3. **No placeholder text or TODOs.**
    - Do not create empty sections or stubs.
    - Every sentence must be grounded in verifiable code.

4. **No unnecessary rewriting of the entire system.**
    - Only update documentation that is outdated, incorrect, incomplete, or missing.

---

## What to Do

### 1. Audit the `docs/` directory

- Identify inaccuracies, outdated content, missing explanations, or architectural mismatches.
- Cross-reference source files, comments, directory structure, and actual behavior.

### 2. Update documentation strictly based on verified code

- Correct outdated statements.
- Add missing explanations grounded in the current implementation.
- Include **small, accurate code snippets** whenever explaining behavior, usage, or examples.
    - Snippets must reference real code that exists within the codebase.
    - No invented identifiers.

### 3. Use **Mermaid diagrams extensively**

- Proactively identify any section where a diagram would improve clarity.
- Include diagrams for:
    - data flows
    - module interactions
    - component relationships
    - lifecycle steps
    - architectural overviews
    - system interactions
- Use only diagrams that reflect **actual, current code** (no hypothetical structures).
- Prefer `flowchart`, `sequenceDiagram`, `classDiagram`, and `stateDiagram` when appropriate.

### 4. Reference real files frequently using markdown links

- Whenever referencing a file or module, **link directly to the file using proper markdown**: `[Description](relative/path/to/file.ts)`
- Confirm the file exists before linking.
- Use file links liberally so readers can immediately navigate to source.

### 5. Maintain clarity and conciseness

- Keep explanations self-contained and clear.
- Highlight real architectural decisions, assumptions, and edge cases.
- Avoid verbosity or speculative commentary.

### 6. Apply changes directly (docs only)

- Modify existing documentation files.
- Add new markdown files only when supported by real code.
- If creating a **new directory**:
  **a. Always create an `index.md`**
    - Must provide an overview of the directory’s purpose and contents.
      **b. Create only files that correspond directly to real, existing code.**
- No speculative or forward-looking directories or files.

---

## Final Step

After completing all changes, run `npm run validate` from #file:package.json and ensure markdown linting passes cleanly.
