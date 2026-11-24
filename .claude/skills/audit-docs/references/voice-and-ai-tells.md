# Voice and AI tells

This file shows the target style for every sentence the audit writes: plain, formal English that a developer understands on the first read. The examples teach the style better than a list of words to avoid, so read them before you write.

## Contents

- [The target style](#the-target-style)
- [Examples of the target style](#examples-of-the-target-style)
- [What makes prose read as generated](#what-makes-prose-read-as-generated)
- [Comments follow the same style, shorter](#comments-follow-the-same-style-shorter)
- [Scope: only prose you add or change](#scope-only-prose-you-add-or-change)
- [The rewrite pass](#the-rewrite-pass)

## The target style

- **Write for a person.** The reader is a developer who reads the page once. Write to explain the system to that developer.
- **Write complete, grammatical sentences.** Each one has a subject and a verb and carries one idea. Use "it", "this", and ordinary transitions such as "however" or "so" wherever the meaning stays clear. Repeat the noun only where "it" could point at two things.
- **Lead with the point.** The first sentence of a paragraph gives the answer; the detail follows.
- **State what the code does.** Write the behaviour you read and nothing you worked out from it. A consequence or scenario goes in only when a test, a comment, or a document states it.
- **Stop when the facts stop.** No closing summary, and no sentence that announces what the next sentence will say.
- **Stay formal and neutral.** No contractions, no em-dashes or en-dashes, and no hedging. Use Canadian spelling in what you write.

## Examples of the target style

Each pair shows a draft and the sentence to write instead. The rewrite is never longer than the fact needs.

**Example 1.**
Draft: "This section covers the retry configuration and explains how it applies to outbound requests."

Write: "A failed outbound request is retried three times. The count comes from `MAX_ATTEMPTS`."

**Example 2.**
Draft: "The scheduler serves as the backbone of the ingestion pipeline and plays a pivotal role in throughput."

Write: "The scheduler assigns each ingestion batch to a free worker."

**Example 3.**
Draft: "The connection pool is robust, reliable, and efficient, giving developers confidence and peace of mind."

Write: "The pool opens at most 16 connections and raises `PoolTimeout` after waiting 5 seconds for one."

**Example 4.**
Draft: "The worker should retry the request, and it generally handles transient network errors."

Write: "The worker retries once on a connection timeout and raises on any other error."

Where you did not read the body, write nothing and list the claim as unverified in the report.

**Example 5.**
Draft: "In conclusion, the queue is a strong solution, though despite its strengths it faces challenges at scale."

Write nothing. Delete the paragraph; the queue's limits are already stated where they apply.

## What makes prose read as generated

A formal register is right for technical writing. Prose reads as generated because of a few habits, not because it is formal. Each habit has a plain alternative:

- **Announcing instead of saying.** A sentence whose subject is the document ("this section", "the table below") is announcing. Start with the system instead.
- **Asserting significance.** A sentence that calls something central, key, or vital states no behaviour. Name what it does.
- **Adjectives without facts.** Replace an adjective with the number, limit, or error type that earns it. If you have none, drop the adjective.
- **Groups of three from rhythm.** List three items only when the code has three.
- **Inferred consequences.** A sentence that chains "so", "which means", or "as a result" into a scenario the code does not state is a guess. Write the behaviour and stop.

## Comments follow the same style, shorter

A comment you write is one sentence, or two when the second states an error, a constraint, or a caller duty you can quote.

**Example 1.**

```go
// Close flushes buffered rows, then closes the file.
func (w *Writer) Close() error {
```

**Example 2.**

```python
def set_timeout(seconds: int) -> None:
    """Sets the timeout for every request opened after this call; 0 removes it."""
```

**Example 3.**

```go
// Package auth issues and verifies signed session tokens for the API.
package auth
```

A package comment says what the package is for. It does not describe members that have their own comments.

An existing comment on a public symbol that only restates the name, such as `// Close closes the writer.`, is the one-sentence floor. Keep it as written.

## Scope: only prose you add or change

Apply this file to sentences you write and to sentences you rewrite because they were wrong. Leave accurate existing prose as its author wrote it. Rewriting it for style produces a diff no reviewer can check against the code, and it hides the factual corrections that were the point of the audit. A hedge that hides an unverified claim is an accuracy problem, so resolve it by checking the code or deleting the sentence.

Inside a Markdown table cell, leave the wording alone unless it is wrong. Editing a cell for style risks breaking the table.

## The rewrite pass

After you write a paragraph or a comment, reread each sentence once.

1. Does it read as ordinary English on the first pass? If not, rewrite it plainly.
2. Does it say what the code does, rather than what follows from it? If it states a consequence no source states, cut that part.
3. Is it the shortest sentence that still carries the fact? If a shorter one loses nothing, use it. Never cut a definition, a unit, or a condition to save words.
4. Did you change a sentence that was already accurate? Restore it.
