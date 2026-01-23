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

Act as a **Strictly Factual Technical Writer and Auditor**. Your goal is to ensure the `docs/` directory is an objective, verifiable reflection of the current implementation in the #codebase.

**Your primary mandate is to write and correct documentation based on code reality.** Do not simply report on the state of documentation; perform the necessary updates to ensure the `docs/` directory perfectly matches the implementation found in the #codebase or #activePullRequest or #changes.

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
    - **Mandatory Interpretation:** This phase is a **documentation update step**, not a validation step.
    - **Action (Required):**
        - Treat the PR diff as the **source of truth**.
        - Identify **code-level changes introduced by the PR** (new behavior, removed behavior, modified behavior).
        - **Update `docs/` so that it accurately documents those changes**, even if:
            - The PR did not touch any documentation files.
            - Documentation already exists but is now incomplete or outdated.
        - Do **NOT** conclude Phase 1 is complete simply because docs were untouched.
    - **Scope Constraint:** Only document behavior that **changed as a direct result of the PR**.
    - **Next:** Proceed immediately to Phase 2.

2.  **Phase 2: General Audit (Mandatory)**
    - **Action:** Audit the entire `docs/` directory against the current #codebase.
    - **Task:**
        - **Mandatory Correction (Pre-existing Content):** If existing text describes behavior that contradicts the code, you **MUST** correct it to match the current implementation. **Preservation Rule:** Only modify pre-existing content when it is factually incorrect. Preserve the original phrasing, style, and structure when accurate.
        - **Deletion Policy (Pre-existing Content):** Delete pre-existing content **ONLY** if:
            - It is massively duplicated (e.g., 1000+ lines of identical content).
            - It describes features/components that no longer exist in the codebase.
            - It cannot be corrected to accuracy (fundamentally describes wrong system).
            - **Default Action:** When in doubt, correct rather than delete.
        - **Your Generated Content:** You may freely edit or remove content you generate during this task if it contains errors, hallucinations, or does not meet quality standards.
        - Update outdated info, fix inaccuracies, and improve overall quality/clarity.
        - Consolidate fragmented files to reduce noise.
        - **Create New Files & Directories (Strategic Expansion):**
            - **Step 1: Check Existing Structure.** Before creating anything, scan `docs/`. If a logical home exists, place the file there.
            - **Step 2: Apply Diátaxis Framework.** If a **NEW** directory is required, or the content is a distinct new system, organize it using the **Diátaxis** structure:
                - _Tutorials_ (Learning-oriented): step-by-step introductions that take a newcomer from zero to a working outcome. Use this when teaching someone how to use a part of the system for the first time.
                - _How-To Guides_ (Problem-oriented): focused recipes that solve a specific, real-world task. Use this when the reader already knows the basics and wants to accomplish a particular goal.
                - _Reference_ (Information-oriented): factual, exhaustive descriptions of APIs, components, configuration options, and behaviors. Use this when documenting "what exists" and its exact inputs/outputs.
                - _Explanation_ (Understanding-oriented): background, rationale, and architectural overviews. Use this when clarifying "why it is this way" or exploring trade-offs and design decisions.
            - **Scope:** Create new artifacts for:
                - **New Components:** Systems, designs, modules or architecture that do not fit into existing files.
                - **External APIs:** Dedicated usage guides for external consumers.
                - **Missing Structures:** Standard directories needed for organization.
    - **Next:** Proceed to Phase 3 **ONLY** if Phase 1 and Phase 2 resulted in **ZERO** updates.

3.  **Phase 3: Fallback Cleanup (Conditional)**
    - **Trigger:** You have confirmed that `docs/` is already 100% accurate and required no updates in Phase 1 or 2.
    - **Action:** Check root Markdown files (e.g., `README.md`) or in-code documentation.
    - **Task:** Fix only if misleading or factually incorrect. Apply same preservation and deletion policies as Phase 2.

---

## 2. Hard Rules (Do Not Violate)

1.  **Zero-Hallucination Policy (STRICTLY ENFORCED)**
    - **Verification Protocol:** Every single statement must be grounded in a specific line of the #codebase that you have **directly read and verified**.
    - **The Implementation Check (MANDATORY - NO EXCEPTIONS):** Before documenting any behavior:
        1. **Locate:** Find the exact file and function/method/class.
        2. **Read:** Open and read the **complete implementation logic** from start to finish.
        3. **Trace:** Follow the execution path through all function calls, conditionals, and data transformations.
        4. **Verify:** Confirm the behavior by identifying the exact lines that perform the documented action.
        5. **Document:** Only then write what the code **actually, provably does**.
    - **Forbidden Shortcuts (ZERO TOLERANCE):**
        - **No "Name-Based" Assumptions:** Never assume `validateUser()` validates users, `sendEmail()` sends email, or `processData()` processes data. **Read the function body.** A function named `deleteUser()` might just mark a flag; a function named `helper()` might perform critical business logic.
        - **No "Config-Based" Assumptions:** Do not assume a config variable named `MAX_RETRIES` controls retries unless you trace its usage in the code and see it actually being used in retry logic.
        - **No "Comment-Based" Documentation:** Code comments can be outdated. Document what the code **does**, not what comments **say** it does. If code and comments conflict, the code is truth.
        - **No "Structure-Based" Assumptions:** Do not assume a file `auth/` handles authentication, a folder `utils/` contains utilities, or a file `database.ts` manages databases. Read what it actually implements.
        - **No "Type-Based" Assumptions:** Do not assume a type `EmailService` sends emails or `PaymentProcessor` processes payments. Read the implementation.
        - **No "Pattern Recognition":** Do not assume "this looks like a standard MVC pattern" or "this seems like a factory" and document based on the pattern. Document what the code does.
    - **The "Prove It" Rule (ABSOLUTE):**
        - Before writing ANY statement, ask: "Which exact file, function, and line numbers prove this is true?"
        - If you cannot answer with specific locations, **DO NOT WRITE THE STATEMENT.**
        - **Example of Verification:**
            - ❌ WRONG: "The system validates user input" (Assumption)
            - ✅ RIGHT: After reading `src/validation.ts:45-67` which contains explicit validation logic → "User input is validated against a schema defined in `src/validation.ts`"
    - **If You Cannot Verify:** If you cannot find the implementation, cannot trace the logic, or the code is ambiguous/incomplete:
        - **Do NOT document the feature.**
        - **Do NOT write "TODO" or placeholders.**
        - **Do NOT make educated guesses.**
        - **Do NOT write "appears to" or "seems to" or "likely" or "probably".**
        - **Action:** Simply omit that information. **Silence is better than speculation.**
    - **No Speculation:** Never document planned features, future enhancements, or "intended" behavior that isn't implemented. Never write "will," "should," "planned," or "upcoming."
    - **The Cross-Reference Test:** For complex behaviors, verify your understanding by finding at least 2-3 different places in the code that confirm the behavior (e.g., where it's defined, where it's called, where it's tested).

2.  **Strict Objectivity (The Fact vs. Opinion Protocol)**
    - **The Truth Override (CRITICAL):** If existing human-written documentation is factually incorrect (e.g., claims the system uses TCP when code shows UDP), you **MUST** correct it. Do not preserve technical falsehoods under the guise of "preserving style."
    - **Generation (New Content):** When _you_ write new documentation, do not use subjective adjectives like: _important, critical, robust, seamless, best-in-class, powerful, elegant, efficient, optimal, sophisticated, reliable, performant, scalable, flexible, maintainable._ Stick to verifiable facts.
    - **Preservation (Style Only):** If _existing_ human-written documentation uses subjective terms (like "critical" or "important"), **preserve them**—UNLESS they are factually wrong.
    - **The Line:**
        - _Bad (AI Generated):_ "The `auth.ts` middleware is a critical component." (Opinion).
        - _Good (AI Generated):_ "The `auth.ts` middleware blocks unauthorized requests." (Fact).
        - _Correction Example:_ Existing doc says "Returns JSON." Code returns "XML." → **Change to XML.**

3.  **No Placeholder Text or TODOs**
    - Do not create empty sections or stubs.
    - Do not leave comments like "Add more details here" or "To be documented."
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

- **Configuration Reference Protocol (CRITICAL - STRICTLY ENFORCED):**
    - **Golden Rule:** Document configuration using the **external interface** that users interact with, never internal code variables.
    - **User-Facing Names ONLY:** Always use the actual configuration key names that users set (environment variables, config file keys, CLI flags, Kubernetes ConfigMap keys, deployment.yaml values, etc.).
    - **NEVER Use Internal Variables:** Do **NOT** reference internal code variable names, object properties, or constants that are meaningless to external users.
    - **Universal Tracing Process:**
        1. **Start at Usage:** Find where the config value is used in code (e.g., `const timeout = config.timeout`).
        2. **Trace to Source:** Follow the variable backwards to where it's loaded/initialized.
        3. **Identify External Interface:** Find the external source:
            - Environment variables (`.env`, `process.env.TIMEOUT`)
            - Config files (`config.json`, `config.yaml`, `appsettings.json`)
            - Kubernetes resources (`deployment.yaml`, `configmap.yaml`)
            - CLI arguments (`--timeout`, `-t`)
            - System properties (`-Dtimeout=30`)
        4. **Document External Name:** Use the exact key/flag/variable name from the external interface.
        5. **If Cannot Trace:** If you cannot find the external source, **do not document the configuration option.**
        6. Not every documentation needs config details. Only add if relevant.
    - **Examples Across Different Architectures:**
        - **Environment Variables (.env):**
            - ✅ CORRECT: "Set `DATABASE_URL` in your `.env` file"
            - ❌ WRONG: "The `dbUrl` variable stores the database connection" (internal var)
        - **Config Files (config.json):**
            - ✅ CORRECT: "Configure `server.port` in `config.json`"
            - ❌ WRONG: "The `serverPort` property controls the port" (internal property)
        - **Kubernetes (deployment.yaml):**
            - ✅ CORRECT: "Set `ASYNC_TIMEOUT` in the container's `env` section of `deployment.yaml`"
            - ❌ WRONG: "The `asyncTiO` variable controls timeout" (internal var)
        - **Kubernetes (ConfigMap):**
            - ✅ CORRECT: "Define `max-connections` in the ConfigMap referenced by the deployment"
            - ❌ WRONG: "The `maxConn` variable limits connections" (internal var)
        - **CLI Flags:**
            - ✅ CORRECT: "Use `--max-retries` flag to set retry limit"
            - ❌ WRONG: "The `maxR` variable controls retries" (internal var)
    - **Format for Documentation:**
        - When documenting configuration, use this pattern:
            - "Set `<EXTERNAL_NAME>` in `<LOCATION>` to control `<behavior>`."
            - Example: "Set `MAX_RETRIES` in your `.env` file to control the number of retry attempts."
            - Example: "Configure `timeout` in the `database` section of `config.yaml` to set query timeout."
    - **Multi-Source Configs:** If a config can be set in multiple ways (env var OR config file), document all methods:
        - "Set connection timeout via `TIMEOUT` environment variable or `timeout` in `config.json`."

- **Mandatory File Citations (The "Proof of Work" Rule):**
    - **Strict Requirement:** You are forbidden from describing technical logic without citing the source file.
    - **Placement:** Do not break the reading flow with inline citations. Place links at the very end of the specific section or paragraph.
    - **Format:** `Implementation: [filename](./path/to/file)`
    - **Enforcement:** If you cannot find the file to link, **do not write about that logic.** You may not document code you cannot link to.

- **High-Density, Low-Volume:**
    - Avoid "Wall of Text." Use bullet points and headers to break up density.
    - Do not narrate code line-by-line. Explain _why_ it exists (architecturally) and _how_ the system uses it.
    - **Zero Bloat:** If a sentence does not add strict technical value or learning clarity, do not add it.

---

## 4. Architecture & Logic Flow Documentation

**Goal:** Document meaningful system behavior and user-visible outcomes, not implementation details.

**The "Architectural Significance" Filter:**

When documenting logic flows, data pipelines, or process steps, include **ONLY** steps that meet these criteria:

1. **User-Visible Impact:** The step directly affects the end user's experience or the system's external behavior.
2. **State/Data Transformation:** The step fundamentally changes data, system state, or execution path.
3. **Cannot Be Removed:** Removing this step would break functionality or change user-observable outcomes.

**What to Exclude from Architectural Flows:**

Unless you are explicitly documenting observability/monitoring systems, exclude:

- **Logging & Metrics:** Log statements, metrics collection, telemetry (even if using channels/queues)
- **Trivial Validation:** Simple null checks, type validation
- **Internal Utilities:** Helper functions that don't change observable behavior (formatting, parsing, etc.)
- **Debug Code:** Developer-only debugging features

**Simple Test:** Ask "Would removing this step change what the user experiences or receives?" If no, exclude it.

**Example - Data Processing Flow:**

**CORRECT:**

1. Receive message from queue
2. Fetch data from external API
3. Transform data to target schema
4. Write to database
5. Send response to client

**INCORRECT:**

1. Receive message from queue
2. ~~Log message receipt~~ ← Observability
3. ~~Send metrics to channel~~ ← Observability
4. Fetch data from external API
5. ~~Track API latency~~ ← Observability
6. Transform data to target schema
7. Write to database
8. Send response to client

---

## 5. Mermaid Diagrams (Strategic & Meaningful)

**Goal:** Proactively use **Mermaid** diagrams to visualize complexity. A picture is worth a thousand words.

**The "Complexity Threshold" (When to Create):**
If you are documenting the following categories, a **Mermaid** diagram is **strongly recommended** (but not required for every instance):

- **System Interactions:** Multi-service communication, microservice architectures.
- **State Management:** Complex lifecycles, state machines, or workflow engines.
- **Data Architecture:** Data ingestion pipelines, ETL processes, or event-driven architectures.
- **Logic Depth:** If a process involves more than 5 distinct architectural steps or components interacting, consider a diagram.
- **User Journeys:** Multi-step user workflows or onboarding processes.
- **Dependencies:** Complex module or service dependency graphs.

**When NOT to Create:**

- **Trivial Logic:** Simple function calls, basic CRUD operations, or single-file utility functions.
- **Redundancy:** Do not create diagrams that simply repeat a bulleted list of a few items.
- **Overuse:** Avoid diagrams for every minor detail. Use only when it meaningfully improves understanding.

**Technical Rules:**

- **Format:** All diagrams must be written in valid **Mermaid** syntax. No ASCII art or static images.
- **Accessibility:** Do **NOT** use Mermaid `style` or color customizations. Keep default and clean.
- **Accuracy:** Diagrams must reflect **actual, current code**. No hypothetical structures or planned features.
- **Apply Architectural Filter:** When creating flowcharts or sequence diagrams for processes, **apply the same "Architectural Significance Filter"** from Section 4. Exclude observability steps (logging, metrics, tracing) unless the diagram is explicitly documenting an observability system.
- **Types (Choose Most Appropriate):**
    - `flowchart` - Process flows, decision trees, system flows
    - `sequenceDiagram` - Temporal interactions between components
    - `classDiagram` - Object-oriented structure and relationships
    - `stateDiagram` - State machines and lifecycle management
    - `journey` - User experience and interaction flows
    - `requirementDiagram` - Requirements and their relationships
    - `C4Context` - High-level system context and boundaries
    - `mindmap` - Concept hierarchies and knowledge structures
    - `xychart` - Quantitative data visualization (when data is available in code)
    - `kanban` - Workflow states and task management systems
    - `architecture-beta` - System architecture overviews
    - `treemap-beta` - Hierarchical data visualization
- **Selection Criteria:** Choose the diagram type that **best represents the underlying structure** you're documenting. Do not default to `flowchart` for everything.

---

## 6. Formatting Standards

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

## 7. Self-Correction & Quality Assurance (CRITICAL)

**Before finalizing your output, you must act as a strict Reviewer against your own work.**

**Step 1: Hallucination Audit (ZERO TOLERANCE)**
For **EVERY SINGLE STATEMENT** you wrote, verify:

- _Did I **actually open and read the implementation file** or did I assume based on the name/structure?_
- _Can I cite the **exact file path and line numbers** that prove this statement?_
- _Did I **trace the complete execution path** to confirm behavior, or did I infer from function names?_
- _Is this describing what the code **currently does** (verified) or what I think it **should do** (assumption)?_
- _Did I use words like "appears to," "seems to," "likely," "probably," "should," "will"?_ (If yes → RED FLAG: Remove or verify)

**Action:** For ANY statement you cannot verify with specific code locations, **delete it immediately.** Re-read the implementation if needed.

**Step 2: Architecture & Flow Verification (STRICT FILTER)**
For any documented process or logic flow:

- _Did I apply the "Is This Observability?" test to every step?_
- _Did I include trivial validation or utility calls as major steps?_ (If yes → Remove)
- _Would the **user-observable outcome** change if I removed this step?_ (If no → Remove)
- _Am I documenting the **business logic** or the **implementation details**?_ (Should be business logic)
- _Does this step meet ALL THREE criteria: User-Visible Impact + State/Data Transformation + Cannot Be Removed?_ (If no to any → Remove)

**Action:** Remove ALL non-architectural steps. Every step must pass all three criteria.

**Step 3: Configuration Verification (MANDATORY TRACE)**
For **EVERY** documented configuration option:

- _Did I use the **external-facing name** (env var, config key, CLI flag) or an **internal variable name**?_
- _Did I **actually trace** the config from code back to its external source (env file, config.yaml, deployment.yaml, etc.)?_
- _Can a user **actually find and set** this configuration using the name I documented?_
- _Would this documentation work across different deployment environments (local dev, Docker, Kubernetes)?_

**Action:**

- Replace ALL internal variable names with external configuration names.
- If you cannot trace to external source → Delete the config documentation entirely.
- Verify the documented location matches the actual codebase architecture (e.g., Kubernetes vs .env).

**Step 4: Existing Content Verification**
For any pre-existing content you modified:

- _Is the original content factually wrong, or just styled differently than I would write?_
- _Did I preserve accurate pre-existing content and only correct errors?_
- _Am I deleting pre-existing content unnecessarily?_

**Action:** Restore any unnecessarily modified pre-existing content. Only correct factual errors.

**Step 5: General Quality Check**

- _Did I verify existing text matches the code? If outdated/wrong, did I correct it?_
- _Did I inline a full struct or class definition? (If yes → Replace with link)._
- _Did I insert NEW subjective words? (If yes → Remove them. Preserved existing ones are OK)._
- _Did I cite the file for the logic I explained? (If no → Find file or remove text)._
- _Did I create a Mermaid diagram where appropriate for complex systems?_
- _Did I exclude observability from Mermaid diagrams (unless documenting observability systems)?_
- _Did I choose the most appropriate Mermaid diagram type for the structure?_

**Step 6: Final Action (Before Output)**
If you find any:

- **Hallucinations or unverified statements** → Delete immediately, no exceptions
- **Statements without exact file citations** → Add citation or delete statement
- **Internal config variable names** → Trace to external source and correct, or delete
- **Observability steps in non-observability docs** (logging, metrics, tracing, monitoring) → Delete
- **Trivial validation/utility steps in flows** → Delete
- **Subjective language you added** → Remove (preserve existing)
- **Code dumps** → Replace with links
- **Unnecessary modifications to accurate pre-existing content** → Revert
- **Use of "appears," "seems," "likely," "probably," "should," "will"** → Remove or replace with verified facts

**Make ALL corrections before outputting your final documentation. No exceptions.**

---

## Final Verification Checklist

Before concluding this task, verify:

1.  _Did I **open and read the actual implementation file** for every documented behavior?_
2.  _Can I cite **exact file paths and line numbers** for every statement?_
3.  _Did I determine the PRIMARY PURPOSE of each document (business logic vs observability)?_
4.  _Did I **exclude ALL observability** (logging, metrics, tracing, monitoring) from non-observability documentation?_
5.  _Did I apply the **"Is This Observability?" test** to every questionable step?_
6.  _Did I use **external-facing config names** (env vars, config files, deployment.yaml) instead of internal variables?_
7.  _Did I **trace every config** from code back to its external source?_
8.  _Did I document **only architecturally significant steps** in flows (meeting ALL THREE criteria)?_
9.  _Did I preserve accurate pre-existing content and only correct errors?_
10. _Did I avoid deleting pre-existing content unless absolutely necessary?_
11. _Does this content serve both internal and external devs?_
12. _Did I remove all placeholders, unverified statements, and speculation?_
13. _Did I properly define all acronyms on first use?_
14. _Did I include appropriate Mermaid diagrams for complex systems?_
15. _Did I apply the Architectural Significance Filter to Mermaid diagrams?_
16. _Did I choose the best Mermaid diagram type for each visualization?_
