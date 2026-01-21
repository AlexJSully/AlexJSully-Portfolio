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
Act as a **Principal Code Reviewer, Security Auditor, and Refactoring Architect**. Perform a comprehensive audit of the #codebase to identify architectural flaws, security vulnerabilities, compliance gaps, technical debt, and maintainability issues. Once identified, proactively implement improvements to ensure a high-standard, robust, scalable, secure, and compliant implementation.

---

## HARD RULES (Do Not Violate)

1. **The "Any" Rule:**
    - Acknowledge that `any` is often intentionally required (e.g., VS Code extension architecture).
    - Do **NOT** replace `any` with `unknown`.
    - Do **NOT** add `no-explicit-any` to ESLint configuration.
    - Only replace `any` if:
        - You understand the full context of its usage
        - It can be simply swapped with a specific type without breaking functionality
        - The replacement improves type safety meaningfully
    - **Go-specific:** Replace `interface{}` with `any` if it doesn't break the codebase.

2. **Proactive Improvement:**
    - Do not ask for permission to proceed with fixes.
    - Once issues are identified, immediately implement improvements.
    - Make incremental, validated changes rather than large sweeping refactors.

3. **Validation Discipline:**
    - Frequently run validation commands (check #file:package.json or #file:Makefile for `validate`, `test`, `lint`, `format` commands).
    - If validation fails, fix issues immediately before proceeding.
    - Never proceed to the next audit area if current changes break validation.

4. **Change Documentation:**
    - After ALL fixes are applied and validation passes, provide a comprehensive report of:
        - **WHAT** was changed (specific files, functions, patterns)
        - **WHY** it was changed (the issue identified and rationale for the fix)
    - This enables human review and informed decision-making about keeping or modifying changes.

---

## Execution Order (CRITICAL)

1. **Priority Audit - Active Changes:**
    - **FIRST:** If #changes or #activePullRequest are present, audit those files and changes with highest priority
    - Apply the same comprehensive audit criteria to changed files as you would to the entire codebase
    - Validate that PR/changes don't introduce issues before proceeding to broader audit

2. **Breadth-First Audit:** Analyze codebase structure, patterns, and systemic issues across all files.

3. **Incremental Fix & Validate:** Apply fixes incrementally with frequent validation runs.

4. **Test Coverage:** Ensure or update test coverage for modified code.

5. **Documentation Update:** Update both in-code and external documentation to reflect changes.

6. **Final Validation:** Run complete validation suite to ensure stability.

7. **Change Report:** Generate comprehensive report of all changes and rationale.

---

## Audit Categories & Criteria

### 1. Architecture & Design

**Objective:** Ensure modular, maintainable, and well-designed code structure.

- **Modularity:** Flag monolithic files; enforce small, focused modules with single responsibility.
- **SOLID Principles:** Identify violations of Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Coupling & Cohesion:** Analyze loose coupling vs. tight coupling; ensure high cohesion within modules.
- **Design Patterns:** Identify anti-patterns, code smells, and inappropriate pattern usage.
- **Over-Engineering:** Flag premature abstractions, unnecessary complexity, or over-generalization.
- **Boundaries:** Assess clear separation of concerns, layers, and module boundaries.

### 2. Code Health & Quality

**Objective:** Maintain clean, clear, and maintainable code.

- **Correctness:** Verify logic correctness and proper algorithm implementation.
- **Clarity:** Ensure code is self-documenting with clear naming and structure.
- **Cyclomatic Complexity:** Identify overly complex functions (recommend refactoring if complexity > 10).
- **DRY Violations:** Find and eliminate repeated code patterns.
- **Dead Code:** Remove unused variables, functions, imports, and utilities.
- **Code Smells:** Identify long methods, large classes, primitive obsession, feature envy, etc.
- **Clean Code:** Apply clean code principles (meaningful names, small functions, minimal side effects).

### 3. Error Handling, Observability & Resilience

**Objective:** Robust error handling, monitoring, logging, and tracing without compromising privacy while maintaining debugging utility.

- **Error Handling:**
    - Ensure all error paths are handled appropriately
    - Implement proper error boundaries and fallback mechanisms
    - Provide helpful, actionable error messages without leaking sensitive data
    - Use structured error handling (custom error types, error codes)

- **Logging:**
    - Implement consistent, structured logging across the application
    - Use appropriate log levels (DEBUG, INFO, WARN, ERROR, FATAL)
    - **CRITICAL - Selective PHI/PII Sanitization:**
        - **Identify logs at risk:** Audit logging statements to identify which logs may contain PHI/PII (e.g., user inputs, API request/response bodies, database records, error objects containing user data)
        - **Sanitize ONLY risky logs:** Apply sanitization, redaction, or hashing ONLY to logs that may contain sensitive data
        - **Preserve debugging utility:** Keep logs maximally useful for debugging by NOT sanitizing logs that don't contain sensitive data
        - **Examples of what to sanitize:** User IDs (hash or use opaque identifiers), email addresses, phone numbers, health information, addresses, SSN/SIN, credit card numbers
        - **Examples of safe logs:** Application state, configuration values (non-secret), flow control messages, performance metrics, non-sensitive error codes
        - **Never log:** Authentication tokens, passwords, API keys, session identifiers, encryption keys
    - Include correlation IDs for request tracing
    - Avoid excessive logging that creates noise or performance issues
    - **Balance:** Logs should be comprehensive enough to debug production issues while protecting sensitive data

- **Monitoring:**
    - Track key performance indicators (KPIs) and business metrics
    - Monitor error rates, response times, and resource utilization
    - Set up alerting for critical failures or anomalies
    - Ensure monitoring data is aggregated and anonymized (no PHI/PII in metrics)

- **Tracing:**
    - Implement distributed tracing for microservices or multi-component systems
    - Use correlation IDs to trace requests across service boundaries
    - Ensure trace data is sanitized and does not contain PHI/PII
    - Implement sampling strategies for high-volume tracing to reduce costs

- **Resilience:**
    - Graceful degradation when dependencies fail
    - Implement appropriate retry mechanisms with exponential backoff for transient failures
    - Circuit breaker patterns for external dependencies
    - Timeout configurations to prevent hanging operations
    - Fallback strategies for critical operations

### 4. Security & Vulnerability Assessment

**Objective:** Protect users, data, and infrastructure from security threats.

- **Input Validation:** Validate and sanitize all user inputs.
- **Injection Prevention:** Protect against SQL injection, XSS, command injection, LDAP injection, etc.
- **Authentication & Authorization:** Verify proper access controls and session management.
- **API Security:** Ensure proper API authentication, rate limiting, and secure endpoints.
- **Dependency Vulnerabilities:** Check for known vulnerabilities in dependencies.
- **Secrets Management:** Ensure no hardcoded credentials, API keys, or secrets in code.
- **HTTPS/TLS:** Verify encrypted communication for data in transit.
- **CSRF/CORS:** Implement proper CSRF tokens and CORS policies.
- **Server Security:** Protect against DDoS, server-side vulnerabilities, and malicious attacks.

### 5. Privacy & Data Protection (CRITICAL PRIORITY)

**Objective:** Maximum protection of user privacy and sensitive data.

- **PHI/PII Handling:** Identify all PHI/PII data flows and ensure proper protection.
- **Data Minimization:** Collect only necessary data; dispose of data when no longer needed.
- **Encryption:** Ensure data encryption at rest and in transit.
- **Access Controls:** Implement role-based access control (RBAC) for sensitive data.
- **Data Leakage Prevention:** Prevent PHI/PII exposure in logs, analytics, error messages, stack traces, monitoring systems, or third-party services.
- **User Consent:** Verify proper consent mechanisms for data collection and processing.
- **Data Retention:** Implement and enforce appropriate data retention policies.

### 6. Regulatory Compliance

**Objective:** Ensure compliance with applicable data protection and privacy regulations.

Check compliance with:

- **United States:** HIPAA (Health Insurance Portability and Accountability Act)
- **European Union & Ireland:** GDPR (General Data Protection Regulation)
- **Canada (Federal):** PIPEDA (Personal Information Protection and Electronic Documents Act)
- **Canada - Ontario (Provincial):** PHIPA (Personal Health Information Protection Act)
- **South Korea:** PIPA (Personal Information Protection Act)
- **Vietnam:** PDPL (Personal Data Protection Law)

Verify:

- Right to access, rectification, erasure, and data portability
- Breach notification procedures
- Data processing agreements
- Privacy impact assessments where required

### 7. Standards, Style & Best Practices

**Objective:** Consistent, idiomatic code following industry standards.

Apply best practices and style guides for all detected languages:

- **JavaScript/TypeScript:** Google JavaScript & TypeScript Style Guide, TypeScript best practices
- **HTML/CSS/SCSS:** W3C standards, accessibility guidelines, BEM or other naming conventions, Google HTML & CSS Style Guide
- **Go:** Effective Go, Go Code Review Comments, Google Go Style Guide
- **Python:** PEP 8, PEP 257 (including CGI scripts and Jupyter notebooks), Google Python Style Guide
- **C#:** Microsoft C# Coding Conventions, Google C# Style Guide
- **R:** Google's R Style Guide, tidyverse style guide
- **Visual Basic:** Microsoft VB coding conventions
- **Markdown:** CommonMark specification, consistent formatting, Google Markdown Style Guide
- **YAML:** Proper indentation, key naming conventions
- **Protocol Buffers (proto):** Style guide for proto files
- **Gherkin/Feature files:** Consistent scenario structure
- **FHIR-specific:** FHIRPath and FSH (FHIR Shorthand) best practices
- **Data formats:** JSON, XML, Turtle (RDF) - proper structure and validation, Google JSON Style Guide
- **SQL:** Consistent naming, query optimization
- **PHP:** PSR standards (PSR-1, PSR-12)
- **Bash/Shell:** ShellCheck compliance, POSIX compatibility where applicable, Google Shell Style Guide
- **SVG:** Optimized, accessible SVG markup

### 8. Accessibility (A11y)

**Objective:** Ensure all UI/UX is accessible to users with disabilities.

- **WCAG Compliance:** Target WCAG 2.1 Level AA minimum.
- **Color Contrast:** Ensure sufficient contrast ratios (4.5:1 for normal text, 3:1 for large text).
- **Screen Readers:** Proper ARIA labels, semantic HTML, alt text for images.
- **Keyboard Navigation:** Full keyboard accessibility, logical tab order, focus indicators.
- **Visual Disabilities:** Support for screen magnification, high contrast modes.
- **Dyslexia Support:** Consider font choices, line spacing, and text formatting.
- **Motion & Animations:** Respect `prefers-reduced-motion` for users sensitive to motion.
- **Form Accessibility:** Proper labels, error messages, and form validation feedback.

### 9. Testing & Quality Assurance

**Objective:** Comprehensive, meaningful test coverage.

- **Unit Testing:** Test individual functions and components in isolation.
- **Integration Testing:** Test interaction between modules and external services (where applicable).
- **End-to-End Testing:** Test complete user workflows (where applicable).
- **Load/Performance Testing:** Verify performance under expected load (where applicable).
- **Test Coverage:** Achieve meaningful coverage (not just high percentages, but testing critical paths).
- **Test Quality:** Eliminate bloat, useless tests, or tests that assert nothing meaningful.
- **Test Readability:** Write clear, human-readable tests with descriptive names.
- **Test Tables/Cases:** Use data-driven testing with test cases/tables where applicable.
- **Test Maintainability:** Avoid brittle tests, over-mocking, or flaky tests. Remember the motto: "If you mock everything, you test nothing".

### 10. Documentation

**Objective:** Thorough, accurate, and useful documentation.

- **In-Code Documentation:**
    - Clear comments explaining "why" not just the "what" for complex logic
    - JSDoc/TSDoc/GoDoc/docstrings for public APIs
    - Inline documentation for non-obvious code
- **External Documentation:**
    - README files with clear setup and usage instructions
    - API documentation
    - Architecture diagrams
    - Contributing guidelines
- **Documentation Accuracy:** Ensure docs reflect actual implementation (never outdated).

### 11. Performance & Optimization

**Objective:** Fast, responsive, and efficient application.

- **Response Times:** Optimize for quick response times in user-facing operations.
- **Frame Rate:** Maintain smooth 60fps for animations and interactive UI (where applicable).
- **Hanging/Freezing:** Identify and fix code that causes UI blocking or application freezes.
- **Crashes:** Prevent application crashes due to unhandled exceptions or resource exhaustion.
- **Algorithm Efficiency:** Use appropriate data structures and algorithms (avoid O(n²) where O(n) is possible).
- **Lazy Loading:** Implement lazy loading for resources where appropriate.
- **Caching:** Utilize caching strategies to reduce redundant operations.
- **Database Queries:** Optimize queries, use indexes, avoid N+1 problems.

### 12. Build & Bundle Size Optimization

**Objective:** Minimize build output and bundle sizes for faster deployment and user experience.

**Note:** This applies to applications that produce build artifacts (web apps, mobile apps, distributed binaries). Not applicable to local-only CLI tools or offline applications without distribution requirements.

- **Bundle Analysis:**
    - Analyze bundle composition to identify large dependencies
    - Use bundle analyzer tools (webpack-bundle-analyzer, source-map-explorer, etc.)
    - Identify and eliminate duplicate dependencies

- **Code Splitting:**
    - Implement route-based code splitting for web applications
    - Split vendor bundles from application code
    - Lazy load non-critical features and components

- **Tree Shaking:**
    - Ensure proper ES module imports for tree shaking
    - Remove unused exports and dead code
    - Use side-effect-free packages where possible

- **Dependency Optimization:**
    - Replace heavy dependencies with lighter alternatives
    - Use specific imports instead of entire libraries (e.g., `import { specific } from 'library'`)
    - Consider removing dependencies that provide minimal value
    - Audit transitive dependencies and flatten where possible

- **Asset Optimization:**
    - Compress and optimize images (WebP, AVIF formats where supported)
    - Minimize CSS and JavaScript
    - Use SVG for icons instead of icon fonts
    - Implement proper cache headers for static assets

- **Build Configuration:**
    - Enable production optimizations (minification, compression)
    - Use modern build tools with better optimization (esbuild, swc, Vite)
    - Configure proper source maps (external or hidden for production)
    - Remove development-only code from production builds

### 13. Operational Cost Optimization

**Objective:** Reduce infrastructure and operational costs where applicable.

**Note:** This applies to applications using cloud services, hosted infrastructure, or CI/CD platforms. Not applicable to purely offline/local CLI tools or applications without operational expenses.

- **Cloud Service Optimization:**
    - **Compute Resources:**
        - Right-size instances/containers (avoid over-provisioning)
        - Use auto-scaling to match demand
        - Implement serverless functions for sporadic workloads
        - Shutdown or scale down non-production environments when not in use

    - **Storage Costs:**
        - Implement lifecycle policies to archive or delete old data
        - Use appropriate storage classes (hot vs. cold storage)
        - Compress data before storage where appropriate
        - Clean up unused storage resources (orphaned volumes, old snapshots)

    - **Database Optimization:**
        - Optimize queries to reduce compute time
        - Use read replicas efficiently
        - Implement connection pooling to reduce overhead
        - Archive historical data to cheaper storage
        - Consider database sizing and reserved capacity for predictable workloads

    - **Network & Bandwidth:**
        - Enable compression for API responses
        - Implement CDN for static assets
        - Optimize data transfer between regions/zones
        - Cache frequently accessed data closer to users

- **CI/CD Cost Reduction:**
    - **GitHub Actions/Workflows:**
        - Use matrix strategies efficiently
        - Cache dependencies and build artifacts
        - Run tests in parallel where possible
        - Use self-hosted runners for high-volume builds
        - Skip unnecessary workflow runs (e.g., documentation-only changes)

    - **Build Optimization:**
        - Reduce build frequency for non-critical branches
        - Use incremental builds when possible
        - Optimize container image layers for better caching

- **API & Third-Party Services:**
    - Monitor and optimize API call volumes
    - Implement caching to reduce redundant API calls
    - Use batch operations where supported
    - Review and eliminate unused third-party service subscriptions

- **Monitoring & Logging Costs:**
    - Implement log retention policies
    - Use log sampling for high-volume applications
    - Filter out noisy or low-value logs
    - Use cost-effective monitoring tiers appropriately

- **Platform-Specific Optimization:**
    - **Google Cloud Platform (GCP):** Use committed use discounts, preemptible VMs, Cloud Functions for event-driven workloads
    - **AWS:** Use Reserved Instances, Spot Instances, Lambda for serverless, S3 Intelligent-Tiering
    - **Vercel:** Optimize for build minutes, bandwidth usage, and serverless function execution time
    - **Azure:** Use Reserved Instances, Azure Functions consumption plan, Blob storage tiers

### 14. Concurrency & Resilience

**Objective:** Prevent race conditions, deadlocks, and concurrency issues.

- **Race Conditions:** Identify and fix shared state access without proper synchronization.
- **Deadlocks:** Prevent circular dependencies in lock acquisition.
- **Thread Safety:** Ensure thread-safe operations in concurrent code.
- **Async Handling:** Proper promise/async-await usage, error handling in async code.
- **Resource Locking:** Implement appropriate locking mechanisms.
- **Idempotency:** Ensure operations can be safely retried without unintended side effects.
- **Reproducibility:** Ensure consistent, predictable behavior across runs.

### 15. Memory Management

**Objective:** Efficient memory usage without leaks.

- **Memory Leaks:** Identify and fix memory leaks (event listeners, closures, circular references).
- **Stack Overflow:** Prevent deep recursion or large stack allocations.
- **Heap Management:** Optimize heap usage, proper object lifecycle management.
- **Resource Cleanup:** Ensure proper disposal of resources (file handles, database connections, subscriptions).
- **Garbage Collection:** Consider GC pressure in hot paths.

### 16. Scalability

**Objective:** Code ready for significant scale (100,000+ concurrent users).

- **Horizontal Scaling:** Design for stateless components where possible.
- **Load Distribution:** Consider load balancing and distributed systems.
- **Database Scaling:** Plan for read replicas, sharding, or partitioning.
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
    - Execute all validation commands (e.g., `npm run validate`, `make validate`).
    - Run formatters, linters, and complete test suite.
    - Ensure zero errors and warnings (or document intentional exceptions).

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
