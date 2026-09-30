# Review categories

This file holds the eighteen categories a pull request is reviewed against, each with what to look for. [`SKILL.md`](../SKILL.md) carries the two lenses read alongside every category, the triage that decides which categories apply, and the rules every finding follows. Where a category below says "above", or cites section 5 or section 6, it means [`SKILL.md`](../SKILL.md): section 5 holds the two lenses, and section 6 the refutation pass.

- [1. Correctness and logic](#1-correctness-and-logic)
- [2. Security](#2-security)
- [3. Privacy and data protection](#3-privacy-and-data-protection)
- [4. Error handling and resilience](#4-error-handling-and-resilience)
- [5. Code quality and cleanliness](#5-code-quality-and-cleanliness)
- [6. Architecture and design](#6-architecture-and-design)
- [7. Testing](#7-testing)
- [8. Performance and efficiency](#8-performance-and-efficiency)
- [9. Documentation and comments](#9-documentation-and-comments)
- [10. Standards and style](#10-standards-and-style)
- [11. Accessibility](#11-accessibility)
- [12. Concurrency and shared state](#12-concurrency-and-shared-state)
- [13. Environment parity](#13-environment-parity)
- [14. Observability](#14-observability)
- [15. Dependencies and supply chain](#15-dependencies-and-supply-chain)
- [16. Licensing and provenance](#16-licensing-and-provenance)
- [17. Cost and billing exposure](#17-cost-and-billing-exposure)
- [18. Regulatory and compliance](#18-regulatory-and-compliance)

## 1. Correctness and logic

Does the code do what the change claims? Off-by-one errors, wrong conditionals, unhandled edge cases, runtime exceptions. Also: a reference, view, iterator, or handle outliving what it points at, boundary conditions, integer and floating-point precision, null against undefined confusion, type coercion, timezone and daylight-saving arithmetic, ordering assumptions, idempotency of anything that can be retried, and partial-failure states that leave data inconsistent.

## 2. Security

Input validation, injection (SQL, cross-site scripting, command, path traversal), authentication and authorization, hardcoded secrets, dependency vulnerabilities, transport security, cross-site request forgery and cross-origin policy, and sensitive data exposed in errors, logs, or responses. Use the OWASP Top 10 as the baseline lens and the three directions above to decide who each finding protects.

**A hand-written security primitive is blocking on its own.** Anything that signs, verifies, encrypts, hashes a credential, derives a key, or settles an authorization outcome cannot be shown correct by reading it, and its failures are silent rather than loud. Where the three sources in category 5 place a vetted implementation within reach, the hand-written one is blocking even when nothing in it looks wrong.

Where the diff touches model or agent code, add the OWASP Top 10 for LLM Applications: prompt injection, improper output handling, excessive agency, and sensitive information disclosure. Call out by name any model output used unvalidated as a path, query, command, or URL.

## 3. Privacy and data protection

Personal and health data flow, encryption in transit and at rest, and access control for sensitive data. Minimization at the point of collection, not only at logging. Retention. Third-party SDK data egress and cross-border transfer. Telemetry defaults. Source map and stack trace leakage. Never logged: passwords, tokens, API keys, session identifiers, encryption keys.

## 4. Error handling and resilience

Every error path handled, including asynchronous rejections. No raw stack traces to users. Retries, timeouts, and circuit breakers for external calls. Graceful degradation and consistent error types. Also: error swallowing that changes control flow, retry without backoff or jitter, retry applied to a non-idempotent operation, absent timeouts, unbounded queues and buffers, cancellation not propagated, and error types a caller can actually branch on.

## 5. Code quality and cleanliness

Dead code, naming clarity, function complexity, magic numbers, and formatting consistency. Read this category through the maintainability lens above.

**Duplication is counted, not sensed.** Read the diff for a block of logic it writes more than once, in the changed files and against what the repository already holds, and count the occurrences: two may be coincidence, and three is a pattern reported with all three paths and the count. The comparison a reader needs is what the block does and where each copy lives, not an estimate of how similar they look. Search on what the block does rather than on what it is called, meaning the vocabulary of the behaviour and any distinctive literal or constant it carries, since a copy living under a different name is the common case and a search by name is what it defeats. Whether the copies should become one unit is decided in section 6, so a copy whose siblings would change for different reasons is still reported here.

**A named behaviour is looked up before it is judged as code.** Where a changed block implements behaviour with a name outside this repository, such as a wire format, a token or cookie grammar, a version-ordering rule, a delimited-text parser, a retry schedule, or a cryptographic construction, check three sources in order and state which you checked: the project's own modules; the manifest and its lockfile, where a package the project already declares is the answer wherever it covers the case and one present only transitively is not; then the language's standard library or the runtime platform, read against the project's stated target rather than the newest release. Report the first that already provides it, with the import a caller would write. **The third source is reached by searching, not by failing to find:** name the manifest file you opened and the query you ran, and read the lockfile beside it, since the manifest lists what the project asked for while the lockfile lists what is actually resolved. **The import list gathered while reading the diff is the trigger that does not depend on recognizing anything.** A named behaviour is looked up only once it is recognized, so the block that survives is the one whose name meant nothing to the reader: read the exported surface of a module a changed block sits beneath and appears to duplicate, and check it against that block before accepting it. The trigger is the block, never the list: the list is what makes the block findable without recognizing the behaviour first, so it is read once and spent only where a block invites it. A block hand-rolling half of what its own file already imports is the shape this misses most often.

**The tell is vocabulary.** Code spelling a specification's own field names is implementing that specification, whatever the enclosing function is called, and code that renames those fields implements it too, so read what each value means rather than matching names against a list.

The manifest and lockfile pair for each ecosystem, how to read an installed package's exported surface without executing it, where a resolver hides a package from a lookup, and the parameter split behind the sixth count are in [`reuse-and-decomposition.md`](reuse-and-decomposition.md). Open it when the change adds or widens a function, or writes a block a module the file already imports might provide, rather than on every run.

**Severity follows what the block protects.** Blocking where the behaviour is a security primitive as category 2 defines it, and raised there. Should fix where a package already in the manifest or the standard library provides it. A question for a human where nothing present provides it, **never a request to install something**, since adding a dependency is a supply-chain decision this review does not get to make. **Three cases are not this finding:** a test building a value by hand to exercise a rejection path, since constructing the malformed input is the point of the test and routing it through the library under test deletes the case; a shim standing in for a platform feature the project's stated target lacks; and a project whose own subject is the behaviour.

**Test logic that reached production code:** a test-environment branch, an export that exists only so a test can reach it, a mock or sample value on a production path, a flag that disables behaviour under test.

**Tells of generated code**, which are review targets rather than accusations: an abstraction with one caller, a generic parameter with one instantiation, a helper duplicating one already in the repository under a different name, an API call that is plausible but absent from the library's surface, error handling that catches and logs without changing the outcome, and a comment that narrates the change ("now uses X", "updated to handle Y") or explains an absence ("removed X because", "we no longer need Y") instead of describing the code. The test that catches the second without a phrase list: point at the line the comment describes. A comment you cannot attach to a line beneath it is about a decision rather than about this code, and the reader who wants that decision is looking at the pull request.

## 6. Architecture and design

The defects named in the maintainability lens above, plus inconsistent patterns, over-engineering, and leaky abstractions.

**Measure before judging, and report the measurement.** These defects are the ones a review reliably walks past, because every one of them is a property of shape that no single line displays, and a reader who only reads lines never meets it. Six counts are taken on any change that moves them, each cheap and each producing a number that goes in the finding:

- **Length** of every file the change adds or leaves longer. Where several of them sit in one directory, record the longest and the shortest beside the individual numbers: a screen-level composite standing next to a one-expression primitive is two altitudes held as peers, and the two numbers with their two paths are what shows it.
- **Members** of every type, interface, class, or module it adds or extends, counting what a caller must satisfy or an implementor must supply across every declaration contributing them, alongside how many of them a caller actually touches. Open two callers and count; an interface whose typical caller uses four of twenty members is the finding, and the count is what shows it.
- **Files sitting directly in every directory it adds to**, counted whatever subdirectories sit beside them, and whether the tree's other directories at that level group their own files. A directory holding one subdirectory and two dozen loose files is not grouped: it holds one group and two dozen ungrouped files.
- **Occurrences** of any block it repeats, carried over from category 5 with the path of each.
- **Files the change gives the same declaration**, meaning a setting, directive, suppression, or bootstrap import added to each file rather than to the configuration the tool reads. Report the count and name the key. **Look for the key, not for the directive's own spelling**, since the two are rarely the same word: a per-file test environment docblock against the runner's environment key, a per-file suppression comment against the linter's per-glob ignore map, a per-file build constraint against the build configuration's default.
- **Parameters** of every function the change adds or widens, split into those supplying data and those switching behaviour, against the other functions in the same module. A switch is a parameter the body branches on rather than operates on, whatever its type, and each one holds a second behaviour inside one name. Count them where the function is a utility, meaning it is named for one operation, exported for general use, sits where shared code sits, or has callers that do not know about each other; a function coordinating a sequence takes its modes legitimately.

**A count triggers a look and is never a finding by itself.** What makes it one is the count plus what the shape costs a reader or the next change, plus the concrete split: which members go into which type, which files into which subdirectory, what the shared unit would hold, which key carries the declaration. A finding that reports a number and asks for refactoring gives the reader nothing to do with it.

**Two triggers, either sufficient.** The first is being an outlier in this tree, which is the one that travels: state the number and what it is measured against, since a file is long relative to its siblings and a directory is disorganized relative to how the tree organizes its others. The second is a backstop for a tree whose siblings are all bloated, where the first test finds nothing: roughly a file past 600 lines, a type past 15 members, more than 20 files sitting directly in a directory, a block repeated three times, one declaration repeated in three files, more than one behaviour-switching parameter on a utility. Those six numbers are the point where a reader stops holding the unit in their head at once, and they are approximate on purpose. Prefer the comparison where both apply.

**Name the subdirectory from what the listing already shows.** Entries sharing a name prefix are the group, and four of twenty-four sharing one names both the group and the directory it should become. That signal costs nothing beyond the listing already taken, and a directory whose files are re-exported through a single barrel produces none, which is what keeps it off code that is already factored. Grouping by kind, by feature, by layer, and colocating a unit with its own tests are each a scheme, and a tree applying one consistently has a convention: **what is measured is whether any grouping covers the files counted, never which scheme the project ought to adopt.**

**A repeated declaration is fixed by hoisting the majority and leaving the minority declared.** Count the majority over every file the setting governs rather than over the files this change touches, since a default taken from the diff can be the wrong value for the rest of the tree, and say what the new default does to the files outside the change. Two conditions retire this count without a finding: values differing file by file with no majority, so no default would carry them, and a tool defining no project-level key for the setting. The second is a sentence to write rather than a count to drop, naming the key you looked for and the configuration file you read, because a key you did not find is not a key that does not exist. Repetition a rename, a codemod, or a formatter pass produced is not this finding either: the line repeats because the files repeat, and no key would carry it.

**Name the principle** from the maintainability lens in section 5, and put it in the finding's `Principle` field.

Read the change through two further lenses. **Scalability:** what this code does at ten and a hundred times the current data, users, or call rate, and whether it adds work that grows with input where constant work would do. **Maintainability:** what a reader six months from now needs that this diff does not tell them.

## 7. Testing

Tests for new and changed behaviour covering happy paths and edge cases, meaningful assertions, descriptive names, no over-mocking ("if you mock everything, you test nothing"), no brittle tests.

**Missing edge cases:** the negative case for every positive assertion, plus empty, null and undefined, zero and one and the boundary either side of a limit, unicode with combining characters and right-to-left text, duplicate and out-of-order input, concurrent callers, and every error path the code can take.

**Flakiness lives in the code as well as the test**, and it is read as an environment-parity defect: the causes, and how to tell one from a genuine failure, are with category 13 in [`environment-and-observability.md`](environment-and-observability.md).

The question that subsumes the rest: **would this test fail if the behaviour it names were broken?**

## 8. Performance and efficiency

Algorithmic complexity, N+1 queries, missing caching, oversized payloads, synchronous blocking in an asynchronous context, and memory leaks from uncleaned listeners, subscriptions, or handles. Also: allocation in hot paths, recomputation and re-render, blocking the event loop, unbounded growth, missing pagination, and cold-start cost.

## 9. Documentation and comments

Public surfaces documented, existing comments still accurate after the change, why-comments for non-obvious logic, the pull request description updated, and external documentation still accurate. Flag specific drift as a finding. Correcting the documentation itself is separate work and is not part of this review. A deprecation names its replacement. A tunable value is documented by the name a consumer changes it by.

## 10. Standards and style

Apply the project's own configuration first: its formatter, linter, and documented conventions decide every question they cover, and a tool's exit code is better evidence than your reading. **Never report a violation of a rule the project has turned off.**

Where the project leaves a question open and Google publishes a style guide for the language, use it as the default standard. Google publishes guides for C++, C#, Common Lisp, Go, HTML and CSS, Java, JavaScript, JSON, Markdown, Objective-C, Python, R, Shell, Swift, TypeScript, and Vim script, indexed at `https://google.github.io/styleguide/`. Where Google publishes none, use the language's own prevailing standard.

**Flag the absence of the discipline, not the variant of the convention.** A codebase that consistently applies a different variant of a Google rule has a preference, and a preference is not a defect. What is a defect is having no convention at all, or one file that contradicts every other.

Before flagging any style deviation, read two or three other files of the same language. If the pattern holds across them it is a convention: report it once as an observation at most, never once per occurrence. If it holds nowhere else it is drift, and drift is the finding. A systematic deviation across a whole codebase is a discussion to open, never a per-file finding.

## 11. Accessibility

Target **WCAG 2.2 Level AA**, the current W3C Recommendation. Semantic markup, alternative text and accessible names, keyboard navigation, ARIA correctness, colour contrast (4.5:1 normal, 3:1 large), form labels and error feedback, and reduced-motion support.

The criteria WCAG 2.2 adds over 2.1 are the ones most often missed: focus not obscured, focus appearance, target size, dragging movements having a single-pointer alternative, consistent help, redundant entry, and accessible authentication.

## 12. Concurrency and shared state

Unsynchronized shared state, race conditions, unhandled asynchronous errors, deadlock potential, and idempotency. Also: idempotency keys, at-least-once delivery assumptions, lock ordering, asynchronous cleanup and cancellation, and framework-specific races such as a stale closure or an effect that runs twice.

## 13. Environment parity

Behaviour that differs between a developer machine, a hermetic or ephemeral container, dev, staging, and production: unvalidated environment reads, hardcoded hosts and paths, assumed fixture data, per-environment flag defaults, timezone and locale assumptions, wall clock and randomness CI cannot reproduce, filesystem case sensitivity, and container against host networking.

## 14. Observability

Can a reader debug this in production without reproducing it locally? A log at the level matching the event and structured rather than interpolated, a correlation identifier surviving the asynchronous boundary, errors reaching the project's tracker rather than being swallowed or logged and dropped, and a metric or alert for each new failure mode. **No personal or health data, token, key, session identifier, or full request body reaches any of it.**

Both categories, and the flakiness causes they share, are in [`environment-and-observability.md`](environment-and-observability.md). Open it when either is entered.

## 15. Dependencies and supply chain

Check every added or upgraded dependency and every lockfile entry against what the diff actually imports.

**Install-time code execution is checked by capability, not by field name.** Declared lifecycle hooks are the obvious vector, whatever the ecosystem calls them, but a native-build descriptor that triggers an implicit rebuild executes code too, and it evades any check reading only the declared lifecycle fields. **A valid provenance attestation does not establish that a release is safe:** a compromised maintainer account can produce one. The same reasoning reaches the build and CI surface, and agent configuration counts, since a checked-in skill, rule, or settings file can grant broad tool access to anyone who trusts the repository.

**Each signal in an added or upgraded dependency is a finding on its own, and two of them on one package is blocking.** **An integrity hash that moved or was removed while the version string stayed the same is blocking by itself:** neither case has a reading that leaves the version identical and the artifact intact, and settling it needs nothing known about the package, so run that comparison first.

The signals themselves, the per-ecosystem execution table, and the workflow and container checks are in [`supply-chain.md`](supply-chain.md). Open it when this category is entered.

## 16. Licensing and provenance

Check: code that reads as pasted from elsewhere, where the comment style, naming, or level of generality does not match the file around it, with no attribution; a vendored file or snippet whose origin and licence are not recorded; a new dependency whose licence conflicts with the project's own, including copyleft entering a permissive project; a copied image, font, icon set, or dataset without a licence permitting the use. Report what you can show and name the uncertainty. Do not accuse.

## 17. Cost and billing exposure

Judge against the project's deployment shape (static host, serverless, containers, managed database, CI provider), since a dimension the project does not bill is noise.

**Blocking first, because these create unbounded spend rather than inefficiency:** a trigger whose handler writes back to what triggered it; a retry policy with no attempt cap, backoff, or dead-letter destination, which multiplies invocations exactly when the system is already failing; fan-out with no ceiling; a workflow that commits or tags and thereby retriggers itself with no actor guard or path filter; polling, or an effect with an unstable dependency, firing a metered call per render; a shared cache expiry driving a synchronized burst at a metered origin. **A budget alert notifies; it does not stop spend.**

**Then efficiency, and every such finding names the billing dimension the change moves:** egress, invocations and duration, per-operation database billing, storage, build minutes, logs and telemetry, or model calls. A finding naming none of them is describing inefficiency rather than cost. Egress is the dimension most often missed and frequently the largest, and build minutes turn on a runner multiplier that must be read from the provider's current published rates rather than asserted from memory.

**A finding names the dimension, never a price.** Do not write a currency amount or reprint a published rate into a finding: rates change, and a reader cannot check the number against the provider from inside the diff.

An optimization that introduces a cache, a queue, or another service can cost more than it saves once its own bill is counted.

What each dimension is metered by, what moves it, and the per-dimension procedures for egress, bytes scanned, and build minutes are in [`cost-and-billing.md`](cost-and-billing.md). Open it when this category is entered.

## 18. Regulatory and compliance

Determine which regulations apply from the data the system holds, the people it holds it about, and where it operates. State which are in scope and why, and state which you ruled out and why. Common examples are GDPR, HIPAA, PIPEDA, CCPA and CPRA, and provincial or state equivalents. **The list is not the check; the determination is.** For each in scope: data subject rights, breach notification, processing agreements, and privacy impact assessments.
