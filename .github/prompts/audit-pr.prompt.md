---
description: 'Review a pull request diff across triaged categories, quoting the changed line behind every finding.'
name: 'audit-pr'
argument-hint: '[pull request number or branch; defaults to the active pull request]'
agent: 'agent'
---

# Audit pull request

Act as a principal code reviewer. Produce findings a human can verify and paste into the pull request with minimal editing.

## Scope

**Resolve scope in this order and stop at the first rule that applies. Never widen it.**

1. **An explicit instruction.** The pull request number or branch named when this was invoked.
2. **The active pull request** for the current branch.
3. **Uncommitted changes**, if no pull request exists.
4. **The commits on this branch that the default branch does not have**, if the working tree is clean.

If none of those yields a diff, say so and stop. This prompt reviews a change; with no change to review there is nothing to report, and auditing the codebase instead is a different job with a different method.

Review the diff plus whatever you must read to judge it. Reading a caller, a test, or a type definition outside the diff is expected and required by the refutation pass; reporting findings about unchanged code is not, except where this change makes it wrong.

## Context resolution

Some agents resolve the references below automatically. Any agent that does not resolves each one itself, using the equivalent listed here, before starting. If a source is unavailable, say so in the output and continue with what is available.

| Reference            | What it refers to           | Resolve it yourself with                                                |
| -------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `#activePullRequest` | Active pull request         | The forge's pull request command, or `git diff <default-branch>...HEAD` |
| `#changes`           | Uncommitted working changes | `git diff` and `git diff --staged`                                      |
| `#codebase`          | The project's own files     | Your file-search and file-read tools                                    |
| `#issue_fetch`       | Linked issue                | The forge's issue command, or the issue link in the description         |

## 1. Scope and evidence rules

**Scope.** This run produces a review. It does not edit files and it does not fix what it finds.

1. **Quote the diff.** Every finding quotes the changed line it is about, copied verbatim from the diff. A finding whose quote you cannot produce is dropped, not softened and not reworded as a question.
2. **No line number you did not read.** Cite the file path and the quoted line. Do not write a line range you have not confirmed against the current file: a wrong number costs the reader more than an absent one.
3. **Only what changed, plus what the change breaks.** Flag pre-existing code only where this change makes it wrong, and label it as pre-existing when you do.
4. **Refute before you publish.** Section 6 is not optional.
5. **Respect intentional `any`** and its equivalents in other languages. Do not flag one unless you can name the concrete type that replaces it without breaking the build, and never launder one into a wider escape hatch to quiet a linter. Where a language offers a narrower spelling of the same idea, such as Go's `any` over `interface{}`, prefer it when the swap is safe.
6. **Say what the change does well**, held to the same evidence standard. A review is not only a bug hunt.
7. **Every finding carries a severity:** 🔴 blocking, 🟡 should fix, 🔵 suggestion, ✅ positive.
8. **State uncertainty explicitly** rather than hedging a finding into vagueness. "I could not determine whether X" is useful; "this may possibly be an issue" is not.

## 2. Finding format

```text
### [SEVERITY] [Short title]

**File:** `path/to/file.ext`
**Category:** [category name]
**Changed line:** [the line from the diff, verbatim]

**Issue:** what is wrong, what can go wrong, and which rule or practice it violates.

**Suggested fix:** corrected snippet or pseudocode. Omit for questions and positive callouts.
```

## 3. Step 1: Pull request alignment

Before reviewing code, assess the change itself:

- **Title and description:** accurate and complete?
- **Linked ticket:** does the code implement what it describes? Call out gaps, scope creep, or unfinished work. Where no ticket is reachable, infer from the pull request context and say that you did.
- **Diff scope:** any files changed that seem unrelated to the stated purpose?
- **Breaking changes:** introduced without documentation?
- **Size:** too large to review meaningfully? Say so plainly, because it changes how much confidence the rest of this review carries.

Output a **pull request alignment summary** of three to eight sentences before any code-level finding.

## 4. Step 2: Triage

Read the whole diff once before writing any finding. Then use the table to decide which categories this diff activates. Enter a category only when its trigger appears in the changed lines.

| #   | Category                      | Enter when the diff contains                                                                             |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Correctness and logic         | Any changed behaviour. Always entered.                                                                   |
| 2   | Security                      | User input, auth, secrets, network calls, file paths, rendered markup, model prompts                     |
| 3   | Privacy and data protection   | Personal or health data, logs, analytics, third-party calls                                              |
| 4   | Error handling and resilience | Try/catch, promise chains, external calls, new error types                                               |
| 5   | Code quality and cleanliness  | Any changed source file. Always entered.                                                                 |
| 6   | Architecture and design       | A new module, a new dependency between layers, a moved or split file                                     |
| 7   | Testing                       | Any changed behaviour, or any changed test                                                               |
| 8   | Performance and efficiency    | Loops over collections, queries, renders, payload sizes                                                  |
| 9   | Documentation and comments    | A changed public surface, a changed comment, changed Markdown                                            |
| 10  | Standards and style           | Code in a language the project has a style guide for                                                     |
| 11  | Accessibility                 | Markup, styling, focus, colour, motion, or copy shown to users                                           |
| 12  | Concurrency and shared state  | Async, threads, workers, shared mutable state, locks                                                     |
| 13  | Environment parity            | Environment variable reads, hosts, ports, paths, flags, clocks, locales, fixtures                        |
| 14  | Observability                 | A new failure mode, a new branch that can throw, changed logging                                         |
| 15  | Dependencies and supply chain | A manifest or lockfile change, a new import, an install command, a workflow file                         |
| 16  | Licensing and provenance      | A new dependency, a vendored file, a copied asset or snippet                                             |
| 17  | Cost and billing exposure     | A handler, trigger, scheduled job, query, workflow, asset pipeline, cache or retry config, or model call |
| 18  | Regulatory and compliance     | Personal, health, financial, or biometric data, or a regulated jurisdiction                              |

Name the categories you skipped, and why, in section 7. "No trigger in this diff" is a complete reason. Entering a category and not reporting the result is not.

## 5. Step 3: Review by category

Two lenses are read alongside every category below rather than as categories of their own.

**Maintainability, coupling, and reuse.** For every changed unit: does it depend on another module's internals rather than its interface, and would a change there force a change here? Does high-level policy depend on low-level detail rather than the reverse? Is business logic entangled with I/O, framework, or presentation so it cannot be exercised or reused on its own? Does one reason to change sit beside another in the same unit? How many files must change together the next time this behaviour changes? Is a value hardcoded that a consumer would want to configure, and is it named where a consumer can find it rather than buried in a function body? Is a dependency constructed inside the unit that uses it rather than passed in? Is a parameter list growing, or an interface carrying members most callers ignore? Is there shared mutable module state, or a circular import? **The counterweight, because it is this lens's own failure mode:** an abstraction with a single caller, a generic parameter with a single instantiation, and configuration nobody sets are premature, and premature generalization costs more than the duplication it removes.

**Security and privacy in three directions.** Ask who each finding protects. _The end user:_ their data, session, device, and browser. _The host, system, and company:_ server-side request forgery, command injection, path traversal, unsafe deserialization, resource exhaustion, privilege escalation, over-scoped tokens, log injection, and internal hostnames, employee names, or infrastructure detail leaking into public source, comments, or source maps. _The developer and the build:_ whether cloning, installing, building, or opening this repository can compromise the machine that does it.

### 1. Correctness and logic

Does the code do what the change claims? Off-by-one errors, wrong conditionals, unhandled edge cases, runtime exceptions. Also: boundary conditions, integer and floating-point precision, null against undefined confusion, type coercion, timezone and daylight-saving arithmetic, ordering assumptions, idempotency of anything that can be retried, and partial-failure states that leave data inconsistent.

### 2. Security

Input validation, injection (SQL, cross-site scripting, command, path traversal), authentication and authorization, hardcoded secrets, dependency vulnerabilities, transport security, cross-site request forgery and cross-origin policy, and sensitive data exposed in errors, logs, or responses. Use the OWASP Top 10 as the baseline lens and the three directions above to decide who each finding protects.

Where the diff touches model or agent code, add the OWASP Top 10 for LLM Applications: prompt injection, improper output handling, excessive agency, and sensitive information disclosure. Call out by name any model output used unvalidated as a path, query, command, or URL.

### 3. Privacy and data protection

Personal and health data flow, encryption in transit and at rest, and access control for sensitive data. Minimization at the point of collection, not only at logging. Retention. Third-party SDK data egress and cross-border transfer. Telemetry defaults. Source map and stack trace leakage. Never logged: passwords, tokens, API keys, session identifiers, encryption keys.

### 4. Error handling and resilience

Every error path handled, including asynchronous rejections. No raw stack traces to users. Retries, timeouts, and circuit breakers for external calls. Graceful degradation and consistent error types. Also: error swallowing that changes control flow, retry without backoff or jitter, retry applied to a non-idempotent operation, absent timeouts, unbounded queues and buffers, cancellation not propagated, and error types a caller can actually branch on.

### 5. Code quality and cleanliness

Dead code, duplication, naming clarity, function complexity, magic numbers, and formatting consistency. Read this category through the maintainability lens above.

**Test logic that reached production code:** a test-environment branch, an export that exists only so a test can reach it, a mock or sample value on a production path, a flag that disables behaviour under test.

**Tells of generated code**, which are review targets rather than accusations: an abstraction with one caller, a generic parameter with one instantiation, a helper duplicating one already in the repository under a different name, an API call that is plausible but absent from the library's surface, error handling that catches and logs without changing the outcome, and a comment that narrates the change ("now uses X", "updated to handle Y") instead of describing the code.

### 6. Architecture and design

Tight coupling, single-responsibility violations, inconsistent patterns, over-engineering, separation of concerns, circular dependencies, dependency direction, module boundary violations, interface segregation, change amplification, and leaky abstractions.

Read the change through two further lenses. **Scalability:** what this code does at ten and a hundred times the current data, users, or call rate, and whether it adds work that grows with input where constant work would do. **Maintainability:** what a reader six months from now needs that this diff does not tell them.

### 7. Testing

Tests for new and changed behaviour covering happy paths and edge cases, meaningful assertions, descriptive names, no over-mocking ("if you mock everything, you test nothing"), no brittle tests.

**Missing edge cases:** the negative case for every positive assertion, plus empty, null and undefined, zero and one and the boundary either side of a limit, unicode with combining characters and right-to-left text, duplicate and out-of-order input, concurrent callers, and every error path the code can take.

**Flakiness in the code as well as the test:** wall-clock reads and date arithmetic, unseeded randomness, iteration order of a map, set, or directory listing relied on as stable, a promise not awaited, a real network call or sleep in a test, state shared between cases through a module-level variable, an assertion that races an animation or transition.

The question that subsumes the rest: **would this test fail if the behaviour it names were broken?**

### 8. Performance and efficiency

Algorithmic complexity, N+1 queries, missing caching, oversized payloads, synchronous blocking in an asynchronous context, and memory leaks from uncleaned listeners, subscriptions, or handles. Also: allocation in hot paths, recomputation and re-render, blocking the event loop, unbounded growth, missing pagination, and cold-start cost.

### 9. Documentation and comments

Public surfaces documented, existing comments still accurate after the change, why-comments for non-obvious logic, the pull request description updated, and external documentation still accurate. Flag specific drift as a finding. Correcting the documentation itself is separate work and is not part of this review. A deprecation names its replacement. A tunable value is documented by the name a consumer changes it by.

### 10. Standards and style

Apply the project's own configuration first: its formatter, linter, and documented conventions decide every question they cover, and a tool's exit code is better evidence than your reading. **Never report a violation of a rule the project has turned off.**

Where the project leaves a question open and Google publishes a style guide for the language, use it as the default standard. Google publishes guides for C++, C#, Common Lisp, Go, HTML and CSS, Java, JavaScript, JSON, Markdown, Objective-C, Python, R, Shell, Swift, TypeScript, and Vim script, indexed at `https://google.github.io/styleguide/`. Where Google publishes none, use the language's own prevailing standard.

**Flag the absence of the discipline, not the variant of the convention.** A codebase that consistently applies a different variant of a Google rule has a preference, and a preference is not a defect. What is a defect is having no convention at all, or one file that contradicts every other.

Worked example. The Go style decisions document groups imports as standard library, then other project and vendored packages, then protocol buffer imports, then side-effect imports. A codebase that consistently groups them in a different order is expressing a preference: do not flag it. A file with its imports in one undifferentiated block, or grouped in an order no other file in the repository uses, is a finding, because the discipline is missing rather than varied.

Before flagging any style deviation, read two or three other files of the same language. If the pattern holds across them it is a convention: report it once as an observation at most, never once per occurrence. If it holds nowhere else it is drift, and drift is the finding. A systematic deviation across a whole codebase is a discussion to open, never a per-file finding.

### 11. Accessibility

Target **WCAG 2.2 Level AA**, the current W3C Recommendation. Semantic markup, alternative text and accessible names, keyboard navigation, ARIA correctness, colour contrast (4.5:1 normal, 3:1 large), form labels and error feedback, and reduced-motion support.

The criteria WCAG 2.2 adds over 2.1 are the ones most often missed: focus not obscured, focus appearance, target size, dragging movements having a single-pointer alternative, consistent help, redundant entry, and accessible authentication.

### 12. Concurrency and shared state

Unsynchronized shared state, race conditions, unhandled asynchronous errors, deadlock potential, and idempotency. Also: idempotency keys, at-least-once delivery assumptions, lock ordering, asynchronous cleanup and cancellation, and framework-specific races such as a stale closure or an effect that runs twice.

### 13. Environment parity

Behaviour that differs between a developer machine, a hermetic or ephemeral container, dev, staging, and production. Check: environment variable reads with no default and no startup validation; hardcoded hosts, ports, URLs, and absolute paths; seed, fixture, or sample data assumed to be present; a feature flag whose default differs per environment; timezone, locale, and currency assumptions, including a test that passes only in one UTC offset; wall clock and randomness that CI cannot reproduce; filesystem case sensitivity and path separators; container against host networking, where `localhost` inside a container is not the host.

### 14. Observability

Can a reader debug this in production without reproducing it locally? Check: a log at the level that matches the event, structured rather than an interpolated sentence; a correlation or trace identifier that survives the asynchronous boundary; errors reaching the project's error tracker rather than being swallowed, or logged and then dropped; a metric or alert for each new failure mode the change introduces; and no personal or health data, token, key, session identifier, or full request body in any of it.

### 15. Dependencies and supply chain

Check every added or upgraded dependency and every lockfile entry against what the diff actually imports. Flag: a package name that does not exist, or differs by a character from the intended one, since a generated install command is the usual source; an unpinned or range-widened version on a security-relevant dependency; a source other than the project's usual registry, including a git URL or tarball; a maintainer or ownership change; a version that jumped without a changelog; a resolved URL pointing off-registry; a missing or altered integrity hash on an otherwise unchanged version.

**Install-time code execution is checked by capability, not by field name.** Declared lifecycle hooks are the obvious vector, whatever the ecosystem calls them (`preinstall`, `install`, `postinstall`, and `prepare` in npm; a build backend or `setup.py` in Python; a task that runs on dependency resolution in Gradle, Rake, or Make). But a native-build descriptor that triggers an implicit rebuild executes code too, and it evades any check that reads only the declared lifecycle fields. **A valid provenance attestation does not establish that a release is safe:** a compromised maintainer account can produce one.

Extend the same reasoning to the build and CI surface: a workflow that checks out an untrusted pull request head while holding write permissions or secrets, a third-party action referenced by a mutable tag rather than an immutable commit identifier, secrets reachable from fork pull requests, a self-hosted runner exposed to forks, and editor or container configuration that executes on open, such as an autorun task or a container post-create command. Agent configuration counts: a checked-in skill, rule, or settings file can grant broad tool access to anyone who trusts the repository.

### 16. Licensing and provenance

Check: code that reads as pasted from elsewhere, where the comment style, naming, or level of generality does not match the file around it, with no attribution; a vendored file or snippet whose origin and licence are not recorded; a new dependency whose licence conflicts with the project's own, including copyleft entering a permissive project; a copied image, font, icon set, or dataset without a licence permitting the use. Report what you can show and name the uncertainty. Do not accuse.

### 17. Cost and billing exposure

Judge against the project's deployment shape (static host, serverless, containers, managed database, CI provider), since a dimension the project does not bill is noise.

**Blocking first, because these create unbounded spend rather than inefficiency:** a trigger whose handler writes back to what triggered it, such as a storage function writing into the bucket it watches, a database trigger updating the document that fired it, or a queue consumer republishing to its own topic; a retry policy with no attempt cap, backoff, or dead-letter destination, which multiplies invocations exactly when the system is already failing; fan-out with no ceiling; a workflow that commits or tags and thereby retriggers itself with no actor guard or path filter; polling, or an effect with an unstable dependency, firing a metered call per render; a shared cache expiry driving a synchronized burst at a metered origin. **A budget alert notifies; it does not stop spend.**

**Then efficiency, naming the billing dimension the change moves.** **Egress**, the dimension most often missed and frequently the largest, covering unresized images, missing compression, absent or short cache headers, a bundle shipped to every visitor, and cross-region transfer, with providers differing sharply and some not charging it at all. **Invocations and duration**, covering over-provisioned memory, a function billed while awaiting slow I/O, a bundle inflating cold-start time, and a synchronous chain billing every hop at once. **Per-operation database billing**, covering a read per row where one query would serve, a listener re-reading a collection, a query without a limit, and a scan without a partition or index filter, where the bill follows bytes scanned rather than rows returned. **Storage**, covering absent lifecycle or retention policy, a storage class mismatched to the access pattern, and orphaned artifacts, logs, and backups. **Build minutes**, where runner operating system carries a multiplier (commonly 1x for Linux, 2x for Windows, and roughly 10x for macOS, to be verified against the provider's current published figures) that usually makes runner choice the largest lever, alongside absent dependency caching, no concurrency group cancelling superseded runs, an over-wide matrix, the full suite running on documentation-only changes, and default artifact retention. **Logs and telemetry**, metered by volume and retention, where a debug line in a hot path is a recurring bill, reported once rather than twice with category 14. **Model calls**, covering tokens per call, retries, no caching of identical requests, and context larger than the task needs.

An optimization that introduces a cache, a queue, or another service can cost more than it saves once its own bill is counted.

### 18. Regulatory and compliance

Determine which regulations apply from the data the system holds, the people it holds it about, and where it operates. State which are in scope and why, and state which you ruled out and why. Common examples are GDPR, HIPAA, PIPEDA, CCPA and CPRA, and provincial or state equivalents. **The list is not the check; the determination is.** For each in scope: data subject rights, breach notification, processing agreements, and privacy impact assessments.

## 6. Step 4: Refutation pass

Before writing the summary, take each finding and try to disprove it. This step decides whether the review is accurate.

For each finding, answer:

1. Is the quoted line still in the diff, spelled exactly as quoted?
2. Does the surrounding code already handle it? Re-open the file and read past the changed line, including the guard clauses and the caller.
3. Does a test, a type, a framework guarantee, or a configuration value already prevent it?
4. Did this change cause it, or was it already true? If already true, drop it or relabel it pre-existing.
5. Would your suggested fix actually work? Where its correctness depends on tool behaviour rather than on reading code (ignore-file and glob semantics, config precedence, shell quoting, CI trigger filters), verify it or label it unverified. **A fix that looks right and silently does nothing is worse than no fix**, because it closes the finding without changing anything.

**Delete every finding that does not survive all five.** Deleting some is the expected outcome; a review that refutes nothing did not run this step. Do not convert a refuted finding into a hedge, a question, or a suggestion. Report the number of findings dropped here in section 7.

## 7. Step 5: Summary

```markdown
## Overall verdict: [APPROVED / APPROVED WITH SUGGESTIONS / CHANGES REQUESTED]

### Quick stats

- **Files reviewed:** X
- **Findings:** X blocking · X should fix · X suggestions · X positive
- **Findings dropped in refutation:** X
- **Categories skipped:** [name each, with its reason]

### Alignment

[One to three sentences on whether the code does what the pull request or ticket says]

### Top concerns

[Critical issues that must be resolved before merge]

### What is done well

[Genuinely good patterns or improvements in this change]

### Before merging

- [ ] [Action item]
```

## 8. Tone

Direct and specific. No vague "this could be improved". Critique the code, not the author. Acknowledge trade-offs, and flag risk even where the pattern is valid. Use "consider" for suggestions, "should" for non-blocking, and "must" for blocking. Where a category has no issues, say so in one line.
