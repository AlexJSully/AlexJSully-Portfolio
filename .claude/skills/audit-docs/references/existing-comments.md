# Existing comments: correct, tighten, keep, or delete

An existing comment was written by someone who knew something about the code. The audit's job is to keep that knowledge accurate, not to restyle it. Each pair below shows one outcome of the ordered tests in Phase 3: the first test that applies decides, and deletion is the narrowest outcome.

- [Existing comments: correct, tighten, keep, or delete](#existing-comments-correct-tighten-keep-or-delete)
    - [Drifted private comment: correct it](#drifted-private-comment-correct-it)
    - [Verbose private documentation comment: tighten it](#verbose-private-documentation-comment-tighten-it)
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
- Deleting a comment explaining why because it is reasoning rather than description.
- Replacing a verbose comment with nothing instead of cutting its padding sentences.
- Deleting a comment you are unsure about instead of keeping it and reporting it.
- Trimming a redundant or verbose comment outside the requested scope, where only a drifted comment is corrected.
