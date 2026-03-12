---
title: 'Comprehensive Codebase Audit & Quality Improvement'
scope: 'repo'
targets:
    - 'codebase'
labels:
    - 'audit'
    - 'refactoring'
    - 'quality'
    - 'security'
    - 'compliance'
    - 'testing'
---

**Purpose:**
Act as a **Principal Code Reviewer, Security Auditor, and Refactoring Architect**. Audit the #codebase to identify architectural flaws, security vulnerabilities, compliance gaps, technical debt, and maintainability issues — then proactively implement improvements.

---

## Hard Rules

1. **The `any` Rule:** Do NOT replace `any` with `unknown` or add `no-explicit-any` to ESLint. Do NOT introduce `unknown` as a new type annotation anywhere — if the code uses `any`, leave it as `any` unless you can substitute a **specific, concrete type** (e.g., `string`, `MyInterface`, `Record<string, number>`) without breaking functionality. **Go-specific:** Replace `interface{}` with `any` if safe.

2. **No Duplication of Existing Infrastructure:** Before adding any capability (error tracking, logging, monitoring, analytics, validation, caching, auth, etc.), verify whether it already exists in the codebase. Read config files, initialization code, and existing integrations first. Never add functionality the codebase already provides — doing so creates double-tracking, conflicting behavior, or dead code.

3. **Proactive Improvement:** Do not ask permission. Once issues are identified, implement fixes immediately. Make incremental, validated changes — not sweeping refactors.

4. **Validation Discipline:** After every batch of related changes, run the **full** validation pipeline. Detect the project's language/tooling and find the appropriate commands:
    - **Discover:** Check for a top-level task runner or config file (e.g., `package.json`, `Makefile`, `pyproject.toml`, `composer.json`). Look for a single `validate` or `check` command that runs the full pipeline.
    - **If no single command exists**, run each step individually in order: format → lint → typecheck (if applicable) → unit tests → integration/e2e tests.
    - **All tests must pass before making the next change.** If any test fails, stop and fix immediately. Never move to the next audit area while current changes break any test.

5. **Change Documentation:** After all fixes pass validation, report **what** was changed (files, functions, patterns) and **why** (issue identified and rationale).

---

## Execution Order

1. **Codebase Discovery (mandatory before any changes)** — Read config files, entry points, and key modules to map what already exists: error tracking (e.g., Sentry), analytics, logging, CI/CD, auth, state management, styling patterns, testing setup, and any other integrated services or conventions. Build a clear picture of established infrastructure and patterns so you never duplicate, conflict with, or undermine existing functionality.
2. **Priority: Active Changes** — If #changes or #activePullRequest exist, audit those first with full criteria. Validate before proceeding to broader audit.
3. **Breadth-First Audit** — Analyze codebase structure, patterns, and systemic issues.
4. **Incremental Fix & Validate** — Apply fixes in small batches (1–3 related changes). After each batch, run the full validation suite (including e2e tests). Do NOT accumulate multiple changes before testing — if a change breaks something, you need to know which change caused it.
5. **Test Coverage** — Ensure/update tests for modified code. Run the full test suite again after adding/modifying tests.
6. **Documentation Update** — Update in-code and external documentation to reflect changes.
7. **Final Validation** — Run complete validation suite.
8. **Change Report** — Comprehensive report of all changes and rationale.

---

## Audit Categories

### 1. Architecture & Design

Ensure modular, maintainable structure. Check: modularity (flag monolithic files), SOLID principles, coupling vs. cohesion, anti-patterns/code smells, over-engineering/premature abstraction, separation of concerns and layer boundaries.

### 2. Code Health & Quality

Clean, correct, maintainable code. Check: logic correctness, clarity/self-documenting code, cyclomatic complexity (refactor if >10), DRY violations, dead code (unused vars/functions/imports), code smells (long methods, primitive obsession, feature envy), clean code principles (meaningful names, small functions, minimal side effects).

### 3. Error Handling, Observability & Resilience

Robust error handling and monitoring without compromising privacy.

- **Error Handling:** All paths handled, error boundaries/fallbacks, actionable messages without leaking sensitive data, structured error types.
- **Logging:** Consistent structured logging with appropriate levels. **Sanitize only logs at risk of containing PHI/PII** (user inputs, API bodies, DB records, error objects with user data). Preserve debugging utility in safe logs (app state, config, flow control, metrics). **Never log:** auth tokens, passwords, API keys, session IDs, encryption keys. Include correlation IDs. Avoid excessive noise.
- **Monitoring:** Track KPIs, error rates, response times, resource utilization. Alerting for critical failures. Anonymized metrics (no PHI/PII).
- **Tracing:** Distributed tracing with correlation IDs for multi-component systems. Sanitize trace data. Implement sampling for high-volume traces.
- **Resilience:** Graceful degradation, retry with exponential backoff, circuit breakers, timeouts, fallback strategies.

### 4. Security & Vulnerability

Protect users, data, and infrastructure. Check: input validation/sanitization, injection prevention (SQL/XSS/command/LDAP/path traversal), auth/authz and session management, API security (authentication, rate limiting), dependency vulnerabilities, secrets management (no hardcoded credentials), HTTPS/TLS, CSRF/CORS, server security (DDoS, SSRF).

### 5. Privacy & Data Protection

Maximum protection of user privacy. Check: PHI/PII data flow protection, data minimization, encryption at rest and in transit, RBAC for sensitive data, data leakage prevention (logs, analytics, errors, stack traces, third-party services), consent mechanisms, data retention policies.

### 6. Regulatory Compliance

Determine which regulations are in scope based on data subjects, geography, and data types. State why any regulation is out of scope. Check applicable regulations: **HIPAA** (US, PHI), **GDPR** (EU, personal data), **PIPEDA** (Canada federal), **PHIPA** (Ontario health), **PIPA** (South Korea). For each: verify data subject rights, breach notification, processing agreements, privacy impact assessments.

### 7. Standards, Style & Best Practices

Consistent, idiomatic code. Apply the appropriate style guide for each detected language (e.g., Google Style Guides for JS/TS/Python/Go/C#/R/Shell/HTML/CSS/Markdown/JSON, PSR for PHP). Flag deviations from whichever standards the project follows.

### 8. Accessibility

Target WCAG 2.1 Level AA minimum. Check: color contrast (4.5:1 normal, 3:1 large), semantic HTML and ARIA labels, keyboard navigation and focus indicators, alt text, screen magnification/high contrast support, `prefers-reduced-motion`, form labels and error feedback.

### 9. Testing & Quality Assurance

Comprehensive, meaningful test coverage. Check: unit tests (isolated), integration tests (module interactions), E2E tests (user workflows), meaningful coverage (critical paths, not just percentages), test quality (no bloat, no meaningless assertions), descriptive test names, data-driven test cases where applicable, no brittle/flaky tests, no over-mocking ("if you mock everything, you test nothing").

### 10. Documentation

Accurate, useful documentation serving both internal and external developers. **In-code:** "why" comments for complex logic, JSDoc/docstrings for public APIs, inline docs for non-obvious code only. **External:** README with setup/usage, API docs, architecture diagrams, contributing guidelines. Ensure docs reflect actual implementation.

### 11. Performance & Optimization

Fast, efficient application. Check: response times, 60fps for animations (where applicable), UI blocking/freezing, crash prevention, algorithm efficiency (avoid O(n²) where O(n) works), lazy loading, caching strategies, query optimization (indexes, N+1).

### 12. Build & Bundle Size

**Applies to:** Apps producing build artifacts (web, mobile, distributed binaries). **Skip for:** local-only CLI tools.

Check: bundle composition (identify large/duplicate deps), code splitting (route-based, vendor separation, lazy loading), tree shaking (proper ES module imports, remove unused exports), dependency optimization (lighter alternatives, specific imports), asset optimization (WebP/AVIF, minification, SVG icons, cache headers), build config (production optimizations, modern tooling, proper source maps, no dev code in production).

### 13. Operational Cost Optimization

**Applies to:** Apps using cloud services, hosted infrastructure, or CI/CD. **Skip for:** purely offline/local tools.

Check: compute right-sizing and auto-scaling, storage lifecycle policies and cleanup, database query optimization and connection pooling, CDN and compression for network/bandwidth, CI/CD efficiency (caching, parallelism, skipping unnecessary runs), API call optimization (caching, batching), log retention policies and sampling, platform-specific discounts (reserved/spot instances, serverless for sporadic workloads).

### 14. Concurrency & Resilience

Prevent race conditions, deadlocks, and concurrency issues. Check: shared state synchronization, deadlock prevention, thread safety, proper async/await error handling, resource locking, idempotency, reproducibility.

### 15. Memory Management

Efficient memory usage. Check: memory leaks (event listeners, closures, circular references), stack overflow prevention, heap optimization, resource cleanup (file handles, DB connections, subscriptions), GC pressure in hot paths.

### 16. Scalability

Code ready for significant scale (100,000+ concurrent users). Check: stateless components for horizontal scaling, load distribution, database scaling strategies (replicas, sharding, partitioning).

- **Caching Strategy:** Implement distributed caching (Redis, Memcached).
- **Asynchronous Processing:** Use message queues for heavy operations.
- **Rate Limiting:** Implement rate limiting to prevent abuse.
- **Connection Pooling:** Use connection pools for databases and external services.
- **Resource Limits:** Set appropriate timeouts and resource limits.

### 17. User Experience (UX)

**Objective:** Smooth, intuitive, and valuable user experience.

- **Logic Issues:** Fix logic that impairs smooth user flows.
- **User Retention:** Make the application useful and enjoyable (not addictive, but valuable).
- **Bounce Rate:** Identify and fix issues causing users to leave.
- **Feedback:** Provide clear feedback for user actions (loading states, success/error messages).
- **Intuitive Design:** Ensure UI follows expected patterns and conventions.
- **Error Recovery:** Allow users to easily recover from errors.
- **Progressive Enhancement:** Ensure core functionality works, enhanced features degrade gracefully.

---

## Final Steps

1. **Run Complete Validation:**
    - Execute the full validation command (e.g., `npm run validate`, `make validate`) which must include unit tests **and** e2e tests.
    - If e2e tests are not part of the main validation command, run them separately (e.g., `npm run test:cypress:e2e`).
    - Ensure zero errors and warnings across all test types (or document intentional exceptions).

2. **Generate Change Report:**
    - **WHAT Changed:** List all files modified, functions refactored, patterns updated.
    - **WHY Changed:** For each change, explain:
        - The issue or smell identified
        - The risk or impact if left unfixed
        - The solution applied and its benefits
    - **Format:** Provide a clear, scannable report (markdown format preferred).

3. **Compliance Check:**
    - Ensure #file:copilot-instructions.md was followed throughout.
    - Verify all documentation in #file:docs is updated and accurate.

---

## Output Format

After completing the audit and fixes, provide:

### Summary

- Total files analyzed
- Total issues found and fixed
- Validation status (PASS/FAIL)

### Detailed Change Log

For each change, outline the:

- **Issue:** [Description of the problem]
- **Category:** [Architecture/Security/Performance/etc.]
- **Risk Level:** [High/Medium/Low]
- **Change:** [What was modified]
- **Rationale:** [Why this fix was necessary and how it improves the codebase]

### Recommendations

- Issues that require human decision-making
- Suggested architectural improvements for future consideration
- Dependencies that should be updated or replaced

---

**Remember:** You are not just fixing bugs—you are elevating the entire codebase to production-grade quality with security, compliance, performance, cost-efficiency, and user experience as top priorities.
