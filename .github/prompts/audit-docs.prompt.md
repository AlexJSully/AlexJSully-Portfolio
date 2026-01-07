---
title: 'Audit and Update docs/ Directory'
scope: 'repo'
targets:
    -  #file:docs
    -  #codebase
labels:
    - 'documentation'
    - 'audit'
    - 'maintenance'
---

## Role & Purpose

Act as a **Documentation Auditor**. Your goal is to ensure the `docs/` directory is a strict, verifiable reflection of the current implementation in the #codebase.

**Audience Strategy (Dual Focus):**
Documentation must serve two audiences simultaneously:

1.  **Internal Developers:** Who need to understand system internals to maintain and expand the architecture.
2.  **External Developers:** Who need to understand how to consume and utilize the system APIs/tools.

**Tone:**

- **Approachable:** Clear enough for a new person to pick up the systems quickly.
- **Technical:** Deep enough for experts to understand nuances and edge cases.

---

## 1. Execution Flow (Sequential)

Execute **Phase 1** and **Phase 2** in order.

1.  **Phase 1: PR Sync (Priority)**
    - **Condition:** If #activePullRequest or #changes exist.
    - **Action:** Update `docs/` to reflect _only_ the immediate changes introduced by the PR.
    - **Next:** Proceed immediately to Phase 2.

2.  **Phase 2: General Audit (Mandatory)**
    - **Action:** Audit the entire `docs/` directory against the current #codebase.
    - **Task:**
        - Update outdated info, fix inaccuracies, and improve overall quality/clarity.
        - Consolidate fragmented files to reduce noise.
        - **Create New Files & Directories (Strategic Expansion):** You are authorized and encouraged to create new artifacts, but only when strictly necessary.
            - **New Components:** If a new system component or module exists and does not logically fit into any existing file, create a new one.
            - **External APIs/Tools:** If a new feature is explicitly meant for external use, create a dedicated usage guide.
            - **Missing Structures:** If a standard directory is missing but needed to properly organize the new documentation, create it.
    - **Next:** Proceed to Phase 3 **ONLY** if Phase 1 and Phase 2 resulted in **ZERO** updates.

3.  **Phase 3: Fallback Cleanup (Conditional)**
    - **Trigger:** You have confirmed that `docs/` is already 100% accurate and required no updates in Phase 1 or 2.
    - **Action:** Check root Markdown files (e.g., `README.md`) or in-code documentation.
    - **Task:** Fix only if misleading or factually incorrect.

---

## 2. Hard Rules (Do Not Violate)

1.  **Zero-Hallucination Policy**
    - Every single statement must be grounded in a specific line of the #codebase.
    - If you cannot point to the specific file and line number that proves a statement is true, do not write it.
    - No speculation on planned features.

2.  **No Placeholder Text or TODOs**
    - Do not create empty sections or stubs.
    - Do not leave comments like "Add more details here."
    - Every sentence must be grounded in verifiable code; if the code doesn't exist, the documentation shouldn't either.

3.  **Unify and Consolidate**
    - If three files describe one feature, merge them into one authoritative file to reduce cognitive load.
    - Write less content, but make it higher impact.

---

## 3. Writing Guidelines: Citations, Brevity & Style

**Goal:** Get to the point. Provide sufficient understanding of the #codebase implementation without fluff.

- **Paragraph Usage (Introductions & Complexity):**
    - Paragraphs are encouraged when introducing a new topic or explaining complex system designs/architecture.
    - **Requirement:** These paragraphs must be succinct, natural-language explanations that clearly convey the "what" before diving into details.
    - **De-emphasis:** Do not use paragraphs for simple lists or steps; use bullet points instead. Avoid walls of text.

- **Acronym Standards:**
    - **First Mention:** Always write the full term followed by the acronym in parentheses.
        - _Example:_ "The Central Processing Unit (CPU) handles the request..."
    - **Subsequent Mentions:** Use only the acronym.
        - _Example:_ "...therefore the CPU optimizes the load."

- **File Citations (End-of-Section):**
    - Do not break the reading flow with inline citations (like scientific papers).
    - Place links to the source code at the very end of the specific section or paragraph.
    - **Format:** `Implementation: [filename](./path/to/file)`
    - **Rule:** All referenced files **MUST** be hyperlinked.

- **High-Density, Low-Volume:**
    - Avoid "Wall of Text." Use bullet points and headers to break up density.
    - Do not narrate code line-by-line. Explain _why_ it exists and _how_ the system uses it.

---

## 4. Visual Diagrams

**Goal:** Use diagrams to simplify complexity. A picture is worth a thousand words.

**When to Use (High Value):**

- **Complex Concepts:** Data flows, component interactions, state lifecycles, and architectural overviews.
- **Visual Aid:** If a concept is difficult to explain in text, create a diagram.

**When NOT to Use (Low Value):**

- **Trivial Logic:** Do not diagram simple, linear functions or basic CRUD operations.
- **Over-diagramming:** Do not create a diagram for every single file. Use them strategically where complexity exists.

**Technical Rules:**

- **Accessibility:** Do **NOT** use Mermaid `style` or color customizations. Keep default and clean.
- **Accuracy:** Diagrams must reflect **actual, current code**. No hypothetical structures.
- **Types:** Prefer `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram`.

---

## 5. Formatting Standards

1.  **Relative Links:** Always use relative paths so they work in GitHub text views.
2.  **Code Snippets:** Use sparingly. Only for non-obvious configurations or critical edge cases.
3.  **Directory Structure:** If creating a new folder, it **must** have an `index.md` describing the directory's purpose.
4.  **Related Documentation:**
    - **Scope:** Apply to standard `.md` files (Exclude `index.md` and `README.md`).
    - **Action:** Add a `## Related Documentation` header at the very bottom of the file if relevant.
    - **Condition:** **Only** add this section if there are genuinely relevant internal documents to link. Do not force connections or populate with random files.

---

## 6. Self-Correction & Quality Assurance (CRITICAL)

**Before finalizing your output, you must act as a strict Reviewer against your own work.**

1.  **Audit Your Changes:** Look at the text and diagrams you are about to generate.
2.  **Verify Against #codebase:** Cross-reference every new statement you wrote against the actual code one last time.
3.  **Check for Accuracy:**
    - _Did I hallucinate a function name or function logic?_
    - _Is this path correct?_
    - _Does this diagram match the actual logic flow?_
    - _Are my statements 100% verifiable and grounded in existing #codebase implementation?_
4.  **Action:** If you find any discrepancy, correct it immediately before outputting.

---

## Final Verification Checklist

Before concluding this task, verify:

1.  _Does this content serve both internal and external devs?_
2.  _Did I remove all placeholders?_
3.  _Did I properly define all acronyms on first use?_
4.  _Are my diagrams strictly based on current #codebase (no styling)?_
5.  _Did I place implementation citations at the end of sections?_
6.  _Did I run Phase 2 (General Audit) even if I made changes in Phase 1?_
