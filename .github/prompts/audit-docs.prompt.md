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

Act as a **Strictly Factual Technical Auditor**. Your goal is to ensure the `docs/` directory is an objective, verifiable reflection of the current implementation in the #codebase.

**Core Philosophy:**

- **Reporter, Not Editor:** You convert code facts into documentation. You do **not** decide what is "important," "critical," or "interesting" on your own.
- **Objective Reality:** If the code does X, document X. Do not add commentary on _how well_ it does X.
- **Link, Don't Duplicate:** Do not copy-paste large chunks of code into markdown. Point the reader to the source of truth.

**Audience Strategy (Dual Focus):**
Documentation must serve two audiences simultaneously:

1.  **Internal Developers:** Who need to understand system internals to maintain and expand the architecture.
2.  **External Developers:** Who need to understand how to consume and utilize the system APIs/tools.

**Tone:**

- **Approachable (For Concepts):** Use clear, simple natural language when introducing _what_ a system does.
- **Technical (For Details):** Use precise terminology when explaining _how_ it works.
- **Objective (For Adjectives):** See Hard Rule #2 below.

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
        - **Mandatory Correction:** If existing text describes behavior that contradicts the code (e.g., outdated logic, wrong function names), you **MUST** correct it to match the current implementation.
        - Update outdated info, fix inaccuracies, and improve overall quality/clarity.
        - Consolidate fragmented files to reduce noise.
        - **Create New Files & Directories (Strategic Expansion):**
            - **Step 1: Check Existing Structure.** Before creating anything, scan `docs/`. If a logical home exists, place the file there.
            - **Step 2: Apply Diátaxis Framework.** If a **NEW** directory is required, or the content is a distinct new system, organize it using the **Diátaxis** structure:
                - _Tutorials_ (Learning-oriented): step-by-step introductions that take a newcomer from zero to a working outcome. Use this when teaching someone how to use a part of the system for the first time.
                - _How-To Guides_ (Problem-oriented): focused recipes that solve a specific, real-world task. Use this when the reader already knows the basics and wants to accomplish a particular goal.
                - _Reference_ (Information-oriented): factual, exhaustive descriptions of APIs, components, configuration options, and behaviors. Use this when documenting “what exists” and its exact inputs/outputs.
                - _Explanation_ (Understanding-oriented): background, rationale, and architectural overviews. Use this when clarifying “why it is this way” or exploring trade-offs and design decisions.
            - **Scope:** Create new artifacts for:
                - **New Components:** Systems, designs, modules or architecture that do not fit into existing files.
                - **External APIs:** Dedicated usage guides for external consumers.
                - **Missing Structures:** Standard directories needed for organization.
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
    - **No "Name-Based" Assumptions:** Do not assume a function does X just because it is named `doX`. Read the implementation logic. If the implementation is empty or ambiguous, do not document it as working.

2.  **Strict Objectivity (The Fact vs. Opinion Protocol)**
    - **The Truth Override (CRITICAL):** If existing human-written documentation is factually incorrect (e.g., claims the system uses TCP when code shows UDP), you **MUST** correct it. Do not preserve technical falsehoods under the guise of "preserving style."
    - **Generation (New Content):** When _you_ write new documentation, do not use subjective adjectives like: _important, critical, robust, seamless, best-in-class._ Stick to verifiable facts.
    - **Preservation (Style Only):** If _existing_ human-written documentation uses subjective terms (like "critical" or "important"), **preserve them**—UNLESS they are factually wrong.
    - **The Line:**
        - _Bad (AI Generated):_ "The `auth.ts` middleware is a critical component." (Opinion).
        - _Good (AI Generated):_ "The `auth.ts` middleware blocks unauthorized requests." (Fact).
        - _Correction Example:_ Existing doc says "Returns JSON." Code returns "XML." -> **Change to XML.**

3.  **No Placeholder Text or TODOs**
    - Do not create empty sections or stubs.
    - Do not leave comments like "Add more details here."
    - Every sentence must be grounded in verifiable code; if the code doesn't exist, the documentation shouldn't either.

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

- **Mandatory File Citations (The "Proof of Work" Rule):**
    - **Strict Requirement:** You are forbidden from describing technical logic without citing the source file.
    - **Placement:** Do not break the reading flow with inline citations. Place links at the very end of the specific section or paragraph.
    - **Format:** `Implementation: [filename](./path/to/file)`
    - **Enforcement:** If you cannot find the file to link, **delete the text**. You may not write about code you cannot link to.

- **High-Density, Low-Volume:**
    - Avoid "Wall of Text." Use bullet points and headers to break up density.
    - Do not narrate code line-by-line. Explain _why_ it exists (architecturally) and _how_ the system uses it.
    - **Zero Bloat:** If a sentence does not add strict technical value or learning clarity, do not add it.

---

## 4. Mermaid Diagrams (Strategic & Meaningful)

**Goal:** Proactively use **Mermaid** diagrams to visualize complexity. A picture is worth a thousand words.

**The "Complexity Threshold" (When to Create):**
If you are documenting the following categories, a **Mermaid** diagram is **strongly expected**:

- **System Interactions:** Multi-service communication.
- **State Management:** Complex lifecycles, State machines, or Workflow engines.
- **Data Architecture:** Data ingestion pipelines or Event-driven architectures.
- **Logic depth:** If a process involves more than 5 distinct steps or components interacting, create a diagram.

**When NOT to Create:**

- **Trivial Logic:** Simple function calls, basic CRUD, or single-file utility functions.
- **Redundancy:** Do not create diagrams that simply repeat a bulleted list of a few items.
- **Overuse:** Avoid diagrams for every minor detail. Use only when it adds clarity.

**Technical Rules:**

- **Format:** All diagrams must be written in valid **Mermaid** syntax. No ASCII art or static images.
- **Accessibility:** Do **NOT** use Mermaid `style` or color customizations. Keep default and clean.
- **Accuracy:** Diagrams must reflect **actual, current code**. No hypothetical structures.
- **Types:** Prefer `flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram`.

---

## 5. Formatting Standards

1.  **Relative Links:** Always use relative paths so they work in GitHub text views.
2.  **Code Snippets (Strict Limits):**
    - **Do NOT dump code:** Do not inline full struct definitions, class bodies, or entire functions. This is documentation, not a copy of the codebase.
    - **Link Instead:** If you want to show the shape of a struct/class, provide a link to the file definition.
    - **Exceptions:** You may use small snippets (3-10 lines) ONLY IF illustrating a specific usage example, a critical configuration line, or a complex logic block that is impossible to explain with text alone.
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
3.  **Check for Accuracy, Hallucinations & Bloat:**
    - _Did I assume what a function does based on its name, or did I read the logic? (If assumed -> Verify it)._
    - _Are my statements 100% verifiable and grounded in existing #codebase implementation?_
    - _**Did I verify if existing text matches the code? If it is outdated/wrong, did I correct it?**_
    - _Did I inline a full struct or class definition? (If yes -> Delete it and replace with a link)._
    - _Did I insert NEW subjective words? (If yes, remove them. If preserving existing ones, keep them)._
    - _Did I cite the file for the logic I just explained? If not, find the file or delete the text._
4.  **Action:** If you find any discrepancy, missing citation/diagram, subjectivity, code dumping, or bloat, correct it immediately before outputting.

---

## Final Verification Checklist

Before concluding this task, verify:

1.  _Does this content serve both internal and external devs?_
2.  _Did I remove all placeholders?_
3.  _Did I properly define all acronyms on first use?_
4.  _Did I include meaningful Mermaid diagrams for complex systems?_
5.  _Did I replace massive code dumps with links?_
6.  _Did I place implementation citations at the end of sections?_
7.  _Did I correct factual errors in existing documentation?_
8.  _Did I run Phase 2 (General Audit) even if I made changes in Phase 1?_
9.  _Did I follow the Diátaxis Framework for any NEW directory structures?_
