# Writing for both readers

Every page has two readers: someone meeting the system for the first time, and someone who already works in it. A page that serves only the second is the ordinary failure, and it is invisible to its author, because the author cannot un-know the system. This file carries the repairs, each as a before and after pair.

## Contents

- The ordering principle, which is how one page serves two readers
- The opening, and what it carries
- Introducing a term of art
- One concept, one spelling
- The worked example
- Choosing the type, and what the type assumes
- Serving the experienced reader on the same page
- Document length as a whole
- The read-it-cold procedure
- What none of this licenses

## The ordering principle, which is how one page serves two readers

Do not split the page, and do not write two of them. Order it: orientation first, depth after, and both in full.

The newcomer reads the top and stops when they have what they came for. The experienced reader skims the top in three seconds and reads the rest. Neither is served by a page that averages the two, which is the shape that produces prose too vague for the expert and too dense for the newcomer at the same time.

Orientation is a small fraction of the page. One to three sentences at the top of a document, and one sentence at the top of a section that introduces something the document has not named yet. It is not a tutorial bolted to the front of a reference.

## The opening, and what it carries

An opening carries three things, and a fourth where it applies: what the subject is, why a reader would reach for it, what that reader must already have or have read, and, where this page is one a reader can arrive at by mistake, where to go instead. A page that opens on mechanism has skipped all of them.

Before, from a caching layer's page:

> The resolver checks `NEGATIVE_TTL` before evicting, so a miss recorded during a partition survives the partition by up to sixty seconds.

After:

> Lookups are cached in front of the directory service so that a repeated name resolves without a network call. Read [the directory service page](../services/directory.md) first if the terms below are unfamiliar. Negative results are cached too, which is the part that surprises callers: the resolver checks `NEGATIVE_TTL` before evicting, so a miss recorded during a partition survives that partition by up to sixty seconds.

The mechanism sentence is unchanged and still leads its own clause. What was added is the three sentences that make it followable, and the experienced reader loses nothing because the specific claim is still there.

**The opening is where a synthesis claim usually lives**, so it is the place the grounding rule bites hardest. Hold a quote from each file carrying a part of the sentence. "Lookups are cached in front of the directory service" is provable from the resolver and the client that calls it, read together; it is not provable from either alone, and that is not a reason to leave it out.

## Introducing a term of art

Expanding an acronym is not introducing it. The expansion of a technical term is often as opaque as the abbreviation, and a reader who could not define the short form cannot define the long one either.

Before, from a synchronization guide:

> Writes go through CRDT (conflict-free replicated data type) merge before the LWW register is applied.

After:

> Writes are merged rather than overwritten, using a conflict-free replicated data type (CRDT), a structure whose merge produces the same result regardless of the order replicas apply it in. A last-writer-wins register then settles the fields the merge leaves ambiguous, using the writer's timestamp.

Two rules operate here. Introduce the term where the document first uses it, in a short parenthesis or by a link to the document that defines it, then use it unchanged. And introduce it once per document rather than once per set, because a reader arriving by search lands in the middle of the set and reads one page.

Where a term is used across many documents, the link is better than the parenthesis, and the target is the page whose subject that term is.

## One concept, one spelling

A concept spelled three ways is three concepts to anyone meeting it, and it defeats their search. This is the cheapest defect to create, because each spelling looks correct in the sentence containing it.

Before, across four documents in one set:

> the retry envelope ... the retry wrapper ... `RetryEnvelope` ... the backoff wrapper

After: one of them, chosen once, used everywhere, with the code identifier written as the code spells it and the prose term matching it.

Check this across the scope rather than within a document. A single document is usually self-consistent; the divergence appears between documents written months apart.

## The worked example

An example a reader copies and adapts is the most legible artifact a page can carry, and it survives the ban on pasted source, which governs source quoted as evidence for a claim rather than an example written to be run.

Two rules make an example work. Write it in the language and file format the reader will actually edit, and label the fence with that language. A block labelled as one format and written in another does not run, and the reader who pastes it discovers that after the error rather than before.

Before, in a page telling the reader to add an entry to a Rust source file:

```json
{
	"name": "example",
	"retries": 3 // optional
}
```

After:

```rust
Job {
    name: "example",
    retries: Some(3), // omit for the default of 1
}
```

The first block is labelled as one format, written in the shape of another, and carries a comment the labelled format forbids. Nothing about it survives a paste.

## Choosing the type, and what the type assumes

The type of a document decides how much it may assume, so choose it before writing and keep the choice visible in the page. Decide it by what the reader needs, not by the subject.

| The content informs | And serves the reader's | So the document is a | Which may assume                                                          |
| ------------------- | ----------------------- | -------------------- | ------------------------------------------------------------------------- |
| Action              | Acquisition of skill    | Tutorial             | Nothing about the system; only that the reader can follow instructions    |
| Action              | Application of skill    | How-to guide         | That the reader knows the goal and the vocabulary, but not this procedure |
| Cognition           | Application of skill    | Reference            | That the reader is working and needs a fact confirmed, not taught         |
| Cognition           | Acquisition of skill    | Explanation          | That the reader is studying, so background and alternatives belong here   |

Two consequences worth stating. A reference may be terse because its reader arrives knowing what they are looking for, but its opening still says what the thing is, since that reader may have arrived from a search engine rather than from the page above. And an explanation is the type most often missing from a set: rationale ends up scattered in single sentences across pages whose subject is something else, where no reader looking for it will find it.

**A set can be complete, accurate, and have no way in.** Every subject documented, every claim true, and nothing that takes a first-time reader through one task end to end. Report that gap by name when the scope reaches the whole set.

## Serving the experienced reader on the same page

The opposite failure is real and this file does not license it. A paragraph the experienced reader could have got faster from the source has not earned its place either.

Before, from a queue client's page:

> The `poll` method takes a `timeout` argument of type `Duration` and returns a list of messages. The `commit` method takes no arguments and returns a result.

After:

> `poll` blocks until at least one message arrives or the timeout elapses, and returns an empty list on timeout rather than an error. A delivered message stays unacknowledged until `commit` returns successfully, so a consumer that exits between the two calls receives that message again on its next `poll`.

The first version restates a signature the reader can open in less time than the sentence takes to read. The second gives a boundary, an invariant, and the consequence a caller plans around.

The repair for this failure is what the paragraph fails to add, not deletion by default. Delete only where nothing can be added, and where the source was opened this run to establish that.

**One case resolves the other way, and a long reference page is where it appears.** Where the same fact is transcribed twice inside one document, the second copy adds nothing the first does not, so the repair is to remove the copy rather than to deepen both. Adding to each is how a page that already restates its source ends up longer for it. This is the duplication the deletion rule covers, judged within a document rather than across the set.

## Document length as a whole

Every repair so far is judged one paragraph at a time: does this sentence add a boundary, does this opening name the subject. None of them asks the question a reader who converts a page to a different format actually feels: is the whole thing longer than it needed to be. A document can pass every per-paragraph check and still be an essay nobody finishes, because each paragraph individually earned a place that, added up, produced more than the subject required.

Judge the finished document as a reader would meet it: read it top to bottom in one pass, then ask whether a careful human, asked to write the same brief by hand, would have produced something shorter. If the answer is yes, the excess is usually one of three things: the same point made once too often across different sections, background that belongs on the page it was copied from rather than repeated here, or depth that serves a narrower audience than the page's opening promised.

Before, an operations page for a caching layer that opens with a two-paragraph orientation, then spends six sections walking through every configuration key, every failure mode, every historical incident, and a full worked example, all under one heading:

> ## Cache operations
>
> The cache sits in front of the directory service... [orientation, two paragraphs]
>
> ### Configuration
>
> [twelve keys, each with a paragraph of prose repeating what a table would show in one row]
>
> ### Failure modes
>
> [nine scenarios, several restating the same negative-caching behaviour already covered under Configuration]
>
> ### Incident history
>
> [three past outages narrated in detail]
>
> ### Worked example
>
> [a full walkthrough repeating claims already made under Configuration and Failure modes]

After, split by Diátaxis type rather than lengthened in place: an index page stays under 'Cache operations' with the two-paragraph orientation and a table of configuration keys (a reference belongs in a table, not restated prose per key), then links out to a dedicated failure-modes reference and a dedicated how-to for the worked example. The incident history, which is decision-record material rather than documentation of current behaviour, moves to a decision record under `docs/` (Rule 4) or is cut if none exists yet. Each destination page is shorter than the section it replaced, because it no longer restates claims a sibling page already carries, and the reader who wants only the configuration table never has to scroll past nine failure scenarios to find it.

This is the same directory-type-precedent logic Phase 2 already uses to place a new file: decide the split by matching each resulting page to a directory whose existing documents are the same type, rather than leaving overview and depth layered on one page because splitting them is more work than adding another section.

## The read-it-cold procedure

Run this before publishing, once per document.

1. Read the document from the top, in order, allowing yourself nothing you learned from the code this run.
2. Stop at the first place a reader without that knowledge cannot continue: an acronym never introduced, a term used before it is defined, a prerequisite never stated, a system named without being identified, or an opening that never says what the subject is.
3. Name that specific thing in the output rather than calling the passage unclear. "Stops at `assertion consumer service`, used in the first sentence and never introduced" is a finding; "the opening is confusing" is not.
4. Read it again as someone who works in the system daily, and name any paragraph they could have got faster from the source, with what it would have to add to earn its place.
5. Report both results. A document passes only when both are clean.

Step 1 is the hard one, and it is the whole exercise. An auditor who has just read the implementation knows what every term means, which is exactly the state the reader does not share.

**Make it a test rather than an act of imagination.** For each candidate term, ask where you learned it. A term you could have defined before opening this project needs nothing. A term whose meaning you settled this run, by reading the code or by inferring it from surrounding names, is a term of art and needs introducing. This catches the compounds that intuition waves through, because a phrase built from familiar words can still carry semantics nobody can guess: knowing what a cache is does not tell a reader when a precache runs, and knowing all four words in a revalidate-behind-the-response strategy does not tell them which response the caller gets.

## What none of this licenses

- **Not softer claims.** The grounding rule is unchanged. An orientation sentence is held to it like any other, from each file carrying a part of it.
- **Not hedging.** "Roughly", "essentially", and "basically" introduce nothing. Introduce the term instead.
- **Not restating the code.** Orientation says what the subject is and why a reader would reach for it. It does not narrate the implementation, which is the failure this repair is most likely to be misread as permitting.
- **Not padding.** One to three sentences, then the depth. An opening that runs half a page has become the document.
- **Not rewriting accurate prose for rhythm.** Where a document already orients its reader, leave the wording alone.
