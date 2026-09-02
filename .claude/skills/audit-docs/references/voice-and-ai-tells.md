# Voice and AI tells

A formal, neutral register is correct for technical documentation. Prose reads as machine-generated because of a small set of recurring constructions layered on that register, not because of the formality, so the work is to cut the constructions and keep the register.

- [Scope limit: only prose you add or change](#scope-limit-only-prose-you-add-or-change)
- [Signposting previews that announce content instead of giving it](#signposting-previews-that-announce-content-instead-of-giving-it)
- [Puffery copulas that assert significance](#puffery-copulas-that-assert-significance)
- [The rule-of-three triad as a default rhythm](#the-rule-of-three-triad-as-a-default-rhythm)
- [Filler transitions at high frequency](#filler-transitions-at-high-frequency)
- [Formulaic conclusions and manufactured tension](#formulaic-conclusions-and-manufactured-tension)
- [Padded vocabulary, its replacements, and the words that stay](#padded-vocabulary-its-replacements-and-the-words-that-stay)
- [Hedging that dodges commitment](#hedging-that-dodges-commitment)
- [Prose that restates the code instead of adding to it](#prose-that-restates-the-code-instead-of-adding-to-it)
- [Show, do not tell: the cited fact that earns the adjective](#show-do-not-tell-the-cited-fact-that-earns-the-adjective)
- [Leading with the point and letting sentence length follow content](#leading-with-the-point-and-letting-sentence-length-follow-content)
- [Self-check for a paragraph you just wrote](#self-check-for-a-paragraph-you-just-wrote)

## Scope limit: only prose you add or change

Apply this catalogue to sentences you write, and to sentences you rewrite for a factual reason. Accurate existing prose stays as its author wrote it, tells and all: rewriting it for rhythm produces a diff no reviewer can check against the code, and it buries the factual corrections that were the point of the audit. Two cases cross back into scope. A sentence that contradicts the code is rewritten because it is wrong, and the replacement follows this file. A hedge concealing an unverified claim is an accuracy defect, so it is resolved by verification or deletion rather than preserved as someone's style.

## Signposting previews that announce content instead of giving it

Delete the announcement and open with the content. The grammatical subject gives the tell away: it is the document (this section, this guide, the table below, we) rather than the system being described. A heading already performs the announcement, and the same construction reappears mid-document as "as mentioned above", which orients the reader inside the page instead of inside the software.

- Before: "This section covers the retry configuration and explains how it applies to outbound requests."
- After: "An outbound request that fails is retried rather than surfaced to the caller. It retries three times, with the count read from `MAX_ATTEMPTS` once at startup."

The repair deletes the announcement, not the orientation. The subject moves from the document to the system, and the first clause still says what the thing is, because a reader who does not already know what a retry configuration is cannot enter on the mechanism sentence alone.

## Puffery copulas that assert significance

Replace the copula with the verb that names what the subject does. `serves as`, `stands as`, `is a testament to`, and `plays a vital role in` fill the predicate without stating a behaviour, so none of them can be grounded in a line of code. Test by deleting the sentence and asking what a reader can no longer predict; if the answer is nothing, it stated no behaviour. One survivor: `acts as` is correct where it names a relationship the code implements, such as a type acting as an adapter between two interfaces, because the adapter is a fact rather than a compliment.

- Before: "The scheduler serves as the backbone of the ingestion pipeline and plays a pivotal role in throughput."
- After: "The scheduler assigns each ingestion batch to a free worker, and holds the batch in the queue while every worker is busy."

## The rule-of-three triad as a default rhythm

Three parallel items are correct when the set has three members, and generated-sounding when they arrive from cadence instead of a count. Three transport types or three lifecycle hooks stay, each one named. Three adjectives, or three abstract nouns circling one idea, come from rhythm. The check is to count the members in the source, then drop the third item and confirm whether the sentence lost information or only lost its cadence.

- Before: "The cache layer is fast, reliable, and scalable, giving developers speed, confidence, and peace of mind."
- After: "The cache holds 10,000 entries and evicts the least recently used one on overflow. A miss falls through to the primary store."

## Filler transitions at high frequency

Keep a transition that marks a logical turn, and cut one that marks only that another sentence has started: the tell is density, not vocabulary. Count sentence-initial connectives per paragraph, and treat more than one, or any two in consecutive sentences, as a signal that the paragraph is a list wearing prose clothing. Either join the sentences or make it a real list. `however` and `instead` earn their place when the clause that follows contradicts the one before it; `additionally` rarely does, because sequence already implies addition.

- Before: "Additionally, the parser accepts a leading byte-order mark. Furthermore, it rejects a trailing comma. Moreover, it lowercases header names."
- After: "The parser accepts a leading byte-order mark, rejects a trailing comma, and lowercases header names."

## Formulaic conclusions and manufactured tension

Stop when the facts stop. A closing paragraph that restates the section adds no fact, and the "despite its strengths, it faces challenges" shape invents a tension no source states. Where a limitation is real, state it at the point it bites, with its source: "The queue drops the oldest message once depth passes `QUEUE_MAX`." A limitation you cannot cite goes into your report to the human, never onto the page.

- Before: "In conclusion, the queue is a strong solution, though despite its strengths it faces challenges at scale."
- After: nothing at all. The paragraph is deleted, because the depth limit and the drop behaviour were already stated where they apply.

## Padded vocabulary, its replacements, and the words that stay

Substitute the plain word, which carries the same meaning and does not pattern-match to generated text.

| Padded word  | Write instead                             |
| ------------ | ----------------------------------------- |
| `delve into` | examine, read, or name the action         |
| `leverage`   | use                                       |
| `underscore` | show                                      |
| `showcase`   | show, list                                |
| `intricate`  | name the specific complication            |
| `vibrant`    | delete                                    |
| `foster`     | cause, allow, or name the mechanism       |
| `tapestry`   | delete                                    |
| `seamless`   | state what the reader does not have to do |
| `utilize`    | use                                       |
| `facilitate` | name what it actually does                |

**A substitution inside a Markdown table cell is where this catalogue does its damage.** The mapping above changes the length of a cell, and re-padding the row to match is what breaks the table. Leave the cell ragged. Every row keeps the same number of `|`-separated cells as the header and the delimiter row, a cell stays on one line with no newline or bullet list inserted into it, a literal `|` inside a cell is written `\|`, and no substitution is a reason to re-flow, re-wrap, or restructure the table around it. Prefer leaving a cell as its author wrote it over making a table you then have to repair, and count the cells in every row after any edit inside one.

Do not run the table as a find-and-replace, because several entries are also ordinary technical terms and removing one would make the sentence wrong. A word stays when it names something that exists in the system: a test `harness` is a component, an OAuth `realm` is a protocol field, a library or module whose name happens to be one of these words keeps its name, and a word inside a quoted specification or error string stays as quoted. A word goes when it modifies something to make it sound larger than it is. The replacement for `seamless` is almost always a concrete negative fact, which is what makes the claim checkable.

- Before: "The adapter leverages the connection pool to facilitate seamless failover across regions."
- After: "The adapter borrows a connection from the pool, and retries against the secondary region when the primary does not answer within two seconds. No restart or re-authentication is required of the caller."

## Hedging that dodges commitment

Treat a hedge as an accuracy failure first and a voice failure second. `appears to`, `seems to`, `likely`, `generally`, and `is designed to` admit a sentence to the page without evidence, so the repair is verification or deletion, never a bolder synonym. `should` is banned outright, including where it states a caller obligation, because the two readings are indistinguishable on the page. Write the obligation as a fact or an imperative instead: "the caller closes the handle before the process exits", not "callers should close the handle".

- Before: "The worker should retry the request, and generally handles transient network errors."
- After: "The worker retries once on a connection timeout and raises on every other error class." Where the body was not read, no sentence is written and the symbol is listed as unverified in the output.

## Prose that restates the code instead of adding to it

Cut any sentence a reader could reconstruct from the declaration. Prose earns its place by carrying what a signature cannot: why the thing exists, what the caller owes it, what happens at the boundary, and what a value means at its limits. The exception is consumer-facing reference material, whose readers cannot open the source, so stating what the function does is the entire job.

```python
# Restates the signature:
def set_timeout(seconds: int) -> None:
    """Sets the timeout to the given number of seconds."""

# Adds the meaning of 0 and a boundary the caller cannot see:
def set_timeout(seconds: int) -> None:
    """Bound every request opened after this call; 0 removes the bound.
    A pooled connection keeps the value it held when it was created.
    """
```

```go
// Restates: Close closes the writer.
// Adds: Close flushes buffered rows before releasing the file handle, and
// a write after Close returns ErrClosed rather than panicking.
func (w *Writer) Close() error
```

Procedure: cover the prose and read only the declaration. Anything you can still answer needs no sentence. Anything you cannot answer, and can prove from the body you read this run, is the sentence to write. **Apply it with the same two exceptions the rule above carries**, since a procedure stated without them is stricter than the rule it implements: a reader who cannot open the source, and a reader who has not yet been told what the subject is, are both owed the plain statement of what the thing does.

## Show, do not tell: the cited fact that earns the adjective

Replace the adjective with the measurement, limit, or named edge case that made you reach for it. This one move is what keeps objective prose from going flat, since the fact is more informative than the adjective and it arrives with a source. For each adjective in the draft, name what you read that makes it true: a value, a count, a timeout, an error type, or a branch replaces it directly. When nothing comes to mind, the adjective was a guess, so delete it and write no replacement.

- Before: "The connection pool is robust and the token refresh is efficient."
- After: "The pool opens at most 16 connections and blocks a caller for up to 5 seconds before raising `PoolTimeout`. A token is refreshed 60 seconds ahead of expiry, and a failed refresh returns the existing token until that expiry passes."

## Leading with the point and letting sentence length follow content

Put the conclusion in the first sentence of the paragraph, then the qualification and the evidence, because a paragraph that builds toward its point hides the answer from anyone skimming first lines. The section-level version of that test is to read only the first sentence under each heading, in order: if that sequence does not summarize the document, the paragraphs are ordered as narration rather than as answers. Length follows the same principle of fitting the content. A compound fact takes a compound sentence and a consequence takes a short one, while a uniform run and an audible alternation both read as a pattern imposed on the facts. Do not count words, and do not split a sentence that is doing one job.

- Before (order): "There are several considerations when configuring the export job. Batch size interacts with memory, since the connector holds a full batch before writing. Therefore a batch above 5,000 rows risks exhausting the container limit."
- After (order): "Keep the export batch at or below 5,000 rows. The connector holds a full batch in memory before writing, so a larger batch can exhaust the container memory limit."
- Before (length): "The parser reads the header. The parser validates the checksum. The parser emits the rows."
- After (length): "The parser reads the header and validates its checksum before emitting any row. A mismatch aborts the file, so no partial output reaches the consumer."

## Self-check for a paragraph you just wrote

Run these over a paragraph **you wrote or rewrote this run**, before moving on. Every yes is an edit to that paragraph, not a note for later, and not a licence to reach into prose the scope limit above puts out of bounds.

**Two places these questions do not reach.** Accurate existing prose, which stays as its author wrote it. And the inside of a table cell, where the answer is to leave the cell alone: a cell is terse by design, so questions 1, 5, and 6 misfire on one, and editing it risks the table for a rhythm gain no reader gets.

1. Does the opening sentence announce, preview, or wind up, instead of stating the point?
2. Is a copula (`serves as`, `stands as`, `plays a role in`) standing in for a verb that names a behaviour?
3. Is there an adjective you cannot replace with a number, a limit, an error type, or a case you read this run?
4. Are there two or more sentence-initial connectives, or two in consecutive sentences?
5. Does a group of three come from the rhythm rather than from a count in the source?
6. Would a reader holding only the declaration learn nothing new here? A yes is an edit only where that reader can open the declaration and already knows what the subject is; an opening sentence and consumer-facing reference material both answer yes by design.
7. Does a hedge survive anywhere, including a `should` that reads as a caller obligation?
8. Is this paragraph a summary of the paragraphs above it? An opening that orients a first-time reader is not one, since it summarizes nothing above it.
9. Did you change a sentence that was already accurate? Restore it.
