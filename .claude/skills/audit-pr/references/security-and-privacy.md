# Security and privacy checks for a code review

Operational detail for the security and privacy categories named in `SKILL.md`. Each check below states what to look for in the changed lines, what neutralizes it, and the refutation that turns a suspicion into a dropped finding.

- [Name the source, the sink, and the neutralizing boundary](#name-the-source-the-sink-and-the-neutralizing-boundary)
- [Findings that protect the end user](#findings-that-protect-the-end-user)
- [Findings that protect the host and the organization](#findings-that-protect-the-host-and-the-organization)
- [Findings that protect the developer and the build](#findings-that-protect-the-developer-and-the-build)
- [Ten OWASP areas and the check that applies to each](#ten-owasp-areas-and-the-check-that-applies-to-each)
- [Ten OWASP areas for model and agent code](#ten-owasp-areas-for-model-and-agent-code)
- [Model output used unvalidated as a path, query, command, or URL](#model-output-used-unvalidated-as-a-path-query-command-or-url)
- [Privacy from collection through to deletion](#privacy-from-collection-through-to-deletion)
- [Secrets that must never reach a log, and how they arrive there](#secrets-that-must-never-reach-a-log-and-how-they-arrive-there)
- [Severity for a security or privacy finding](#severity-for-a-security-or-privacy-finding)

## Name the source, the sink, and the neutralizing boundary

Write no security finding until you can name three things from lines you opened: the **source** (where the value entered, such as a request field, a header, a filename, a queue message, a database row written by another tenant, or a model response), the **sink** (the call that gives the value power, such as a query, a shell, a filesystem path, a template, a redirect, or a deserializer), and the **boundary** that was supposed to neutralize it between the two.

The finding is one of three shapes: no boundary exists, the boundary is the wrong kind for that sink (escaping applied where parameterization is needed), or the boundary runs on a different branch than the one the source reaches. If you cannot trace the path from source to sink through code you read, say you could not determine it rather than reporting it.

## Findings that protect the end user

Their data, session, device, and browser. Check the changed lines for: markup or a template built by concatenation with caller-supplied text, where the sink is rendered as HTML rather than as text; a session cookie without an http-only flag, a secure flag, and a same-site policy; a session identifier that survives a privilege change such as sign-in, sign-out, or a password reset; a redirect target read from a parameter with no allowlist; a cross-origin policy widened to any origin while credentials are allowed; a state-changing request reachable without an anti-forgery token or an equivalent origin check; an authorization decision made from a value the caller controls, such as an identifier in the body rather than the authenticated subject; an error response that returns the raw exception; and a client-side storage write holding a token or personal data.

Refute before reporting: an auto-escaping template neutralizes markup unless the change opts out through a raw or unsafe helper, and a framework that verifies the anti-forgery token in middleware covers a handler that never mentions it.

## Findings that protect the host and the organization

Server-side request forgery is the one most often reached through a helper: the check is a request whose **host** comes from caller data, not merely its path. A fixed base with an interpolated path segment is not this finding.

```go
// Finding: the host comes from request data, so the server fetches any address the caller names.
resp, err := http.Get(req.FormValue("target"))

// Fix: resolve the caller value against a fixed set of full URLs, and never build the host from it.
endpoint, ok := allowedEndpoints[req.FormValue("target")]
if !ok {
	return errUnknownEndpoint
}
resp, err := http.Get(endpoint)
```

The rest of this direction, each with its trigger in the diff: command injection, where a value reaches a shell string rather than an argument array; path traversal, where a joined path is not compared against the resolved parent directory after normalization, which is what catches `..` and symbolic links together; unsafe deserialization, where a format that can instantiate arbitrary types reads bytes the caller supplied; resource exhaustion, where a request body, an upload, a decompression ratio, a regular expression over caller input, a page size, or a recursion depth has no ceiling; privilege escalation, where a role or tenant identifier is read from the payload; over-scoped tokens, where a new credential is granted write or admin scope for a read; and log injection, where a value that can contain a newline reaches a line-oriented log sink and lets a caller forge log entries.

Also read the diff as a public artifact. Internal hostnames, bastion or admin URLs, employee names in comments or fixtures, ticket numbers that describe an unpatched weakness, internal address ranges, and bucket or queue names all become public with the commit. Generated source maps and bundled comments carry the same content into a browser, so treat a build configuration that publishes them as the same finding.

## Findings that protect the developer and the build

Ask whether cloning, installing, building, or opening the repository can compromise the machine that does it. Check: a dependency whose install-time hook or native build descriptor runs code, judged by capability rather than by field name; a package name that differs by a character from the intended one, or a source other than the project registry, including a git URL or a tarball; an editor, container, or task configuration that executes on open; a build step that downloads and runs a script from a network location; a workflow that checks out an untrusted contribution while holding write permission or secrets; a third-party build action pinned to a mutable tag rather than an immutable commit identifier; a self-hosted runner reachable from forks; and a checked-in agent rule, skill, or settings file that grants tool access to anyone who trusts the repository. A valid provenance attestation does not establish that a release is safe, because a compromised maintainer account can produce one.

## Ten OWASP areas and the check that applies to each

Where a project tracks an earlier edition of the list, server-side request forgery and vulnerable components appear as areas of their own and are covered above.

| Area                                  | Check the changed lines for                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Broken access control                 | A handler with no authorization call, or one that checks authentication and never ownership            |
| Security misconfiguration             | A default credential, a debug or verbose flag, a widened permission, an exposed admin path             |
| Software supply chain failures        | An added dependency, a widened version range, a changed integrity hash, a new build action             |
| Cryptographic failures                | A hand-rolled primitive, a fixed initialization vector or salt, a fast hash for a password, plain HTTP |
| Injection                             | Concatenation into a query, a shell, a path, a template, or a header                                   |
| Insecure design                       | A missing rate limit, no lockout, a recovery flow that trusts an unverified address                    |
| Authentication failures               | A session identifier reused across a privilege change, a token with no expiry, a weak comparison       |
| Software and data integrity failures  | An unsigned update, an unverified download, a deserializer over untrusted bytes                        |
| Logging and alerting failures         | A new failure mode that emits nothing, an authorization denial that is not recorded                    |
| Mishandling of exceptional conditions | A caught error that continues on the success path, a partial write left uncompensated                  |

## Ten OWASP areas for model and agent code

Enter this table when the diff builds a prompt, calls a model, reads a model response, indexes or queries embeddings, or grants a tool to an agent.

| Area                             | Check the changed lines for                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Prompt injection                 | Retrieved text concatenated into instructions with no delimiter or trust label                     |
| Sensitive information disclosure | Personal, health, or credential data placed in a prompt, a trace, or a retained transcript         |
| Supply chain                     | A model, adapter, or dataset pulled from an unpinned or community source with no integrity check   |
| Data and model poisoning         | A training, fine-tuning, or index-ingestion path that accepts caller-supplied records unreviewed   |
| Improper output handling         | A model response reaching a renderer, parser, or executor without validation                       |
| Excessive agency                 | A tool granted write, delete, payment, or network scope beyond the task, with no confirmation step |
| System prompt leakage            | Instructions, keys, or rules in a system prompt that the model can be asked to repeat              |
| Vector and embedding weaknesses  | A shared index with no per-tenant query filter, or raw personal data inside embeddings             |
| Misinformation                   | A model answer presented as fact with no citation, no confidence path, and no human step           |
| Unbounded consumption            | No token ceiling, no request quota, no retry cap, and no cost alarm on a metered call              |

## Model output used unvalidated as a path, query, command, or URL

**This is a named finding whenever it appears.** A model response is untrusted input with a persuasive tone; treat it exactly as a request body. The fix depends on the sink: an allowlist lookup for an identifier or a path segment, a parameterized statement for a query, an argument array for a command, and a host allowlist for a URL. Escaping is not a substitute for any of the four.

```python
# Finding: the model chose the file name and the shell parses it.
subprocess.run(f"convert {model_choice} out.png", shell=True)

# Fix: map the model choice onto a value the allowlist already holds, then pass an argument array.
if model_choice not in known_inputs:
    raise ValueError("unknown input")
subprocess.run(["convert", known_inputs[model_choice], "out.png"])
```

## Privacy from collection through to deletion

Follow the data, not the field name. For each personal or health value the diff touches, answer: where it is collected, why the feature needs it, where it is written, who can read it, how long it is kept, and what deletes it.

- **Minimization at the point of collection.** Redacting at the log line is late. If the feature needs an age band, collect the band and not the birth date; if it needs a country, do not store the address.
- **Retention.** A new store, table, bucket, or index with no expiry policy is a finding, and so is a backup or export that outlives the record it copies.
- **Transit and rest.** Plain HTTP or an unverified certificate on any hop carrying personal data; an unencrypted volume, snapshot, or export; a key stored beside the data it protects.
- **Access control.** A query without a tenant or subject filter, a broadened role, a shared read credential, and an administrative view that returns full records where identifiers would do.
- **Third-party egress and cross-border transfer.** A new analytics, session-replay, error, or advertising integration sends data to a party the notice may not name, often including URLs, form contents, and device identifiers by default. Record which region receives it.
- **Telemetry defaults.** Collection that is on unless the person opts out, in a jurisdiction or a product surface that requires consent first.
- **Source maps and stack traces.** A trace shown to a user leaks internal structure; a published source map leaks the same to anyone. Neither belongs in a response body.

```ruby
# Finding: the whole profile is collected and retained though only the age band is used.
Analytics.record(user: user.attributes, event: "signup")

# Fix: derive the one field the feature reads and collect nothing else.
Analytics.record(age_band: age_band_for(user.birth_date), event: "signup")
```

## Secrets that must never reach a log, and how they arrive there

Never logged: passwords, tokens, API keys, session identifiers, encryption keys. The value rarely appears as a literal in the diff, so look for the four carriers instead: a structured logger handed a whole request, user, or configuration object; an exception message or a trace that quotes a URL with its query string; a cache key, a metric label, or a span attribute built from an identifier; and a third-party client that captures breadcrumbs, headers, or request bodies by default.

```java
// Finding: the whole request reaches the log and carries the authorization header.
log.info("inbound request: {}", request);

// Fix: log named fields, and strip line breaks from any caller-supplied value.
log.info("inbound request path={} correlationId={}", stripLineBreaks(request.path()), correlationId);
```

A redaction helper is only a defence for the fields it names. If the change adds a field to a logged object, check that the helper covers it.

## Severity for a security or privacy finding

Three questions decide it. Does the data or the capability cross a trust boundary (a browser, a third party, a log aggregator, another tenant)? Is the exposure reversible (a rotated key is, a disclosed birth date is not)? Who can read it afterwards, and for how long?

Blocking is a reachable path from untrusted input to a sink with no boundary, an authorization gap, a secret or personal record written where an unauthorized reader can retrieve it, or an unbounded spend or resource path. Should fix is a weakened defence with another still standing, such as escaping where parameterization belongs. A suggestion is a hardening step with no demonstrated path. Where the path depends on a deployment or configuration value you could not read, report the finding and name that dependency rather than assuming either answer.
