# Environment parity and observability

Both lenses ask what happens to this code once it leaves the machine it was written on. Parity covers behaviour that changes between a developer machine, a hermetic or ephemeral container, and each deployed environment. Observability covers whether someone can diagnose a failure in a deployed environment without reproducing it locally.

**Reading the examples in this file.** Each fenced block holds a pair, the defect first and the corrected form second, with a comment above each half stating which of the two it is. Both halves are illustrations for a reviewer to read, not commands for this review to run.

- [Reading a diff for parity risk](#reading-a-diff-for-parity-risk)
- [Configuration, hosts, paths, and flags](#configuration-hosts-paths-and-flags)
- [Clock, locale, and randomness](#clock-locale-and-randomness)
- [Filesystem case, separators, and container networking](#filesystem-case-separators-and-container-networking)
- [Flaky tests as parity defects](#flaky-tests-as-parity-defects)
- [Deciding whether a failure is debuggable remotely](#deciding-whether-a-failure-is-debuggable-remotely)
- [Log level, structure, and correlation](#log-level-structure-and-correlation)
- [Metrics and alerts for each new failure mode](#metrics-and-alerts-for-each-new-failure-mode)
- [Data that must not reach logs or traces](#data-that-must-not-reach-logs-or-traces)
- [Writing the finding](#writing-the-finding)

## Reading a diff for parity risk

For each changed line, ask which of three contexts it was written against (a developer machine, an ephemeral container in continuous integration, a deployed environment), then ask what the other two supply. A finding exists when the answer for one context is "nothing" or "something different" and the code does not detect that. Three signals are worth searching the diff for before reading it line by line:

- reads of the process environment, and the absence of a matching entry in the example configuration file or the deployment manifest;
- string literals containing `://`, `localhost`, `127.0.0.1`, a port number, or a leading `/` or drive letter;
- any call returning the current time, a random value, or a directory listing.

## Configuration, hosts, paths, and flags

A read with no default and no startup validation fails at first use, inside whichever request happens to need it, instead of at boot where a deployment check would catch it.

```go
// Fails on the first request reaching this branch, in whichever environment lacks the value.
endpoint := os.Getenv("BILLING_ENDPOINT")

// Fails at start, in every environment that lacks the value.
endpoint, ok := os.LookupEnv("BILLING_ENDPOINT")
if !ok {
	return fmt.Errorf("BILLING_ENDPOINT is not set")
}
```

A default that is correct locally and wrong when deployed is worse than no default, because nothing fails: `debug = os.environ.get("DEBUG", "true")` ships verbose errors to users rather than raising at boot.

Checklist for this group:

- an environment variable read with no default and no startup validation, or added without a corresponding entry in the example configuration and the deployment manifest;
- a hardcoded host, port, URL, or absolute path (`/var/data/cache`, `C:\temp`, `http://localhost:8080`) where a deployed environment uses another;
- seed, fixture, or sample data assumed present: the code reads a row, a bucket object, or a file that a freshly provisioned environment does not have;
- a feature flag whose default differs per environment, so the branch exercised by the tests is not the branch that runs when deployed; check which default the tests run under before judging the coverage;
- a secret read from a developer's local file rather than from the deployment's secret source.

## Clock, locale, and randomness

A date parsed or rendered without an explicit zone takes the host zone, so the test passes in one UTC offset and fails in another. Continuous integration commonly runs in UTC while a developer machine does not, which is why this class surfaces first as a build failure nobody can reproduce.

```ruby
# Interprets the value in the host's zone, so the resulting day shifts with the offset.
Date.parse(row["due_at"]).strftime("%F")

# Interprets it in a stated zone.
Time.parse(row["due_at"]).utc.strftime("%F")
```

The same applies to locale-sensitive formatting: decimal separator, currency symbol and placement, collation order relied on by a sorted assertion, and case mapping (in Turkish, lowercasing `"ID"` yields a dotless i, so a case-insensitive comparison stops matching). Wall clock and randomness that continuous integration cannot reproduce must be injectable, so check whether the change reads the clock or the random source directly rather than accepting a clock, a seed, or an identifier generator as a parameter.

## Filesystem case, separators, and container networking

- Case sensitivity: a developer machine may use a case-insensitive filesystem while the container image does not, so a reference to `./Widget` that resolves locally and fails in the image is a parity defect rather than a build flake. Flag a rename that changes only letter case, since some version control configurations do not record it.
- Separators: a path assembled by concatenating `/` or `\` instead of the platform join function, a split on a separator character, or a glob written with one separator style.
- Container against host networking: `localhost` inside a container is that container, not the host and not a sibling container. An address that works when both processes share a machine has to become a service name or an injected address once one side is containerized. Check the bind address too: a server bound to `127.0.0.1` inside a container is unreachable from outside it, while `0.0.0.0` is reachable.
- Also in this group: an absolute path baked into an image whose mount point differs, a file written to a container filesystem that is discarded on restart, and a user identifier or umask difference that makes a written file unreadable to the next process.

## Flaky tests as parity defects

The causes overlap with everything above, so review them here rather than as a separate concern. Each item is a check against the changed test and the code it drives:

- a wall-clock read or date arithmetic where the test asserts a formatted value or an elapsed duration, including anything asserting "today" that breaks near midnight or at a month boundary;
- unseeded randomness: a random identifier, a shuffled fixture, or a property-based test whose failing seed is not printed;
- iteration order of a map, set, or directory listing relied on as stable; some languages randomize map order per run, so the test fails at a rate rather than always;
- a promise, future, or task started and not awaited, so the assertion runs before the effect lands, or the rejection surfaces inside a later unrelated case;
- a real network call, or a fixed sleep, inside a test: a sleep encodes a timing guess, so wait on the condition instead;
- state shared between cases through a module-level variable, a singleton, a reused temporary directory, or a database row that is not rolled back; a case that passes alone and fails in the suite, or that depends on file ordering, points here;
- an assertion racing an animation, a transition, or a debounce timer.

A test that a rerun turns green is not fixed. The reviewer question is: what makes this pass, and is that thing guaranteed or merely usual?

## Deciding whether a failure is debuggable remotely

Take the least likely branch in the change, the one that fires under load or on malformed input, and ask what evidence would exist in the deployed environment when it fires. If the answer is a status code with no record naming which input and which stage produced it, the finding is a missing signal rather than a stylistic preference. The recurring shapes are a catch returning a fallback value and recording nothing, an event that pages someone logged at `debug`, and a line reading "request failed" with no identifier joining it to the request that failed.

## Log level, structure, and correlation

Match the level to the event: `error` for something a human must act on, `warn` for a degraded path that continued, `info` for a state transition worth counting, `debug` for detail suppressed when deployed. A recovered condition logged at `error` produces alert noise that trains people to ignore the channel; a lost write logged at `info` is invisible.

Prefer fields to an interpolated sentence, because fields can be filtered and aggregated and a sentence can only be searched as a substring.

```python
# Requires a substring search, and the order identifier cannot be filtered on.
logger.error(f"could not settle order {order_id} for {customer_id}: {exc}")

# Fields are queryable, and the message text stays constant across occurrences.
logger.error("order settlement failed", extra={"order_id": order_id, "error_type": type(exc).__name__})
```

The correlation or trace identifier is usually dropped at an asynchronous boundary: a queue publish, a thread pool submission, a scheduled callback, a retry that runs later. Confirm the identifier travels inside the message or the propagated context, not only in a variable on the calling stack.

```java
// The pooled thread has no access to the request context, so its logs cannot be joined to the request.
executor.submit(() -> reconcile(accountId));

// The identifier travels with the work.
String traceId = currentTraceId();
executor.submit(() -> reconcile(accountId, traceId));
```

A caught error that is logged and then dropped never reaches the project's error tracker, so nobody sees its rate or its stack. Check which reporting call the surrounding code already uses and whether the new catch uses it, and check that wrapping preserves the cause: a re-raise that discards the original removes the line that actually failed.

## Metrics and alerts for each new failure mode

A new failure mode is a branch that can fail in a way the existing signals do not count: a new external call, a new retry, a new queue, a new validation rejection. For each one, answer three questions. Which counter or timer moves when it happens? Would a rise from zero to a steady rate be visible to anyone not already looking? Who is notified, and does the notification name the failing component rather than an aggregate that hides it?

Label cardinality is the failure mode of the fix. A label holding a user identifier, a full path, or an error message creates one time series per distinct value, and series are stored and billed individually.

```text
# Unbounded: one series per user and per concrete path.
checkout_failures{user="u-8123", path="/orders/8123/settle"}

# Bounded to a small set of values.
checkout_failures{reason="payment_declined", route="/orders/:id/settle"}
```

## Data that must not reach logs or traces

Personal or health data, passwords, tokens, keys, session identifiers, and full request or response bodies stay out of every log line, span attribute, metric label, and error report. Two habits deserve a direct check:

- an object logged whole, such as a serialized model or a captured payload, which picks up each field added to that type after the line was written; log named fields instead;
- an error path attaching the request body or the headers "for context", which captures the authorization header along with everything else.

Where the record needs an identifier, use one that means nothing outside the system: a request identifier rather than an email address, a truncated or hashed value rather than a whole token, a record identifier rather than the record.

## Writing the finding

A parity finding names both contexts and the divergence: "reads `BILLING_ENDPOINT` with no default, and the deployment manifest does not set it, so the first request that reaches this branch after deploy raises". An observability finding names the incident: "when this catch fires, the only evidence is a 500 with no order identifier, so the report cannot be traced to an order". Both quote the changed line. Where the deployment configuration is not visible to you, the finding has to stand on what the changed line shows by itself, such as a read with no validation or a literal address; the fix is the part you label unverified, naming the file that would confirm it.
