# Evidence and citation

A claim is publishable when you can name the file, the symbol, and a string copied character for character out of the source that shows the behaviour. This file gives the procedure for getting that proof, the traps that produce a claim without it, and where a claim goes when it cannot be grounded.

- [What holding proof means](#what-holding-proof-means)
- [Choosing the quote that proves the effect](#choosing-the-quote-that-proves-the-effect)
- [Why the quote stays out of the published sentence](#why-the-quote-stays-out-of-the-published-sentence)
- [Reading a symbol through to the claim](#reading-a-symbol-through-to-the-claim)
- [Proving that something does not happen](#proving-that-something-does-not-happen)
- [Provable is not the same as worth writing](#provable-is-not-the-same-as-worth-writing)
- [Sources that do not count as evidence](#sources-that-do-not-count-as-evidence)
- [Hallucination patterns and the check that catches each](#hallucination-patterns-and-the-check-that-catches-each)
- [Worked examples in three languages](#worked-examples-in-three-languages)
- [What to do with a claim you cannot ground](#what-to-do-with-a-claim-you-cannot-ground)

## What holding proof means

Proof is a three-part scratch record kept per claim, alongside the sentence it supports: the file path as the project spells it, the symbol (function, method, class, constant, rule, or build target), and a short verbatim string copied out of that symbol, punctuation, spelling, and casing intact.

A line number is not part of the record, and citing one is not proof. It cannot be rechecked without opening the file, it moves the moment anything above it changes, and it can be typed without having read a single line. The copied string is different in kind: at output time you search the file for it, and either it is still there character for character or the claim comes off the page until you re-ground it. That recheck is what the record buys, and it is why the string is mandatory where the number is worthless.

## Choosing the quote that proves the effect

Quote the line that performs or decides the behaviour: an assignment, a return, a raise or throw, a branch condition, or the call that does the work. A signature, a type declaration, an import, a docstring, or a log message proves that some text exists and nothing more. `log.info("deleting user")` proves a log line, not a deletion, and the deletion may sit three branches away or nowhere at all.

Keep the quote to one line or the fragment carrying the operative token. A ten-line paste is not stronger evidence, and it is slower to re-find. Where the behaviour depends on a value defined elsewhere, hold two quotes: the definition of the value and the site that reads it.

## Why the quote stays out of the published sentence

The quote is a private verification token, not published text. The page cites the file and symbol through a single markdown link and states the behaviour in your own words: no pasted source, no line range, no commit hash, no "as of" qualifier. A reader follows the link to the file as it stands today, whereas pasted source and line ranges go stale on the next edit, silently and without a signal to anyone.

One value is withheld even from the note. Where the proving string holds a credential value, such as a token, a password, an API key, a private key, or a session identifier, record the string with that value replaced by `[REDACTED]`, leaving the surrounding assignment or call intact. The recheck at output time then runs on the text around the placeholder, which is what the note exists to make possible. Never reconstruct the value a placeholder stands for. A credential value belongs in neither the note nor the page.

```text
Note kept (never published):
  file:   src/config/loader.rb
  symbol: ConfigLoader#fetch
  quote:  raise MissingKey, "no value for #{name}"

Published sentence:
  [`ConfigLoader#fetch`](../src/config/loader.rb) raises `MissingKey` when the named
  key is absent from every loaded source.
```

## Reading a symbol through to the claim

Locate the definition by symbol search, open the file, and confirm you are on the definition rather than a re-export, an interface declaration, or a same-named symbol in another module. Read the body end to end, guard clauses at the top and error paths at the bottom included, then follow the calls and conditionals that could change the claim you intend to make.

The stopping rule for descending is the claim itself: stop when the next call cannot change what you are about to write. A claim about a return value stops at whatever produces the value. A claim about persistence descends until you reach the statement that writes, or the boundary the project treats as external.

Delegation needs care. When the symbol forwards to another, the proof lives in the callee and your quote comes from there, while the published citation names the symbol the reader actually calls. A wrapper that adds a guard, a default, or a transform changes the claim, so read the wrapper rather than assuming pass-through. For behaviour with more than one moving part, corroborate across two or three locations: the definition, one call site, and a test whose assertion body (not its name) states the outcome.

## Proving that something does not happen

An absence claim ("does not validate the payload", "no retry on a 4xx") cannot be proved by copying one string, because the evidence is a branch that is not there. Ground it by enumerating the full set of branches and quoting the boundary that closes the set: the final `else`, the `default` case, the end of the match, or the last statement of the body. Then search for anything else that writes the same path (a subclass, an override, middleware, a decorator, a registered hook, generated code) and confirm none of them supplies the behaviour you are calling absent. Record the search you ran next to the quote. If the set cannot be closed, because dispatch is dynamic or the handler list is assembled at run time, the claim goes under "Unverified" instead of on the page.

## Provable is not the same as worth writing

Grounding decides whether a statement **may** be written. It never decides that it **should** be, and it never decides how many times. Holding proof for one fact is proof about one fact, not a licence to state it at every site where it happens to be true.

A verified fact about a symbol has one home, and that home is the symbol's own declaration: the sentence goes there and not above the lines that read it, call it, or branch on it. Proof accumulated while tracing a symbol through its callers is what settles the claim; the trace is not a list of places to write it down.

**A declaration is never a usage site, so this bounds repetition across uses and nothing else.** Each member of a public structure is its own declaration and carries its own comment, however much that echoes the container's. A file-level header states what the file holds, which restates its declarations by design. Both are correct, and reading this section as "no fact twice anywhere" would forbid them.

The failure this catches passes every other check in this file. The claim is grounded, the quote is real, the wording is accurate, and the run still leaves a comment above twenty branches where one comment on a declaration was the whole of what was needed.

## Sources that do not count as evidence

Each of these can start an investigation. None of them ends one.

- **A search-result snippet.** It hands you the matching line stripped of the guard above it and the early return below it. Open the file at that symbol and read the body.
- **A repository map or directory listing.** It proves a path exists. No path implies behaviour, whatever the folder is called. Open the file.
- **A summary, yours or another agent's.** A paraphrase carries no string you can search for later. Re-derive the quote from the source.
- **A previous turn, including your own read earlier in this run.** The read is void once anything has written to that file since, and an audit run writes often. Re-open before citing.
- **The file's own comments, docstrings, README, or changelog.** These are the material under audit. Where comment and code disagree, the code is the fact and the comment is a correction to make.
- **A test name.** `test_rejects_negative_retries` states an intention. The assertion inside the test is evidence; the name is a label someone typed.

## Hallucination patterns and the check that catches each

| Pattern                          | Check that catches it                                             |
| -------------------------------- | ----------------------------------------------------------------- |
| Inferring behaviour from a name  | Copy the line that performs the effect; a signature is not one    |
| Trusting a stale comment         | Quote from the code below the comment, never from the comment     |
| Documenting planned behaviour    | Confirm the branch has a caller and the default value reaches it  |
| Citing a line range              | Replace the range with a copied string, or drop the claim         |
| Generalizing from one call site  | Enumerate every caller, or scope the sentence to the one you read |
| Trusting a parameter default     | Check the call sites and config layers that override it           |
| Reading a config key by its name | Find the read site; a key often gates less than its name suggests |

## Worked examples in three languages

**Ruby, a name read instead of a body.** Wrong claim: "`Account#deactivate!` deletes the account record." Proof that was needed: symbol `Account#deactivate!` in `app/models/account.rb`, quote `update!(status: :archived, deactivated_at: Time.current)`, with no destroy call anywhere in the body. Corrected sentence: "`Account#deactivate!` sets the account status to `archived` and stamps `deactivated_at`; the row remains in the table."

**Go, arithmetic assumed from a constant.** Wrong claim: "`Do` makes three attempts before giving up", inferred from `const maxRetries = 3`. Proof that was needed: the loop header `for attempt := 0; attempt <= maxRetries; attempt++ {`, which runs for attempt values 0, 1, 2, and 3. Corrected sentence: "`Do` makes an initial call followed by up to three retries, four calls in total, then returns the last error."

**Kotlin, a comment trusted over the code.** Wrong claim, copied from the symbol's own documentation comment: "Returns null when the cache has not been warmed." Proof that was needed: the body's `throw IllegalStateException("cache not warmed")`, plus a declared return type that is not nullable. Corrected sentence: "`CacheReader.read` throws `IllegalStateException` when it is called before the cache is warmed." The comment itself is a second finding: correct it in the same run.

## What to do with a claim you cannot ground

Keep it off the page. Do not soften it into "appears to" or "should", do not park a placeholder in the document, and do not write it from the symbol's name. Report it under an "Unverified" heading in the run output, one line per item, naming the claim you could not make, the file and symbol you reached, and what blocked you: dynamic dispatch, generated or vendored code, a file you could not open, a behaviour that only a running system would settle.

Existing published prose is treated differently from new prose. A sentence already on the page that a held quote contradicts is corrected. A sentence you simply could not confirm is left as written and listed as unverified, since deleting accurate content because your run did not reach it is a loss. A public symbol left undocumented and named in the list is a compliant outcome for the run; a sentence invented from a name is the defect the whole rule exists to prevent.

**Could not reach is not the same as provably absent**, and only the second licenses deletion. Not reaching a subject is a fact about your run: the file sits behind a boundary you cannot open, the search was scoped too narrowly, the behaviour lives in a generated or vendored tree. Establishing that a subject is gone is a fact about the code, and it takes the same standard of proof as any other claim: you searched the tree the subject would have to live in, and it is not there. The first outcome leaves the documentation alone and reports it unverified. The second is what the rule about content describing removed features is for. Conflating them turns one unlucky run into deleted work, which is why the rule reads in this direction rather than the other.
