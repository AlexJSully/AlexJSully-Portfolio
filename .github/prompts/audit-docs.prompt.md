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

## Purpose

While reviewing this #activePullRequest #changes, analyze the entire #codebase and ensure the #file:docs directory is accurate, up to date, and fully aligned with the current implementation.

Documentation produced by this prompt must serve **two audiences simultaneously**:

1. **Internal developers / maintainers**
    - To understand system internals, architectural decisions, constraints, and design intent
    - To preserve *why* things were implemented the way they are and the *how* behind the *what*
2. **New or external developers**
    - To understand how to use the system, APIs, and modules as tools
    - To quickly navigate from documentation to implementation

---

## HARD RULES (Do Not Violate)

1. **No forward-looking or speculative content**
    - Do NOT generate a `roadmap.md`
    - Do NOT document planned features, hypothetical designs, or imagined improvements
    - Document only what exists in the current codebase

2. **No invented code**
    - Only reference functions, hooks, classes, types, modules, files, directories, system architecture & design, or packages that actually exist
    - Verify existence before describing or linking anything

3. **No placeholder text or TODOs**
    - Do not create empty sections or stubs
    - Every sentence must be grounded in verifiable code

4. **No unnecessary rewriting**
    - Only update documentation that is outdated, incorrect, incomplete, or missing
    - Preserve accurate documentation as-is

---

## Execution Order (IMPORTANT)

1. **Audit `docs/` first**
2. **Only if `docs/` is already accurate**, then:
    - Audit markdown files elsewhere in the repository (root or subdirectories)
    - Audit in-code documentation/comments where clarity or accuracy is lacking

Do **not** skip ahead.

---

## Documentation Style & Priorities (CRITICAL)

### Description-first, Code-second

When documenting behavior, architecture, or usage:

1. **Start with a succinct natural-language explanation**
    - Explain *what the component does*, *why it exists*, and *how it fits into the system*
2. **Link directly to the implementation**
    - Prefer links to real source files over inline code
    - Example:
      > The request validation logic is centralized in `validateRequest`, which enforces schema constraints before execution.
      > See implementation: [`src/api/validateRequest.ts`](src/api/validateRequest.ts)
3. **Use inline code blocks sparingly and intentionally**
    - Include code snippets **only when they materially improve understanding**, such as:
        - Public API usage examples
        - Non-obvious control flow
        - Critical invariants or edge cases
    - Snippets must be:
        - Small
        - Accurate
        - Directly copied or derived from real code
    - Avoid restating large sections of implementation inline

**Inline code should reinforce understanding — not replace navigation to source.**

---

## What to Do

### 1. Audit the `docs/` directory

- Identify inaccuracies, outdated content, missing explanations, or architectural mismatches
- Cross-reference:
    - Source files
    - Directory structure
    - In-code comments
    - Actual runtime behavior

---

### 2. Update documentation strictly based on verified code

- Correct outdated or incorrect statements
- Add missing explanations grounded in the current implementation
- Clearly distinguish:
    - **Conceptual behavior** (what/why)
    - **Implementation details** (how)
- Prefer:
    - **Explanation + file link**
    - Over large inline code blocks

---

### 3. Use Mermaid diagrams extensively

Proactively identify any section where a diagram would improve clarity.

Include diagrams for:

- Data flows
- Module interactions
- Component relationships
- Lifecycle steps
- Architectural overviews
- System interactions

Rules:

- Diagrams must reflect **actual, current code**
- No hypothetical or idealized structures
- Prefer:
    - `flowchart`
    - `sequenceDiagram`
    - `classDiagram`
    - `stateDiagram`

---

### 4. Reference real files frequently using markdown links

- Whenever referencing a file, module, or subsystem:
    - Link directly using relative paths
      Example: `[Auth middleware](src/middleware/auth.ts)`
- Confirm the file exists before linking
- Use links liberally to encourage source exploration

---

### 5. Maintain clarity and conciseness

- Keep explanations focused and self-contained
- Explicitly document:
    - Architectural decisions (use mermaid diagrams when applicable in addition to text)
    - Constraints and limitations
    - Trigger conditions
    - Expected inputs and outputs
    - Notable edge cases
- Avoid verbosity, repetition, or speculative commentary

---

### 6. Apply changes directly (docs only)

- Modify existing documentation files
- Add new markdown files **only when supported by real code**
- If creating a new directory:
    - **Always include an `index.md`**
        - Describe the directory’s purpose and contents
    - Create files that map directly to existing code artifacts
- No speculative or forward-looking files or directories

---

## Final Step

After completing all changes, run `npm run validate` from #file:package.json and ensure markdown linting passes cleanly.
