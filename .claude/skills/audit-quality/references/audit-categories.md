# Audit categories

The thirteen categories a codebase is audited against, each with what to look for. `SKILL.md` carries the two lenses read alongside every category, the execution order, and the rules every finding follows. Where a category below says "above", or cites a section or Rule 1 or Rule 2, it means `SKILL.md`: section 2 holds the hard rules, section 4 the two lenses, and section 5 the refutation pass.

- [1. Architecture and design](#1-architecture-and-design)
- [2. Correctness and code health](#2-correctness-and-code-health)
- [3. Concurrency, state, and resource lifetime](#3-concurrency-state-and-resource-lifetime)
- [4. Error handling, observability, and resilience](#4-error-handling-observability-and-resilience)
- [5. Security](#5-security)
- [6. Privacy, data protection, and regulatory compliance](#6-privacy-data-protection-and-regulatory-compliance)
- [7. Configuration and environment parity](#7-configuration-and-environment-parity)
- [8. Dependencies, supply chain, and licensing](#8-dependencies-supply-chain-and-licensing)
- [9. Testing](#9-testing)
- [10. Documentation](#10-documentation)
- [11. Performance, build output, and operating cost](#11-performance-build-output-and-operating-cost)
- [12. Accessibility](#12-accessibility)
- [13. User-facing behaviour](#13-user-facing-behaviour)

## 1. Architecture and design

Modularity, SOLID principles, coupling against cohesion, anti-patterns and code smells, separation of concerns, layer boundaries, dependency direction, and circular dependencies. Read through the maintainability lens above.

**Measure before judging, and report the measurement.** These defects are the ones an audit reliably walks past, because every one of them is a property of shape that no single line displays, and a reader who only reads lines never meets it. "Flag monolithic files" is not a check until a file has been measured. Six counts, each cheap, and each producing a number that goes in the finding:

- **Length** of every file in scope. Where several of them sit in one directory, record the longest and the shortest beside the individual numbers: a screen-level composite standing next to a one-expression primitive is two altitudes held as peers, and the two numbers with their two paths are what shows it.
- **Members** of every type, interface, class, or module, counting what a caller must satisfy or an implementor must supply across every declaration contributing them, alongside how many of them a caller actually touches. Open two callers and count; an interface whose typical caller uses four of twenty members is the finding, and the count is what shows it.
- **Files sitting directly in every directory**, counted whatever subdirectories sit beside them, and whether the tree's other directories at that level group their own files. A directory holding one subdirectory and two dozen loose files is not grouped: it holds one group and two dozen ungrouped files.
- **Occurrences** of any block of logic written more than once. Two may be coincidence; three is a pattern reported with all three paths.
- **Files repeating one declaration**, meaning a setting, directive, suppression, or bootstrap import written into each file rather than into the configuration the tool reads. Count the files and name the key. **Look for the key, not for the directive's own spelling**, since the two are rarely the same word: a per-file test environment docblock against the runner's environment key, a per-file suppression comment against the linter's per-glob ignore map, a per-file build constraint against the build configuration's default.
- **Parameters** of every function, split into those supplying data and those switching behaviour, against the other functions in the same module. A switch is a parameter the body branches on rather than operates on, whatever its type, and each one holds a second behaviour inside one name. Count them where the function is a utility, meaning it is named for one operation, exported for general use, sits where shared code sits, or has callers that do not know about each other; a function coordinating a sequence takes its modes legitimately.

**A count triggers a look and is never a finding by itself.** What makes it one is the count plus what the shape costs a reader or the next change, plus the concrete split: which members go into which type, which files into which subdirectory, what the shared unit would hold, which key carries the declaration. A finding that reports a number and recommends refactoring gives the reader nothing to do with it.

**Two triggers, either sufficient.** The first is being an outlier in this tree, which is the one that travels: state the number and what it is measured against, since a file is long relative to its siblings and a directory is disorganized relative to how the tree organizes its others. The second is a backstop for a tree whose siblings are all bloated, where the first test finds nothing: roughly a file past 600 lines, a type past 15 members, more than 20 files sitting directly in a directory, a block repeated three times, one declaration repeated in three files, more than one behaviour-switching parameter on a utility. Those six numbers are the point where a reader stops holding the unit in their head at once, and they are approximate on purpose. Prefer the comparison where both apply.

**Name the subdirectory from what the listing already shows.** Entries sharing a name prefix are the group, and four of twenty-four sharing one names both the group and the directory it should become. That signal costs nothing beyond the listing already taken, and a directory whose files are re-exported through a single barrel produces none, which is what keeps it off code that is already factored. Grouping by kind, by feature, by layer, and colocating a unit with its own tests are each a scheme, and a tree applying one consistently has a convention: **what is measured is whether any grouping covers the files counted, never which scheme the project ought to adopt.**

**A repeated declaration is fixed by hoisting the majority and leaving the minority declared.** Count the majority over every file the setting governs rather than over the files you happened to read, since a default taken from a sample can be the wrong value for the rest, and say what the new default does to the files already governed by it. Two conditions retire this count without a finding: values differing file by file with no majority, so no default would carry them, and a tool defining no project-level key for the setting. The second is a sentence to write rather than a count to drop, naming the key you looked for and the configuration file you read, because a key you did not find is not a key that does not exist. Repetition a rename, a codemod, or a formatter pass produced is not this finding either: the line repeats because the files repeat, and no key would carry it.

**Name the principle** from the maintainability lens above, and put it in the finding's evidence. Whether a proposed split is worth making is decided in section 5, so duplication whose copies would change for different reasons is still reported here.

**Scalability lens.** Judge scale against the project's own traffic, data volume, and deployment shape, established in discovery. A static site, a command-line tool, and a multi-tenant service have different answers, and prescribing a distributed cache, a message queue, or a connection pool to a project with no server is wrong advice. Flag work that grows with input where constant work would do, name any component that cannot run as more than one instance where that matters, and name the first limit the current shape will hit.

## 2. Correctness and code health

Logic correctness, clarity, cyclomatic complexity, duplication, dead code (unused variables, functions, imports), long methods, primitive obsession, feature envy, meaningful names, small functions, and minimal side effects. Also: boundary conditions, numeric precision, type coercion, timezone and daylight-saving arithmetic, ordering assumptions, and idempotency of anything retried.

**Test logic that reached production code:** a test-environment branch, an export that exists only so a test can reach it, a mock or sample value on a production path, a flag that disables behaviour under test.

**Tells of generated code**, which are review targets rather than accusations: an abstraction with one caller, a generic parameter with one instantiation, a helper duplicating one already in the repository under a different name, an API call that is plausible but absent from the library's surface, error handling that catches and logs without changing the outcome, and a comment that narrates a change ("now uses X", "updated to handle Y") or explains an absence ("removed X because", "we no longer need Y") instead of describing the code. The test that catches the second without a phrase list: point at the line the comment describes. A comment you cannot attach to a line beneath it is about a decision rather than about this code, and the reader who wants that decision is looking at the commit or the pull request.

**The tell for a re-implementation is vocabulary.** Code spelling a specification's own field names is implementing that specification, whatever the enclosing function is called, and code that renames those fields implements it too, so read what each value means rather than matching names against a list. Rule 1 in section 2 is where the three sources are checked; this is where the block is noticed. **Three cases are not this finding:** a test building a value by hand to exercise a rejection path, since constructing the malformed input is the point of the test and routing it through the library under test deletes the case; a shim standing in for a platform feature the project's stated target lacks; and a project whose own subject is the behaviour.

**Standards and style.** Apply the project's own configuration first: its formatter, linter, and documented conventions decide every question they cover, and a tool's exit code is better evidence than your reading. **Never report a violation of a rule the project has turned off.**

Where the project leaves a question open and Google publishes a style guide for the language, use it as the default standard. Google publishes guides for C++, C#, Common Lisp, Go, HTML and CSS, Java, JavaScript, JSON, Markdown, Objective-C, Python, R, Shell, Swift, TypeScript, and Vim script, indexed at `https://google.github.io/styleguide/`. Where Google publishes none, use the language's own prevailing standard.

**Flag the absence of the discipline, not the variant of the convention.** A codebase that consistently applies a different variant of a Google rule has a preference, and a preference is not a defect. What is a defect is having no convention at all, or one file that contradicts every other.

Before flagging any style deviation, read two or three other files of the same language. If the pattern holds across them it is a convention: report it once as an observation at most, never once per occurrence. If it holds nowhere else it is drift, and drift is the finding. A systematic deviation across a whole codebase is a discussion to open, never a per-file finding.

## 3. Concurrency, state, and resource lifetime

Shared state synchronization, deadlock prevention, thread safety, asynchronous error handling, resource locking, idempotency, and reproducibility. Also: memory leaks (event listeners, closures, circular references), stack overflow risk, resource cleanup (file handles, database connections, subscriptions), garbage-collection pressure in hot paths, idempotency keys, at-least-once delivery assumptions, lock ordering, and cancellation propagation.

## 4. Error handling, observability, and resilience

- **Error handling:** every path handled, error boundaries and fallbacks, actionable messages that do not leak sensitive data, structured error types a caller can branch on, and no error swallowing that silently changes control flow.
- **Logging:** consistent structured logging at appropriate levels. **Sanitize only logs at risk of containing personal or health data** (user inputs, request bodies, database records, error objects carrying user data). Preserve debugging utility in safe logs (application state, configuration, flow control, metrics). **Never log:** authentication tokens, passwords, API keys, session identifiers, encryption keys. Include correlation identifiers. Avoid excessive noise, which is also a cost (category 11).
- **Monitoring:** error rates, response times, resource utilization, alerting for critical failures, and anonymized metrics. Verify a metric or alert exists for each failure mode the code can reach, and that errors actually arrive at the project's tracker rather than being logged and dropped.
- **Tracing:** correlation identifiers that survive asynchronous boundaries, sanitized trace data, and sampling for high-volume traces.
- **Resilience:** graceful degradation, retry with exponential backoff and jitter, circuit breakers, timeouts, and fallback strategies.

## 5. Security

Input validation and sanitization, injection prevention (SQL, cross-site scripting, command, LDAP, path traversal), authentication, authorization and session management, API security and rate limiting, dependency vulnerabilities, secrets management, transport security, cross-site request forgery and cross-origin policy, and server-side request forgery. Use the OWASP Top 10 as the baseline lens and the three directions above to decide who each finding protects.

**A hand-written security primitive is blocking on its own.** Anything that signs, verifies, encrypts, hashes a credential, derives a key, or settles an authorization outcome cannot be shown correct by reading it, and its failures are silent rather than loud. Where Rule 1's three sources place a vetted implementation within reach, the hand-written one is a blocking finding even when nothing in it looks wrong.

Where the codebase includes model or agent code, add the OWASP Top 10 for LLM Applications: prompt injection, improper output handling, excessive agency, and sensitive information disclosure. Call out by name any model output used unvalidated as a path, query, command, or URL.

## 6. Privacy, data protection, and regulatory compliance

Personal and health data flow, data minimization at the point of collection rather than only at logging, encryption at rest and in transit, role-based access control for sensitive data, leakage prevention (logs, analytics, errors, stack traces, source maps, third-party services), consent mechanisms, retention policies, third-party SDK data egress, and cross-border transfer.

Determine which regulations apply from the data the system holds, the people it holds it about, and where it operates. State which are in scope and why, and state which you ruled out and why. Common examples are GDPR, HIPAA, PIPEDA, CCPA and CPRA, and provincial or state equivalents. **The list is not the check; the determination is.** For each in scope: data subject rights, breach notification, processing agreements, and privacy impact assessments.

## 7. Configuration and environment parity

Behaviour that differs between a developer machine, a hermetic or ephemeral container, dev, staging, and production. Check: environment variable reads with no default and no startup validation; hardcoded hosts, ports, URLs, and absolute paths; seed, fixture, or sample data assumed to be present; a feature flag whose default differs per environment; timezone, locale, and currency assumptions, including a test that passes only in one UTC offset; wall clock and randomness that CI cannot reproduce; filesystem case sensitivity and path separators; container against host networking, where `localhost` inside a container is not the host. Also check that every configuration value the code reads is documented by the name a consumer changes it by.

## 8. Dependencies, supply chain, and licensing

Check every dependency and lockfile entry against what the codebase actually imports, and flag anything unused. Flag: a package name that does not exist, or differs by a character from the intended one, since a generated install command is the usual source; an unpinned or range-widened version on a security-relevant dependency; a source other than the project's usual registry, including a git URL or tarball; a maintainer or ownership change; a resolved URL pointing off-registry; a missing or altered integrity hash on an otherwise unchanged version.

**Install-time code execution is checked by capability, not by field name.** Lifecycle scripts (`preinstall`, `install`, `postinstall`, `prepare`) are the obvious vector, but a native-build hook such as a `binding.gyp` that triggers an implicit rebuild executes code too and evades checks that read only the lifecycle-script fields. **A valid provenance attestation does not establish that a release is safe:** a compromised maintainer account can produce one.

Extend the same reasoning to the build and CI surface, where a whole-codebase audit sees what a diff cannot: every workflow file, including any that checks out an untrusted pull request head while holding write permissions or secrets, any third-party action referenced by a mutable tag rather than an immutable commit identifier, secrets reachable from fork pull requests, and self-hosted runners exposed to forks. Editor and container configuration that executes on open counts, such as an autorun task or a container post-create command, and so does checked-in agent configuration: a skill, rule, or settings file can grant broad tool access to anyone who trusts the repository.

**Licensing and provenance:** code that reads as pasted from elsewhere, where the comment style, naming, or level of generality does not match the file around it, with no attribution; a vendored file or snippet whose origin and licence are not recorded; a dependency whose licence conflicts with the project's own, including copyleft entering a permissive project; a copied image, font, icon set, or dataset without a licence permitting the use; and a licence declaration that disagrees between the licence file, the package manifest, and the documentation. Report what you can show and name the uncertainty. Do not accuse.

## 9. Testing

Unit tests (isolated), integration tests (module interactions), and end-to-end tests (user workflows). Meaningful coverage of critical paths rather than a percentage. Test quality: no bloat, no meaningless assertions, descriptive names, data-driven cases where applicable, and no over-mocking ("if you mock everything, you test nothing").

**Missing edge cases:** the negative case for every positive assertion, plus empty, null and undefined, zero and one and the boundary either side of a limit, unicode with combining characters and right-to-left text, duplicate and out-of-order input, concurrent callers, and every error path the code can take.

**Flakiness in the code as well as the test:** wall-clock reads and date arithmetic, unseeded randomness, iteration order of a map, set, or directory listing relied on as stable, a promise not awaited, a real network call or sleep in a test, state shared between cases through a module-level variable, an assertion that races an animation or transition.

The question that subsumes the rest: **would this test fail if the behaviour it names were broken?**

## 10. Documentation

Flag documentation that contradicts the code, a public surface with no documentation, a deprecation that does not name its replacement, and setup or usage instructions that no longer work. **Report the drift as a finding; do not perform a full documentation rewrite inside this audit.** Rewriting documentation is separate work with its own verification needs.

## 11. Performance, build output, and operating cost

**Performance:** response times, frame budget for animations where applicable, blocking the main thread, algorithmic complexity, lazy loading, caching strategy, and query optimization (indexes, N+1).

**Build output**, where the project produces a build artifact: bundle composition and large or duplicate dependencies, code splitting, tree shaking, dependency size, asset optimization (modern image formats, minification, cache headers), and production build configuration with no development code shipped.

**Cost and billing exposure.** Judge against the project's deployment shape (static host, serverless, containers, managed database, CI provider), since a dimension the project does not bill is noise.

**Blocking first, because these create unbounded spend rather than inefficiency:** a trigger whose handler writes back to what triggered it, such as a storage function writing into the bucket it watches, a database trigger updating the document that fired it, or a queue consumer republishing to its own topic; a retry policy with no attempt cap, backoff, or dead-letter destination, which multiplies invocations exactly when the system is already failing; fan-out with no ceiling; a workflow that commits or tags and thereby retriggers itself with no actor guard or path filter; polling, or an effect with an unstable dependency, firing a metered call per render; a shared cache expiry driving a synchronized burst at a metered origin. **A budget alert notifies; it does not stop spend.**

**Then efficiency, naming the billing dimension.** **Egress**, the dimension most often missed and frequently the largest, covering unresized images, missing compression, absent or short cache headers, a bundle shipped to every visitor, and cross-region transfer, with providers differing sharply and some not charging it at all. **Invocations and duration**, covering over-provisioned memory, a function billed while awaiting slow I/O, a bundle inflating cold-start time, and a synchronous chain billing every hop at once. **Per-operation database billing**, covering a read per row where one query would serve, a listener re-reading a collection, a query without a limit, and a scan without a partition or index filter, where the bill follows bytes scanned rather than rows returned. **Storage**, covering absent lifecycle or retention policy across every bucket and log sink, a storage class mismatched to the access pattern, and orphaned artifacts, logs, and backups. **Build minutes**, where runner operating system carries a multiplier (commonly 1x for Linux, 2x for Windows, and roughly 10x for macOS, to be verified against the provider's current published figures) that usually makes runner choice the largest lever, alongside absent dependency caching, no concurrency group cancelling superseded runs, an over-wide matrix, the full suite running on documentation-only changes, and default artifact retention. **Logs and telemetry**, metered by volume and retention, where a debug line in a hot path is a recurring bill, reported once rather than twice with category 4. **Model calls**, covering tokens per call, retries, no caching of identical requests, and context larger than the task needs.

A whole-codebase view also sees provisioned services with no caller, which bill for nothing. An optimization that introduces a cache, a queue, or another service can cost more than it saves once its own bill is counted.

## 12. Accessibility

Target **WCAG 2.2 Level AA**, the current W3C Recommendation. Colour contrast (4.5:1 normal, 3:1 large), semantic markup and accessible names, keyboard navigation and focus indicators, alternative text, screen magnification and high contrast support, reduced-motion support, and form labels and error feedback.

The criteria WCAG 2.2 adds over 2.1 are the ones most often missed: focus not obscured, focus appearance, target size, dragging movements having a single-pointer alternative, consistent help, redundant entry, and accessible authentication.

## 13. User-facing behaviour

Loading, empty, and error states for every asynchronous path. Recovery from an error without losing work. Feedback for every user action. Progressive enhancement, so core functionality works and enhanced features degrade gracefully. Restrict findings here to what is visible in the code; retention and engagement metrics are not auditable from source.
