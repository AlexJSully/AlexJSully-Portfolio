# Prompts Directory

This directory contains AI-powered prompt templates designed for **GitHub Copilot's coding agent** to automate code review, documentation auditing, and quality improvements. These prompts integrate seamlessly with Visual Studio Code (VSCode) and GitHub's pull request workflow.

> [!CAUTION]
> ⚠️ CRITICAL: AI Accuracy Warning
>
> **These prompts execute AI-driven code analysis and documentation generation. AI makes mistakes and hallucinations.** It is of utmost importance that you **carefully review all changes and output** before merging any PR. Do not blindly trust the AI's work. Verify that all suggested changes are:
>
> - Factually accurate against your codebase
> - Aligned with your project standards
> - Free of hallucinated function names, file paths, or logic
> - Properly formatted and complete
> - Well tested and validated
>
> **Review everything the AI writes and generates.**

---

## Available Prompts

### [`audit-docs.prompt.md`](./audit-docs.prompt.md)

**Purpose:** Automatically audit and update your documentation directory to match the current codebase and any PR changes.

**Key Features:**

- **Phase 1 (PR Sync):** If a PR is active, updates documentation to reflect only the immediate changes introduced by that PR
- **Phase 2 (General Audit):** Audits the entire documentation directory against the current codebase to find and fix:
    - Outdated information
    - Inaccuracies
    - Fragmented or redundant files
    - Missing documentation for new features

**When to Use:**

- After implementing new features (documentation lags behind code)
- Before merging a PR (ensure docs match the PR changes)
- During maintenance cycles (keep docs fresh and accurate)
- When refactoring or restructuring code

**Configuration:**
The `targets` field specifies which directories the AI will audit. In a monorepo or complex project, update the targets to match your documentation structure:

```yaml
targets:
    -  #file:docs              # Primary docs directory (if root-level docs and not tied to a source directory)
    -  #file:src #file:docs    # For monorepos where docs are alongside source directory (src = source directory, update to your structure)
```

**Platform Support:**

- Works in GitHub's text view for documentation reading
- Works natively in VSCode's documentation explorer
- **(Recommended Enhancement):** Use the **[Workspace Wiki](https://marketplace.visualstudio.com/items?itemName=alexjsully.workspace-wiki)** VSCode extension to organize all your Markdown files into a unified file tree explorer within VSCode. This makes navigating and maintaining documentation effortless.

---

### [`audit-pr.prompt.md`](./audit-pr.prompt.md)

**Purpose:** Perform a thorough, opinionated code review of a pull request across 13 comprehensive categories. Acts as a Principal Code Reviewer to identify issues, suggest fixes, and provide actionable feedback ready for human review and posting.

**Key Features:**

- **3-Step Review Process:**
    - Step 1: PR Alignment Check (verify PR title, description, linked ticket, diff scope, breaking changes, and PR size)
    - Step 2: Categorized Code Review (13 review categories covering correctness, security, privacy, performance, testing, and more)
    - Step 3: Overall Summary (structured verdict with stats, top concerns, and positive callouts)
- **13 Review Categories:**
    1. Correctness & Logic
    2. Security & Vulnerability
    3. Privacy & Data Protection
    4. Error Handling & Resilience
    5. Code Quality & Cleanliness
    6. Architecture & Design
    7. Testing
    8. Performance & Efficiency
    9. Documentation & Comments
    10. Standards & Style Consistency
    11. Accessibility (UI changes only)
    12. Concurrency & Thread Safety
    13. Regulatory & Compliance
- **Severity Triage:** Marks findings as 🔴 Blocking, 🟡 Non-blocking, 🔵 Suggestions, or ✅ Positive callouts
- **Specific, Actionable Feedback:** Every finding includes file path, line range, issue description, and suggested fix (where applicable)

**When to Use:**

- During pull request reviews (before merge)
- As a second opinion on code changes
- To ensure comprehensive coverage of security, privacy, and performance concerns
- When you need detailed, ready-to-post review comments

**Assumptions:**

- Active GitHub pull request with `#activePullRequest` and `#changes` accessible
- No external tools required (GitHub/Jira tools are optional and noted as conditional)

---

### [`audit-quality.prompt.md`](./audit-quality.prompt.md)

**Purpose:** Perform a deep-dive audit of your codebase to identify architectural flaws, technical debt, and maintainability issues—then automatically implement improvements.

**Key Features:**

- **Breadth-First Audit:** Analyzes code architecture, design patterns, code health, security, and standards
- **Test-Driven Implementation:** Applies refactors using a TDD (Test-Driven Development) approach
- **Automatic Validation:** Runs your project's validation command to ensure changes work
- **Documentation Sync:** Updates documentation to reflect code changes (Step n-1 before final validation)

**What It Analyzes:**

- Architecture & design patterns (coupling, modularity, over-engineering)
- Code health (correctness, clarity, cyclomatic complexity, dead code, DRY violations)
- Robustness & error handling (resilience, idempotency, swallowed errors)
- Security & privacy concerns
- Standards & style adherence
- Accessibility (for UI code)
- Test quality and coverage

**When to Use:**

- During code review cycles (before PR merge)
- As part of regular maintenance sprints
- When tackling technical debt
- Before major releases (ensure code quality baseline)

**Assumptions:**

- Your project has a test suite (Jest, Cypress, etc.)
- You have a validation script defined (e.g., `npm run validate`)
- You follow a specific style guide (defaults to Google Style Guide)

---

## Prerequisites

### Required

- Active GitHub pull request (PR)
- VSCode with [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=github.copilot-chat) extension
- Your project's dependencies installed locally

### Recommended (But Not Required)

- **[`copilot-instructions.md`](../copilot-instructions.md):** Project-specific AI instructions (style guide, conventions, tooling). Helps the AI understand your project standards.

---

## Important Safety Notes

> [!CAUTION]
> ⚠️ AI Makes Mistakes
>
> - **Hallucinations:** AI may invent function names, file paths, or code logic that don't exist
> - **Inaccuracies:** AI may misinterpret complex code or miss edge cases
> - **Formatting Issues:** Generated documentation or code may have subtle formatting problems
>
> **Your Responsibility:**
>
> - Always review the AI's changes before committing
> - Check that code logic matches your intent
> - Test the changes locally (ex [package.json](../../package.json)'s `npm run validate`)
> - Run the full test suite to catch regressions
> - Use git diff to review exactly what changed
>
> **Do not blindly merge AI-generated changes.**

---

## Related Resources

- [VSCode GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=github.copilot-chat)
- **[Workspace Wiki](https://marketplace.visualstudio.com/items?itemName=alexjsully.workspace-wiki)** — Organize and navigate Markdown documentation in VSCode
