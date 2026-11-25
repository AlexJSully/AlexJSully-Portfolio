# Existing comments: correct, tighten, keep, or delete

An existing comment was written by someone who knew something about the code. The audit's job is to keep that knowledge accurate, not to restyle it. Each pair below shows one outcome of the ordered tests in Phase 3: test 1 runs first, then the first of the other tests that applies decides, a comment test 1 corrected is never deleted, and deletion is the narrowest outcome.

- [Existing comments: correct, tighten, keep, or delete](#existing-comments-correct-tighten-keep-or-delete)
    - [Drifted private comment: correct it](#drifted-private-comment-correct-it)
    - [Verbose private documentation comment: tighten it](#verbose-private-documentation-comment-tighten-it)
    - [Long rationale comment: cut to the decision and its reasons](#long-rationale-comment-cut-to-the-decision-and-its-reasons)
    - [Drifted and long comment: correct it, then tighten it](#drifted-and-long-comment-correct-it-then-tighten-it)
    - [Comment the change added: cut it to the length of a new comment](#comment-the-change-added-cut-it-to-the-length-of-a-new-comment)
    - [In-body comment explaining why: keep it](#in-body-comment-explaining-why-keep-it)
    - [Comment restating the line beneath it: delete it](#comment-restating-the-line-beneath-it-delete-it)
    - [Change narration carrying a current fact: rewrite it](#change-narration-carrying-a-current-fact-rewrite-it)
    - [Outcomes that are defects](#outcomes-that-are-defects)

## Drifted private comment: correct it

The helper is private, which is no reason to remove its comment. The comment is wrong, so it is corrected from the body, keeping the wording that is still true.

Before (TypeScript):

```ts
/** Retries the request up to three times before giving up. */
function withRetry(request: () => Promise<Response>): Promise<Response> {
	return retry(request, { attempts: MAX_ATTEMPTS, backoffMs: 250 });
}
```

After, where `MAX_ATTEMPTS` is `5`:

```ts
/** Retries the request up to `MAX_ATTEMPTS` times, 250 ms apart, before giving up. */
```

## Verbose private documentation comment: tighten it

The summary and the constraint stay; the sentences restating the parameters and touring the body go, by whole sentences.

Before (Python):

```python
def _normalize(path: str) -> str:
    """Normalizes a path.

    This helper function takes a path string as its parameter and returns
    the normalized path string. It first strips whitespace, then lowercases
    the value, then removes any trailing slash.

    Windows drive letters are lowercased too, so callers must not compare
    the result against a raw drive path.
    """
```

After:

```python
def _normalize(path: str) -> str:
    """Normalizes a path.

    Windows drive letters are lowercased too, so callers must not compare
    the result against a raw drive path.
    """
```

## Long rationale comment: cut to the decision and its reasons

A comment that explains a design choice keeps the choice, each reason, and each warning. It loses the history, the alternatives that were not taken, and any sentence that says a kept reason again. Each kept sentence stays word for word.

Before (Rust):

```rust
// We write the index file to a temporary path and rename it into place.
// Originally we wrote the index in place, but a crash halfway through left
// a truncated file that the next start could not parse. We looked at taking
// a file lock instead, but locks are advisory on Linux and another process
// could still read a half-written file. We also tried writing a checksum at
// the end, which detected the problem but did not fix it. Rename is atomic
// on the same filesystem, so readers see either the old index or the new
// one, never a partial one. That is why the temporary file must be created
// in the same directory as the index: a rename across filesystems is a copy
// and is not atomic. This is the main reason for the design. Do not move
// the temporary file to the system temp directory.
let tmp = index_path.with_extension("tmp");
```

After:

```rust
// We write the index file to a temporary path and rename it into place.
// Rename is atomic on the same filesystem, so readers see either the old
// index or the new one, never a partial one. That is why the temporary file
// must be created in the same directory as the index: a rename across
// filesystems is a copy and is not atomic. Do not move the temporary file to
// the system temp directory.
let tmp = index_path.with_extension("tmp");
```

The cut sentences are the history ("Originally we wrote…"), the two alternatives not taken (the lock and the checksum), and "This is the main reason for the design", which restates the reason before it. The warning stays because it is the instruction a maintainer needs.

## Drifted and long comment: correct it, then tighten it

Correcting a comment does not end the audit of it. Test 1 fixes the count, and test 3 still runs on the corrected comment.

Before (Kotlin), where `MAX_RETRIES` is `5`:

```kotlin
// Sends the event batch, retrying up to three times.
// The function takes a list of events and returns true on success.
// It loops over the attempts and calls the client each time.
// The server rejects a batch larger than MAX_BATCH, so the caller must
// split it first.
fun send(events: List<Event>): Boolean = retrying(MAX_RETRIES) { client.post(events) }
```

After:

```kotlin
// Sends the event batch, retrying up to `MAX_RETRIES` times.
// The server rejects a batch larger than MAX_BATCH, so the caller must
// split it first.
fun send(events: List<Event>): Boolean = retrying(MAX_RETRIES) { client.post(events) }
```

The second sentence restates the signature and the third walks through the body. The caller duty stays.

## Comment the change added: cut it to the length of a new comment

The pull request added this comment, so it is new writing under review, not knowledge to preserve. It keeps one sentence saying what the code does and one sentence for the constraint a caller needs.

Before (C#):

```csharp
// Caches the parsed manifest so repeated lookups skip the disk read.
// This is safe because the manifest is immutable once loaded, and
// ConcurrentDictionary guarantees thread-safe access across callers.
// ConcurrentDictionary uses fine-grained locking, so readers never block
// each other. If two threads miss the cache at the same moment, both may
// parse the file, but GetOrAdd keeps one result for every caller. This
// could matter in a busy deployment where many requests arrive at startup.
// The cache is never invalidated, so a manifest edited on disk is not
// picked up until the process restarts.
private static readonly ConcurrentDictionary<string, Manifest> Cache = new();
```

After:

```csharp
// Caches the parsed manifest so repeated lookups skip the disk read.
// The cache is never invalidated, so a manifest edited on disk is not
// picked up until the process restarts.
private static readonly ConcurrentDictionary<string, Manifest> Cache = new();
```

The cut sentences argue the code is safe, explain what `ConcurrentDictionary` does in general, and work out a busy-deployment scenario that no code states. The report lists the safety argument as a reason cut, so the author can move it to the pull request description.

## In-body comment explaining why: keep it

The comment names the code beneath it and says why it is written this way, which the code cannot show. It passes the name-the-code test and states a reason, so it stays as written, however short the function.

```go
func (c *Cache) Get(key string) (Item, bool) {
	// Read under the write lock: Get also refreshes the entry's expiry.
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.touch(key)
}
```

## Comment restating the line beneath it: delete it

Every word restates the next line and adds no reason, constraint, edge case, or warning. This is the redundant-comment ground for deletion; the other closed-list grounds also apply, subject to scope.

Before (Java):

```java
// Increment counter
counter++;
```

After:

```java
counter++;
```

## Change narration carrying a current fact: rewrite it

The narration goes; the fact it carries stays, stated in the present.

Before (TypeScript):

```ts
// Now uses the session token instead of the API key, which was removed.
const headers = { Authorization: `Bearer ${session.token}` };
```

After:

```ts
// Authenticates with the session token; this endpoint rejects API keys.
const headers = { Authorization: `Bearer ${session.token}` };
```

The rewrite keeps the claim about API keys only where the endpoint's documentation or code was opened this run. Where it was not, the comment becomes `// Authenticates with the session token.`

## Outcomes that are defects

Each of these removes knowledge the code does not carry, and none is on the closed delete list:

- Deleting a private helper's documentation comment because the helper is private or internal.
- Deleting every inline comment in a function because the function is short.
- Deleting a comment explaining why because it is reasoning rather than description. Cutting the history and the alternatives inside it is tightening, not deletion.
- Replacing a verbose comment with nothing instead of cutting its padding sentences.
- Deleting a comment you are unsure about instead of keeping it and reporting it.
- Trimming a redundant or verbose comment outside the requested scope, where only a drifted comment is corrected.
- Correcting a long drifted comment inside the requested scope and stopping there, without putting it through the verbose test.
- Adding a sentence to a comment the change added when it already holds two.
