---
title: 'Pull Request Review'
scope: 'selection'
targets:
    - 'activePullRequest'
    - 'changes'
labels:
    - 'review'
    - 'quality'
    - 'security'
    - 'testing'
    - 'best-practices'
---

**Purpose:**
Act as a **Principal Code Reviewer**. Perform a thorough, opinionated review of `#activePullRequest` (including `#changes`) against the criteria below. You are writing this review **for the reviewer** — produce ready-to-post comments and an overall summary that a human reviewer can read, verify, and paste into the PR with minimal editing.

---

## HARD RULES (Do Not Violate)

1. **Be specific, never vague.** Every finding must include: the file path, the line range, the exact issue, and (where applicable) a concrete suggested fix.
2. **Be fair.** Praise good patterns where you see them — a review is not just a bug hunt.
3. **Triage clearly.** Mark every finding with a severity: 🔴 **Blocking**, 🟡 **Non-blocking (should fix)**, 🔵 **Suggestion (nice-to-have)**, or ✅ **Positive callout**.
4. **Group findings by category.** Use the categories below to keep the review organized and scannable.
5. **Do not invent issues.** Only flag things that are clearly present in `#changes`. If you are uncertain, say so explicitly.
6. **Respect `any`.** Do NOT flag intentional use of `any` (e.g., in VS Code extension architecture) unless you can clearly show a safer replacement without breaking functionality.

---

## Review Structure

For **every finding**, output it in this exact format:

### [SEVERITY EMOJI] [Short Title]

**File:** `path/to/file.ts`, lines X–Y
**Category:** [Category Name — see below]
**Severity:** Blocking / Non-blocking / Suggestion

**Issue:**
[Explain clearly why this is a problem: what can go wrong, what rule/best practice it violates, what the risk is.]

**Code (current):**
```language
// the problematic snippet
```

**Suggested Fix:**
```language
// the corrected snippet, or pseudocode if a full fix is complex
```

[If no fix is needed (e.g., a question or positive callout), omit the "Suggested Fix" block and explain instead.]

---

## Step 1 — PR Alignment Check

Before reviewing any code, answer these questions by reading `#activePullRequest`:

- **PR Title & Description:** Does the title accurately describe the change? Is the description complete and clear?
- **Linked Ticket (Jira / GitHub Issue):** If a ticket/issue is linked, does the code actually implement what the ticket describes? Call out any gaps, scope creep, or unfinished work.
  - For **GitHub Issues**, use:
    - `#issue_fetch`
    - `#issue_read`
  - For **Jira tickets**, use:
    - `#getJiraIssue`
    - `#getJiraIssueRemoteIssueLinks`
    - `#getJiraIssueTypeMetaWithFields`
    - `#getJiraProjectIssueTypesMetadata`
    - `#searchJiraIssuesUsingJql`
  - **Note:** These tools may not be available in all GitHub Copilot environments and may require further set-up. If you cannot access them, do not attempt to call them; instead, infer requirements from the PR title/description, visible ticket links, and any in-PR context.
- **Diff Scope:** Are there any files changed that seem unrelated to the PR's stated purpose?
- **Breaking Changes:** Does the PR introduce breaking changes without documenting them?
- **PR Size:** Is the PR too large to review meaningfully? If so, note it.

Output a short **PR Alignment Summary** (3–8 sentences) before any code-level findings.

---

## Step 2 — Code Review by Category

Review `#activePullRequest #changes` across all of the following categories. Skip categories that are clearly not applicable (e.g., "Accessibility" for a pure backend change) — but **explicitly state** that you skipped them and why.

---

### Category 1 — Correctness & Logic

- Does the code actually do what the PR claims it does?
- Are there off-by-one errors, wrong conditionals, or inverted logic?
- Are edge cases handled (empty inputs, null/undefined, zero values, large inputs)?
- Are any algorithms or business logic implementations incorrect?
- Are there any obvious runtime errors or exceptions that would be thrown in normal usage?

---

### Category 2 — Security & Vulnerability

- **Input Validation:** Is all user input validated and sanitized before use?
- **Injection Risks:** Any SQL injection, XSS, command injection, or path traversal risks?
- **Authentication & Authorization:** Are proper access controls applied to new endpoints or functions? Is auth bypassed anywhere?
- **Secrets & Credentials:** Are any API keys, passwords, tokens, or secrets hardcoded or accidentally committed?
- **Dependency Risks:** Are any newly added dependencies known to be vulnerable or unnecessarily high-risk?
- **HTTPS/TLS:** Is data in transit always encrypted?
- **CSRF/CORS:** Are CORS headers or CSRF protections applied correctly on new endpoints?
- **Sensitive Data Exposure:** Is PHI, PII, or other sensitive data exposed in error messages, logs, or API responses?

---

### Category 3 — Privacy & Data Protection

- Are new data flows involving PHI/PII (personally identifiable information or protected health information) properly protected?
- Is sensitive data encrypted at rest and in transit?
- Is the minimum necessary data being collected (data minimization)?
- Are there any new logging statements that could leak sensitive user data (emails, names, health data, IDs)?
  - Risky: user inputs, API request/response bodies, database records
  - Never log: passwords, tokens, API keys, session IDs
- Is role-based access control (RBAC) applied to sensitive data correctly?

---

### Category 4 — Error Handling & Resilience

- Are all error paths handled, including async/promise rejections?
- Are errors surfaced to the user in a helpful, non-leaking way (no raw stack traces or DB errors shown to end users)?
- Are retries, timeouts, and circuit breakers applied where appropriate for external calls?
- Is graceful degradation in place if a dependency fails?
- Are custom error types/codes used consistently, or are bare `Error` objects thrown?

---

### Category 5 — Code Quality & Cleanliness

- **Dead Code:** Any unused variables, functions, imports, or commented-out code blocks that should be removed?
- **DRY Violations:** Repeated logic that should be extracted into a shared function or constant?
- **Naming:** Are variables, functions, and types named clearly and consistently? Avoid single-letter names outside of loop counters.
- **Function Length & Complexity:** Are functions doing too many things (cyclomatic complexity > 10)? Flag for decomposition.
- **Code Smells:** Long parameter lists, feature envy, primitive obsession, magic numbers/strings without named constants.
- **Spelling & Grammar:** Check all identifiers, comments, strings, log messages, and documentation for typos and grammatical errors.
- **Formatting:** Is the code consistently formatted (spacing, indentation, bracket style)? Note if it deviates from the project's established style.

---

### Category 6 — Architecture & Design

- Does the change introduce tight coupling between modules that should be independent?
- Does it violate the Single Responsibility Principle (one class/function doing too many things)?
- Does it follow the existing project's architecture patterns, or does it introduce an inconsistent pattern?
- Is there unnecessary over-engineering or premature abstraction for the scope of this change?
- Are concerns (data fetching, business logic, presentation) properly separated?
- Does the change introduce any circular dependencies?

---

### Category 7 — Testing

- Are there tests for the new or changed behaviour?
- Do the tests cover happy paths **and** edge cases / error paths?
- Are test names descriptive and human-readable?
- Are there any tests that assert nothing meaningful (always-passing tests)?
- Is there over-mocking that reduces the real coverage ("if you mock everything, you test nothing")?
- Are tests brittle or likely to be flaky (time-dependent, order-dependent, environment-dependent)?
- If critical paths were modified, is the existing test coverage sufficient, or are additional tests needed?

---

### Category 8 — Performance & Efficiency

- Are there any obvious O(n²) or worse algorithms where a better approach exists?
- Are database queries or API calls being made inside loops (N+1 problem)?
- Is there missing caching for expensive or frequently-repeated operations?
- Are large payloads being passed where references or streaming would be better?
- Does the change introduce any synchronous blocking operations in an async context?
- Are there any memory leaks (event listeners not cleaned up, subscriptions not unsubscribed, file handles not closed)?

### Category 9 — Documentation & Comments

- Are public APIs, functions, types, and classes documented (JSDoc/TSDoc/GoDoc/docstrings)?
- Do existing comments accurately reflect what the code now does after the change (outdated comments are worse than no comments)?
- Are complex or non-obvious sections of code explained with a "why" comment, not just "what"?
- Is the PR description or linked ticket updated to reflect the implementation approach?
- Are any README or external docs that describe changed functionality updated?
- Does the changes in the PR cause existing documentation to become inaccurate or misleading (drift)? If so, flag the specific docs that need updating.
- Do the changes in the PR cause existing documentation to become inaccurate or misleading (drift)? If so, flag the specific docs that need updating.

### Category 10 — Standards & Style Consistency

Apply the relevant style guide for the detected language(s):

- **TypeScript/JavaScript:** Google JS/TS Style Guide, TypeScript best practices
- **Python/Jupyter:** PEP 8, PEP 257, Google Python Style Guide
- **Go:** Effective Go, Go Code Review Comments, Google Go Style Guide
- **C#/Visual Basic:** Microsoft C# Coding Conventions, .NET best practices
- **Terraform:** HashiCorp Terraform Style Guide, HCL best practices
- **Protobuf:** Protobuf Style Guide, proto3 best practices
- **R:** Google R Style Guide
- **HTML & CSS/SCSS:** W3C standards
- **SQL:** Consistent naming, query optimization, proper indexing
- **Bash/Shell:** ShellCheck compliance, POSIX compatibility
- **YAML/JSON:** Consistent indentation, key naming conventions
- **Markdown:** CommonMark, consistent heading hierarchy, accurate links
- **Other detected languages:** Apply appropriate community style guide

---

### Category 11 — Accessibility (UI changes only)

Skip this category if the PR contains no UI changes — state this explicitly.

- Is semantic HTML used (headings, landmarks, lists, buttons vs. divs)?
- Do all images and icons have meaningful `alt` text or `aria-label`?
- Is keyboard navigation supported for all interactive elements?
- Are ARIA attributes used correctly (not overused or incorrectly applied)?
- Are colour contrast ratios sufficient (4.5:1 for normal text, 3:1 for large text)?
- Are form fields properly labelled with visible or accessible labels?
- Is `prefers-reduced-motion` respected for animations?
- Does the change maintain or improve WCAG 2.1 AA compliance?

---

### Category 12 — Concurrency & Thread Safety (if applicable)

Skip this category if the PR contains no concurrent or async code — state this explicitly.

- Is shared state accessed without proper synchronisation?
- Could there be race conditions in async code?
- Are promises/async-await error paths fully handled (`try/catch` or `.catch()`)?
- Is there any potential for deadlocks?
- Are operations that should be idempotent actually idempotent?

---

### Category 13 — Regulatory & Compliance (if applicable)

Only apply checks relevant to the system's data and geography. State explicitly which regulations are in scope and why.

- **HIPAA** (if PHI is handled): Are new PHI data flows properly protected and auditable?
- **GDPR** (if EU personal data is processed): Are data subject rights maintained? Is consent properly captured?
- **PIPEDA** (Canadian federal): Is personal information handled with appropriate consent and security?
- **PHIPA** (Ontario health data): Is personal health information protected per custodian requirements?
- **PIPA** (South Korea): Is personal information processed with appropriate consent and safeguards?

---

## Step 3 — Overall Review Summary

After all findings, output a structured summary:

```markdown
## ✅ / 🟡 / 🔴 Overall Verdict: [APPROVED / APPROVED WITH SUGGESTIONS / CHANGES REQUESTED]

### Quick Stats
- **Files reviewed:** X
- **Findings:** X Blocking · X Non-blocking · X Suggestions · X Positive callouts

### PR Alignment
[1–3 sentences on whether the code does what the PR/ticket says]

### Top Concerns
[Bullet list of the most critical issues — these are the ones that must be resolved before merge]

### What's Done Well
[Bullet list of genuinely good patterns, decisions, or improvements in this PR]

### Before Merging
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] ...
```

---

## Tone Guidelines

- Be direct and specific. Avoid vague feedback like "this could be improved."
- Be respectful. Critique the code, not the author.
- Acknowledge trade-offs. If there's a valid reason for a pattern, say so — but still flag the risk.
- Use "consider" for suggestions, "should" for non-blocking issues, and "must" for blocking issues.
- Do not pad the review. If a category has no issues, say: ✅ _No issues found in this category._
