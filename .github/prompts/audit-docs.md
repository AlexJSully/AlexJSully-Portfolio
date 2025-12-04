---
title: "Audit and Update docs/ Directory"
scope: "repo"
targets:
  - "docs/"
  - "codebase"
labels:
  - "documentation"
  - "audit"
  - "mermaid"
---

Purpose:
  While reviewing the #activePullRequest, analyze the entire #codebase and ensure
  that the #file:docs directory is fully up to date, consistent, and accurate based
  on the current implementation.

What to do:

1. Audit the `docs/` directory against the real codebase

   - Identify documentation gaps, inaccuracies, outdated explanations, or missing sections.
   - Cross-check code comments, architecture, directory structure, core modules, exposed APIs, utilities, and workflows.

2. Update documentation as necessary

   - Revise outdated sections.
   - Add missing content.
   - Rewrite unclear explanations.
   - Add short code snippets where they meaningfully clarify how something works.

3. Use visual diagrams as frequently as appropriate

   - Prefer Mermaid diagrams to explain architecture, flows, relationships, state transitions, data movement, or component interactions.
   - Choose diagram types that best communicate the system (e.g., `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram`, `gitGraph`).
   - When explaining logic, system or architecture, include Mermaid diagrams when applicable.

4. Ensure architectural accuracy

   - Validate that the documented behavior matches real code.
   - If implementation diverges from existing docs, update docs to match real behavior.

5. Maintain a concise, structured writing style

   - Keep explanations clear and self–contained.
   - Avoid unnecessary verbosity.
   - Highlight important behaviors or assumptions explicitly.

6. Make changes directly

   - Modify documentation files.
   - Add new files if needed.
   - Update diagrams.
   - Include only meaningful and defensible changes; do not generate placeholder text.

Goal:
  Produce a clean, accurate, comprehensively updated `docs/` directory that fully
  reflects the current implementation, backed by diagrams and practical examples.

Acceptance checklist (use as review checklist):

- [ ] Audit `docs/` for correctness against actual code
- [ ] Fix or update inaccurate/outdated pages
- [ ] Add missing sections or examples
- [ ] Add Mermaid diagrams where helpful
- [ ] Ensure examples are runnable/accurate
- [ ] Run repository `validate` (format, lint and testing) are passing and fix markdown lint issues. For example #file:package.json `npm run validate`

Notes:

- Prefer concrete changes only; avoid adding placeholders or speculative content.
