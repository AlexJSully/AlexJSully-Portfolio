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

Act as a **Strictly Factual Technical Writer and Auditor**. Ensure the `docs/` directory is an objective, verifiable reflection of the current #codebase implementation.

**Primary mandate:** Write and correct documentation based on code reality. Perform updates so `docs/` matches the #codebase, #activePullRequest, or #changes.

**Core Philosophy:**

- **Reporter, Not Editor:** Convert code facts into documentation. Do not editorialize.
- **Document Value, Not Narration:** Well-written code is self-documenting for _what_ it does. Documentation must add value beyond restating code: explain _why_ something exists (architectural decisions, constraints, trade-offs), _how_ components interact (system boundaries, data flows, integration points), and _when_ to use something (intended usage context, prerequisites). If a doc merely restates what reading the code would tell you, it's noise — make it meaningful.
    - **Exception:** Consumer-facing API/tool documentation should document _what_ the code does, since external consumers cannot read the source.
- **Objective Reality:** If the code does X and documentation of X adds value (per above), document X factually. No commentary on quality.
- **Link, Don't Duplicate:** Point to source files, don't copy code into markdown.

**Dual Audience:** Documentation must serve both audiences simultaneously — internal developers (maintaining/expanding architecture) and external developers (consuming APIs/tools). Every document should be useful to at least one audience; prefer content that serves both.

**Tone:** Approachable for concepts, technically precise for details, objective always (see Hard Rule #2).

---

## 1. Execution Flow (Sequential)

Execute all three phases in order.

### Phase 1: PR Sync

- **Condition:** If #activePullRequest or #changes exist.
- Treat the PR diff as **source of truth**.
- Identify code-level changes (new, removed, modified behavior).
- **Update `docs/`** to document those changes — even if the PR didn't touch docs.
- **Scope:** Only document behavior changed by the PR.
- **Output:** State whether you made changes or found docs already accurate.

### Phase 2: General Audit

- Audit entire `docs/` against current #codebase.
- **Correct** pre-existing content that contradicts code. Preserve accurate content's phrasing/style.
- **Delete** pre-existing content ONLY if: massively duplicated, describes removed features, or fundamentally cannot be corrected. **Default:** Correct rather than delete.
- Your own generated content may be freely edited/removed if it contains errors.
- **Create new files** when needed:
    1. Check existing structure first — use existing homes when possible.
    2. For new directories, apply **Diátaxis** framework: Tutorials (learning-oriented), How-To Guides (task-oriented), Reference (information-oriented), Explanation (understanding-oriented).
    3. Create for: new components/systems, external API guides, missing structures.
- **Output:** State whether you made changes or found docs already accurate.

### Phase 3: In-Code Documentation Audit

**MANDATORY** — execute regardless of Phase 1/2 results.

- **Scope:** All `.md` files outside `docs/`, docstrings/JSDoc, inline comments, module headers across the target.
- **Actions:**
    1. Scan target for all documentation/comments
    2. Read current implementation of each documented element
    3. Verify accuracy against actual code behavior
    4. Update or remove inaccurate/outdated content
    5. Add missing docs ONLY for: exported/public APIs lacking documentation, complex internal logic unclear to maintainers
    6. **Remove bloat:** Over-verbose AI comments, redundant narration of obvious code. Keep only: "why" explanations, non-obvious "what" descriptions, essential "how" for complex algorithms.
- **In-Code Standards:**
    - Exported elements: Concise docstring (what, params, returns — only when non-obvious from names)
    - Internal elements: Document ONLY complex/non-obvious logic, gotchas, or edge cases
    - Inline comments: Only for non-obvious business logic, workarounds, complex transformations
    - **Remove:** `// Increment counter` above `counter++`, `@param id - The id`, verbose AI docstrings, outdated comments, orphaned TODOs
- **Output:** List files changed and summarize change types, or state "Phase 3: Audited in-code documentation across X files - all accurate, no changes required."

---

## 2. Hard Rules

### Rule 1: Zero-Hallucination Policy (STRICTLY ENFORCED)

**Every statement must be grounded in code you have directly read and verified.**

**Mandatory verification before documenting ANY behavior:**

1. **Locate** the exact file, function, method, or class.
2. **Read** the complete implementation from start to finish.
3. **Trace** execution through all calls, conditionals, and transformations.
4. **Verify** by identifying exact lines that perform the documented action.
5. **Document** only what the code provably does.

**Forbidden shortcuts (ZERO TOLERANCE):**

- **No name-based assumptions:** Never assume `validateUser()` validates users — read the body. `deleteUser()` might just set a flag; `helper()` might perform critical logic.
- **No config-based assumptions:** Don't assume `MAX_RETRIES` controls retries without tracing its usage.
- **No comment-based documentation:** Comments can be stale. Code is truth. If code and comments conflict, the code wins.
- **No structure-based assumptions:** Don't assume `auth/` handles auth or `utils/` has utilities. Read what it implements.
- **No type-based assumptions:** Don't assume `EmailService` sends emails. Read the implementation.
- **No pattern recognition:** Don't document based on "this looks like MVC/factory/etc." Document what the code does.

**The "Prove It" Rule:**

- Before writing ANY statement: "Which exact file, function, and line numbers prove this?"
- If you cannot answer → **DO NOT WRITE IT.**
- ❌ "The system validates user input" (assumption)
- ✅ After reading `src/validation.ts:45-67` → "User input is validated against a schema defined in [`validation.ts`](../src/validation.ts)"

**If you cannot verify:** Do NOT document, do NOT write TODOs, do NOT guess, do NOT write "appears to" / "seems to" / "likely" / "probably". **Silence is better than speculation.**

**No speculation:** Never document planned features or "intended" behavior. Never write "will," "should," "planned," or "upcoming."

**Cross-reference test:** For complex behaviors, confirm with 2-3 code locations (definition, usage, tests).

### Rule 2: Strict Objectivity

- **Correct falsehoods:** If existing docs say "returns JSON" but code returns XML → fix it.
- **New content:** No subjective adjectives (important, critical, robust, seamless, powerful, elegant, efficient, optimal, etc.). Stick to facts.
- **Existing content:** Preserve existing subjective terms unless factually wrong.
- _Bad (AI):_ "The `auth.ts` middleware is a critical component." → _Good (AI):_ "The `auth.ts` middleware blocks unauthorized requests."

### Rule 3: No Placeholders or TODOs

No empty sections, stubs, or "Add details here" comments. If code doesn't exist, documentation shouldn't either.

### Rule 4: Mermaid Accessibility (ZERO TOLERANCE)

Every Mermaid diagram MUST include both:

1. **`accTitle`** — Specific, descriptive title (not "Diagram" or "Flow" — use labels like "Data Pipeline", "User Authentication Sequence")
2. **`accDescr`** — Meaningful description sufficient for a non-sighted user to understand the diagram alone. No placeholders like "A diagram showing..."

No exceptions. Do not output any diagram missing either field.

---

## 3. Writing Guidelines

### Brevity & Style

- Paragraphs for introductions/complex architecture only. Bullet points for lists/steps. No walls of text.
- **Acronyms:** Full term (ACRONYM) on first use, acronym only after.
- **High-density, low-volume:** No line-by-line code narration. Explain _why_ architecturally and _how_ the system uses it. Zero bloat.

### Configuration References

- Document using **external-facing names** only (env vars, config file keys, CLI flags) — never internal variable names.
- **Trace** from code usage → variable source → external interface (`.env`, `config.yaml`, CLI args, etc.).
- If you cannot trace to an external source, do not document the config.
- Format: "Set `<EXTERNAL_NAME>` in `<LOCATION>` to control `<behavior>`."
- ✅ "Set `DATABASE_URL` in your `.env` file"
- ❌ "The `dbUrl` variable stores the connection" (internal var)

### File Citations & References (STRICTLY ENFORCED)

- **Every technical claim must cite the source file.** No citation → don't write it.
- **Every file reference must be a clickable markdown link.** `[filename](relative/path)` — no bare filenames, no exceptions.
    - ❌ "See server.ts for the implementation"
    - ✅ "See [`server.ts`](../src/server.ts) for the implementation"
- **Markdown links must target files, not directories.** If the visible text refers to a directory, link to a file inside that directory such as `index.md`, `README.md`, or the most relevant existing file.
    - ❌ "[`/design`](../design)"
    - ✅ "[`/design`](../design/index.md)"
- **Inline preferred:** Weave links into prose. Use footer `Implementation:` only when inline is unnatural.
- **No redundant citations:** Don't link the same file twice in adjacent sentences.
- **Non-existent files:** If the file doesn't exist, re-evaluate and remove or correct the statement.
- **Path verification:** Verify the file exists and use correct relative path from the doc file's location.

### Code Snippets

- Do NOT inline full definitions/class bodies. Link to the file instead.
- **Exceptions** (3-10 lines max):
    - Illustrating a specific usage example or how-to (e.g., "here's how to call this API")
    - A critical configuration line
    - Complex logic impossible to explain with text alone

### Formatting

- Relative links always (for GitHub compatibility).
- New directories must have `index.md`.
- Add `## Related Documentation` at file bottom only when genuinely relevant links exist (not for `index.md`/`README.md`).

---

## 4. Architecture & Logic Flows

Include ONLY steps meeting ALL THREE criteria:

1. **User-Visible Impact:** Directly affects end-user experience or external behavior.
2. **State/Data Transformation:** Fundamentally changes data, state, or execution path.
3. **Cannot Be Removed:** Removal would break functionality or change user-observable outcomes.

**Exclude** (unless documenting observability systems): logging, metrics, telemetry, trivial validation, internal utilities, debug code.

**Test:** "Would removing this step change what the user experiences?" If no → exclude.

---

## 5. Mermaid Diagrams

**When to create:** Multi-service interactions, state machines, data pipelines, flows with 5+ steps, user journeys, dependency graphs.

**When NOT to create:** Trivial logic, basic CRUD, redundant repetition of short lists.

**Rules:**

- Valid Mermaid syntax only. No ASCII art, static images, or `style`/color customizations.
- **Must include `accTitle` and `accDescr`** (Hard Rule #4).
- Must reflect actual current code — no hypothetical structures.
- Apply the Architectural Significance Filter from §4.
- Choose the most appropriate type (`flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram`, `journey`, `C4Context`, `mindmap`, `xychart`, `kanban`, `architecture-beta`, `treemap-beta`). Don't default to `flowchart`.

---

## 6. Quality Assurance (Before Finalizing Output)

Act as a strict reviewer of your own work. Make ALL corrections before output.

### Zero-Hallucination Audit (HIGHEST PRIORITY)

For **every statement** you wrote:

- Did I **read the actual implementation file** or assume from names/structure/patterns?
- Can I cite **exact file paths** proving each statement?
- Did I **trace execution paths** or infer from function names?
- Am I describing what code **currently does** (verified) or what I think it **should do** (assumption)?
- Did I use "appears to," "seems to," "likely," "probably," "should," "will"? → **Remove or verify.**

**Any unverified statement → delete immediately. No exceptions.**

### Content & Style Checks

- Pre-existing content modified only for factual errors? Accurate content preserved?
- All file references are clickable links that resolve to files, not directories? (fix or delete — ZERO TOLERANCE)
- Config docs use external-facing names only? (trace to source or delete)
- No new subjective adjectives? (preserve existing ones)
- No code dumps? (replace with links)
- Architectural flows include only significant steps? (no observability unless documenting observability)
- Mermaid diagrams have `accTitle` and `accDescr`?
- Phase 3 was executed and results reported?

**Make ALL corrections before outputting. No exceptions.**
