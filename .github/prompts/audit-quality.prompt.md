---
title: 'Codebase Audit & Quality Improvement'
scope: 'repo'
targets:
    - 'src/'
    - 'codebase'
labels:
    - 'audit'
    - 'refactoring'
    - 'quality'
    - 'testing'
---

**Purpose:**
Act as a **Principal Code Reviewer and Refactoring Architect**. Perform a deep-dive audit of the #codebase to identify architectural flaws, technical debt, and maintainability issues. Once identified, proactively implement improvements to ensure a high-standard, robust, and scalable implementation.

---

## HARD RULES (Do Not Violate)

1. **The "Any" Rule:** - Acknowledge that `any` is often required for VS Code extension architecture.
    - Do **NOT** replace `any` with `unknown`.
    - If `no-explicit-any` does not exist in #file:eslint.config.mjs, do **NOT** add it.

2. **Proactive Improvement:**
    - Do not ask for permission to proceed.
    - Once vulnerabilities or smells are found, immediately proceed with the implementation and improvement of the #codebase based on your findings.

3. **Validation Frequency:**
    - Frequently run `npm run validate` from #file:package.json to verify incremental changes. If it fails, fix the issues immediately before proceeding.

---

## Execution Order (IMPORTANT)

1. **Breadth-First Audit:** Analyze #file:src and top-level packages to identify patterns and flaws.
2. **Test-Driven Implementation:** Apply refactors and fixes using a TDD approach.
3. **Documentation Integrity:** Update the #file:docs directory to reflect implementation changes.
4. **Final Sign-off:** Run a final `npm run validate` to ensure the entire workspace is stable.

---

## What to Do

### 1. Breadth-First Discovery (Audit Strategy)

Deeply analyze the source code. Do not fixate on `*.test.ts` files immediately; focus on the core logic and structure first. Evaluate through these lenses:

- **Architecture & Design:** Analyze boundaries, coupling vs. modularity, and bad design patterns. Flag over-engineering or premature abstractions.
- **Code Health:** Assess correctness, clarity, and cyclomatic complexity. Identify dead code, unused utilities, and DRY violations.
- **Operations & Robustness:** Review resilience, idempotency, and error handling (e.g., swallowed errors).
- **Security & Privacy:** Flag user-privacy concerns or security vulnerabilities.
- **Standards & Style:** Check adherence to Google style guides and documentation quality.
- **Domain Specifics:** Inspect UI/UX for **Accessibility** and analyze test design (flaky tests or over-mocking).

### 2. Test-Driven Updates

When creating new files or modifying existing ones, you **must** create or adjust unit tests.

- Use a **test case/table format** (data-driven testing) where applicable to ensure rigorous coverage.

### 3. Documentation Integrity (Step n-1)

As the **second-to-last step** (before the final validation), you must review the #file:docs directory.

- Ensure all documentation is accurate, up-to-date, and reflects the specific changes made during this session.

---

## Final Step

1. Perform a final run of `npm run validate`.
2. Ensure all code, tests, and documentation updates are complete and consistent.
3. Remember to follow #file:copilot-instructions.md for all operations.
