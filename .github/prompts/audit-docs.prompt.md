---
description: "Audit and update a project's documentation, both its Markdown pages and the comments in its code, so they match the current code, grounding every claim in a file opened this run."
name: 'audit-docs'
argument-hint: '[paths or area to audit; defaults to the active pull request or working changes]'
agent: 'agent'
---

## Rules for every run

Read this whole prompt before you start. Check the project's own files (#codebase), resolving each reference with your own file-search, pull request, and diff tools if it is not handed to you.

- **Documentation has two parts, and you audit both.** One part is the Markdown pages. The other is the comments in the code: documentation comments, inline comments, and file headers. On a pull request, audit the comments in every code file the diff touched, not only the Markdown.
- **Keep it short.** Match the length to what the change needs. Cover the substance, and add no filler sections, repeated summaries, or boilerplate. On a pull request, the documentation edit is about the size of the code change: fix the sentence the change made false, and add a sentence only for behaviour the change added. A comment you write is one sentence, or two when the second states an error, a constraint, or a caller duty.
- **Write plain English for people.** Your reader is a developer reading once. Write complete, grammatical sentences, one idea each, with ordinary pronouns and transitions where the meaning is clear. State what the code does. Do not work out scenarios or consequences that no code, test, or document states.
- **Edit only what the request covers.** Edit in full only the files the scope resolves to (see [Scope](#scope)). On a pull request or working changes, those are the files the diff touched. Any other document gets only the edits the change itself requires. A file you opened only for context stays exactly as you found it.
- **Files keep their path and name.** Rename, move, split, merge, or delete a file, or create a directory, only when the request asks for it or the user approves it. Where one looks necessary, ask the user and wait. Where you cannot ask, propose it in your report instead.
- **Change documentation only.** Never change executable code or behaviour unless the request asks for it.
- **Prove every claim.** Every sentence you write rests on a string copied from code you opened this run. What you cannot prove goes in your report, not in the file.
- **Correct comments; do not delete them.** An existing comment stays unless Phase 3's closed delete list names it. Correct a wrong one, tighten a long one, and keep and report one you are unsure about.
- **Keep the form of existing content.** An existing list, table, heading, or code block keeps its form. Edit what is inside it. Never turn a list into prose, and never remove a code block because the sentence beside it says the same thing. An example, command, configuration entry, data sample, or short excerpt of logic stays, corrected against the code. Only a block that transcribes an implementation a link serves as well is replaced by that link, and the sentence it supported stays. Propose any other change of form in your report.

## Workflow

Copy this checklist into your notes and tick each step as you finish it.

```text
Audit progress:
- [ ] 1. Resolve the scope and say which rule applied
- [ ] 2. List the code files and the Markdown files in scope, separately
- [ ] 3. Phase 1: bring the docs and comments in line with the change
- [ ] 4. Phase 2: audit the Markdown pages in scope
- [ ] 5. Phase 3: audit the comments in every code file from step 2
- [ ] 6. Run the final check, then write the report from the template
```

Step 5 runs even when Phases 1 and 2 changed nothing. If step 2 found no code files, say so in the report.

## Scope

**Resolve the scope in this order. Stop at the first rule that applies, and never widen it.**

1. An explicit instruction that names paths or an area.
2. The active pull request (#activePullRequest).
3. Uncommitted changes (#changes).
4. The files the surrounding task created or changed.
5. Only then, the whole documentation set.

State in your report which rule applied.

**Edits land in two tiers.**

- **Full audit:** the files the scope resolved to. On a pull request or working changes, those are the files the diff touched.
- **Change-bound edits:** any other document. Correct only the words the change made false, and nothing else in that sentence, even where the citation rule would otherwise add a link. Where the document's subject (its title and opening) is the changed component, add what Phase 1 requires. Make no other edit there: no newcomer fixes, no length cuts, no terminology changes.

A file opened only for context, such as a sibling checked for placement, a link target, or a term's spelling, stays exactly as you found it. Report a defect you notice outside what you may edit under _Observed outside scope_.

**When the request asks for a specific change** ("update the setup guide for the new flag"), that change is the deliverable. Make it in that file at its current path. Correct what the code contradicts in the passages you touch, and report anything else you find.

## Phase 1: sync with the change

Run this phase only when there is an active pull request or working changes. Treat the diff as the source of truth.

- List what the diff changed in behaviour: added, removed, or modified.
- For each change, update whichever documentation describes that behaviour: a Markdown page, a code comment, or both. Do this even where the pull request did not touch the docs.
- Document only behaviour the change made. Edit the existing sentence the change made false before you consider adding one. A new sentence states the new behaviour and stops.
- Report whether you made changes or found the documentation already accurate.

## Phase 2: audit the Markdown pages

- **List the pages in scope first.** For each, note its subject, the code that subject maps to, and its type: tutorial, how-to guide, reference, or explanation (the Diátaxis types). Decide the type by what the reader needs, not by the subject. Report how many pages you opened, and name any page in scope you did not open.
- **Correct what the code contradicts.** Keep the phrasing and style of accurate content.
- **Fix newcomer blockers in a page you edit in full.** A newcomer blocker is a place a first-time reader cannot get past: a term never introduced, an opening that never names the subject, or a missing prerequisite. Fixing one is an addition, so make it even where the surrounding prose is accurate, and leave that prose as it reads. In any other page, name the blocker in your report.
- **Delete existing content only on these grounds:** it repeats a point the same page already makes, it is duplicated across many documents, it describes a removed feature, or it cannot be corrected. A code block, list, or table is not a repeat of the prose beside it. When in doubt, correct instead of deleting. You may freely edit or remove content you wrote this run.
- **Create a new file only when the request asks for one,** or when the change adds a component no existing page can hold. Reuse an existing home where one fits. Otherwise, choose the directory by document type, not by subject. Open the directory's entry-point file and two or three of its pages, and place the new page there only if those pages are the same type. A new directory falls under the file rule above, and gets an entry-point file named as the project's other directories name theirs. Report which home you chose and why, and list the new file in that directory's entry-point file. This places a new file; it never moves an existing one.
- **Missing entry path.** When the scope is the whole documentation set and nothing takes a first-time reader through one task from start to finish, report that gap. Write the missing page only when the request asks for it, with every step proved from a script or configuration file that exists.
- **Report** whether you made changes or found the pages already accurate. For each page you edited in full, give its newcomer result: the first place a reader new to this codebase would stop, or that nothing stops them.

**Each page has two readers.** A newcomer meets the system for the first time. An experienced reader already works in it. Serve both on one page, in order: first say what the subject is and why a reader would use it, introduce each acronym, term of art, and named component where the page first uses it, and state what the reader must already have or have read. The detail follows. Keep the opening to one to three sentences. Do not split a page between the two readers.

## Phase 3: audit the comments in code

Run this phase on every audit, over every code file in scope, whatever Phases 1 and 2 found. It covers documentation comments, inline comments, and file headers, plus any `.md` file inside the scope that sits outside `docs/`. It never sweeps the whole repository: a file the scope did not resolve to stays out.

**The floor.** The comment on a public or exported symbol, a public structure member, or a package or module never drops below one sentence saying what it does, even where that sentence restates the name. If you did not read the body, keep the comment and report it.

### Judge each existing comment with these tests, in order

The first test that applies decides.

1. **Drifted.** It states something the code no longer does. Correct it from the body, and keep the wording that is still true.
2. **Wholly redundant.** Every sentence restates the name, the signature, or the line beneath it, such as `// Increment counter`, and gives no reason, constraint, edge case, or warning. Delete it, unless the floor keeps it.
3. **Verbose.** A useful fact sits inside padding. Keep the summary sentence and each sentence giving a reason, constraint, edge case, or warning that no other kept sentence gives. Cut whole sentences that restate the signature, describe members that have their own comments, walk through the body, describe alternatives that were not taken, tell the history of the code, or repeat a reason already given. This test never removes a whole comment. Put every comment longer than about five lines through this test.
4. **Otherwise, it stays as written.**

**Cut by whole sentences.** Keep every sentence you do not cut word for word. Where a kept sentence depends on a cut one ("also", "these"), keep both or cut both. A rewritten or merged sentence is a new claim and needs its own proof. Correct a comment that is both wrong and long before you tighten it.

**The closed delete list.** Besides test 2, delete only:

- commented-out code;
- a comment about code that no longer exists, with nothing to correct it to;
- change narration ("now uses", "previously") that states no current fact (narration that does state one is rewritten to that fact);
- a copy of a declaration's comment above a use site, under the rule below.

A TODO stays unless its work is visibly done. Removing a comment because it is private, because the function is short, or because you would not have written it is a defect. When unsure, keep it and report it.

**Trim only inside the requested scope.** Tests 2 and 3 apply only to what the request resolved to: on a pull request, the files and code the diff touched; on a directory or component, everything in it; on a function, only that function. Elsewhere, only test 1 applies.

### Write missing comments

- **Every public or exported symbol in scope carries a documentation comment,** and so does each member of a public structure: fields, properties, keys, and enum values. On a pull request or working changes, write a missing comment only for a symbol the diff added or changed, and list the other undocumented symbols in those files in your report.
- **Write it from the body.** Open the body first. Use the form the language sets (a Go comment opens with the symbol's name; a Python docstring opens with a one-line summary). Write one sentence saying what the symbol does, even where the name makes that obvious. Add a second sentence only for an error, a constraint, or a caller duty that you can quote from the body, a test, a configuration value, or a decision record opened this run. Stop there.
- **A member's comment** states what the code in scope that sets or reads it shows.
- **If you cannot reach the body, leave the symbol undocumented and name it in your report.** A comment written from the symbol's name is the defect; an undocumented symbol you report is compliant.
- **Private and internal code** gets a new comment only where the logic carries a gotcha, an edge case, a workaround, or a reason the code cannot show. Keep it as short as the fact allows. This rule governs only what you write; it is never a reason to remove an existing comment.
- **Do not restate what the syntax already declares,** such as a type, a visibility modifier, or an override marker.
- **An accurate existing comment gains no sentence,** except a fact folded in from a use-site copy or a deprecation's replacement.

### More rules for comments

- **One home per fact.** A statement about a symbol belongs on its declaration, never above a line that reads, calls, or branches on it. A declaration, including an export or re-export, is not a use. Remove a copy above a use only when both sites are in scope, you read the declaration's body, and the copy says no more than the declaration's comment. Fold any extra constraint into the declaration first. Otherwise, keep both and report the copy.
- **Correct a documentation tag; do not strip it.** Fix what is wrong in a parameter, return, throws, or example entry, and leave what is right. Delete a whole tag only when it is wrong and cannot be corrected, such as one for a parameter the signature no longer has.
- **Name the code the comment describes:** a line, a block, the function, or the file. A comment that explains why the code beneath it is written that way passes. Correct a comment that names removed code towards its replacement, or delete it under the closed list. A note about a deliberate omission the code depends on passes, and so does a file header.
- **Contracts worth stating, when the body shows them:** cleanup the caller owns (a handle to close, a listener to remove), the errors a caller can branch on, and a deprecation that names its replacement. Call a list of errors complete only when you read every path through the body. A deprecation without migration directions is incomplete; add them only where you can prove them.
- **File and package comments** say in one sentence what the file or package is for, in the language's usual form (a Go package comment opens `Package auth`). A large package may add one sentence naming the few entry points a caller starts from. Never list or describe members that have their own comments. Write a package comment only after you have read every file it spans.
- **Form.** A documentation comment is a complete, capitalized, punctuated sentence; a short trailing comment may be a fragment. Wrap lines to the width the file already uses. Use the format's own list syntax. Never box a comment in decorative characters. Documentation comes before an annotation or decorator, never between it and the declaration.

**Report** the files changed and the kind of change, or "Phase 3: audited in-code documentation across X files, all accurate, no changes required." Name every code file in scope with its result. List under "Unverified" every claim you could not prove and every symbol whose behaviour you could not establish.

## Hard rules

### Rule 1: documentation only

Edit documentation, never code behaviour. In scope: Markdown, text files, and in-code documentation (comments, docstrings, file headers). Out of scope: executable code, configuration values, build and test logic, and dependencies. Do not rename, refactor, reformat, or delete code symbols, and do not fix a bug or dead code you notice; report it instead. The only exception is a request that explicitly asks for code changes.

A restructure the request asks for moves content as it stands. Every sentence, list item, command, and diagram lands on one of the resulting pages unchanged, apart from the headings and link targets the move requires. A link to a moved page changes its target, not its text.

### Rule 2: prove it

Ground every statement in code you opened and read in full this run. A search snippet, a repository map, a directory listing, a summary, an earlier turn, and the file's own documentation are not sources. Open the file.

- **Before you write a statement,** name the file, the symbol, and a short string from the source that shows the behaviour, copied exactly. Replace any credential value in it (a token, a password, an API key, a private key, a session identifier) with `[REDACTED]`. A line number is not proof.
- **The quote is for your own check.** The published sentence cites the file and symbol with a link, and nothing more.
- **Read the body.** Do not infer behaviour from a name, type, file location, configuration key, comment, or familiar pattern. When code and comment disagree, the code wins.
- **A claim that spans several files** needs a quote from each file that carries part of it. For complex behaviour, confirm it in two or three places: the definition, a call site, and a test.
- **A sentence with a scope word** ("always", "never", "only", "every", "defaults to", or a complete list) needs every path that could make it false read first. Otherwise, write about the one path you read.
- **If you cannot prove it, leave it out and report it.** Do not hedge ("appears to", "seems to", "likely", "probably", "should", "will"), do not leave a TODO, and never document planned behaviour.

Example. Proof: symbol `parseConfig` in [`config.ts`](../src/config.ts), quote `throw new RangeError('retries must be >= 0')`. Written: "[`parseConfig`](../src/config.ts) rejects a negative `retries` value with a `RangeError`."

### Rule 3: objectivity

- Correct falsehoods. If the docs say "returns JSON" and the code returns XML, fix the docs.
- In new content, use no subjective adjectives (important, robust, seamless, efficient, and the like). State the fact that would earn the adjective, such as a limit, a count, or an error type.
- In existing content, keep subjective terms unless they are wrong.

### Rule 4: current state only

Documentation and comments describe the code as it is now. Do not describe a change, a fix, or an earlier state; version control holds that history. Do not argue that the code is correct or safe, and do not name a file, flag, symbol, or tool that no longer exists. Future intent belongs only in a `TODO` in the code that will change. Documentation has no empty sections, stubs, or "add details here" placeholders. Only architectural or cross-cutting decisions get decision records; the reason a piece of code is written as it is stays in a comment beside it.

### Rule 5: diagram and image accessibility

Every Mermaid diagram has both:

1. **`accTitle`:** a specific title, such as "User Authentication Sequence", not "Diagram".
2. **`accDescr`:** a description a reader who cannot see the diagram can understand on its own, not "A diagram showing…".

Never output a diagram missing either one. Every image has alt text that says what it shows; "screenshot" or "diagram" fails. Use an image only where showing is easier than describing.

### Rule 6: length

Judge each page you edit in full as a whole: would a careful person, asked for the same thing, have written something shorter? In what you write, cut repeated context and any point made twice. In existing content, remove a point the page makes twice and leave the rest; propose any further cut in your report.

**A page stays one page.** Where a page holds two complete document types for different tasks, propose the split in your report, naming the proposed pages and what goes where. Rule 1 decides whether it happens.

**A diagram, table, or snippet can replace prose.** Where a passage stays long because the subject needs it, propose a diagram, table, snippet, or image in your report. Add one only where it shortens the page.

## Writing

- Add what the code cannot show: why something exists, how parts interact, and when to use it. Cut a sentence that restates a line the reader can already see. Two places state plainly what a thing does: reference material for readers who cannot open the source, and the opening of a page.
- Lead with the point. Show a fact (a command, a number, a named edge case) instead of asserting that something matters. Use prose for reasoning and lists for real enumerations.
- Write the least that carries the fact. Never cut a definition, a unit, or a condition to save words; cut whole passages that do not earn their place instead.
- A why-claim is still a claim: cite what proves a reason, or state the _what_ and stop.
- Apply this only to prose you add or change. Do not rewrite accurate existing prose for style.
- Use the same term for the same concept every time. Capitalize acronyms and give the full term on first use per page; keep the exact casing of brand, tool, and package names, domain terms, and code references. Introduce a term you learned from this project's code where the page first uses it.
- Link every file you mention with a relative link whose text names the target, never "here". Link to a file, not a directory. Check that every path and anchor resolves.
- Name a setting by the name a user changes it by: an environment variable, a configuration key, a flag, or a named constant other code reads.
- In what you write, link to code instead of pasting a definition. A usage example, configuration line, or data sample is fine, as short as the point allows, in the language the reader edits, with the fence labelled.
- Use no em-dashes or en-dashes; use a comma, parenthesis, colon, or new sentence. In a page you edit in full, replace its existing ones too. Use Canadian spelling (colour, behaviour, licence, centre, standardize) in what you write, never in code identifiers or keys. No contractions.
- A page opens with one H1 named for its file, then one to three sentences for a reader new to the subject, then H2s. Headings are unique, descriptive, and in sentence case. Prefer Markdown to raw HTML. Use tables only for uniform data. Every row keeps the header's cell count, each cell stays on one line, and a literal `|` is written `\|`.

**Examples of the target style.** Each rewrite is no longer than the fact needs.

- Draft: "This section covers the retry configuration and explains how it applies to outbound requests." Write: "A failed outbound request is retried three times. The count comes from `MAX_ATTEMPTS`."
- Draft: "The connection pool is robust, reliable, and efficient." Write: "The pool opens at most 16 connections and raises `PoolTimeout` after waiting 5 seconds for one."
- Draft: "In conclusion, the queue is a strong solution." Write nothing; the queue's limits are already stated where they apply.

After you write a paragraph or a comment, reread each sentence once. If it does not read as ordinary English on the first pass, rewrite it plainly.

## Diagrams and flows

**Include a step in an architecture or logic flow only if all three hold:** it affects what users or external callers see, it changes data, state, or the execution path, and removing it would break something. Leave out logging, metrics, telemetry, trivial validation, and internal utilities unless the system you are documenting is observability.

**Use a Mermaid diagram for:** interactions between services, state machines, data pipelines, flows of five or more steps, user journeys, and dependency graphs. Skip it for trivial logic, basic create-read-update-delete code, or a short list. Use valid Mermaid that reflects current code. No ASCII art, static images, or `style` colour overrides. Pick the type that fits (`sequenceDiagram`, `stateDiagram`, `classDiagram`, `flowchart`, `journey`, `C4Context`, `mindmap`, `xychart`, `kanban`, `architecture-beta`, `treemap-beta`), and use `flowchart` only when it is the best fit.

## Final check

Before you write the report, confirm each item and fix what fails inside the scope.

- Every sentence you wrote or changed, in pages and comments, still matches its proof string in the file as it now reads. Delete a sentence you wrote that does not; restore a sentence you changed that does not.
- Phase 3 ran over every code file in scope, and the report names each one.
- Only files inside the scope changed, each by the tier that admitted it, and every file keeps its path and name unless the request or the user approved a change.
- Only documentation changed. Existing content changed only on a ground a phase, Rule 6, or the dash rule gives.
- Every existing list, table, and code block kept its form; any code block you removed only transcribed code and is now a link.
- No hedging, no new subjective adjectives, and no em-dashes or en-dashes in what you wrote.
- No comment was deleted except under the closed list, no public symbol's comment dropped below its floor, and every tightened comment lost whole sentences only.
- Every comment you wrote is at most two sentences, and it sits on a declaration, not above a use.
- Each page you edited in full opens by naming its subject, and nothing in it stops a newcomer, or your report names the place that does.
- Every diagram has `accTitle` and `accDescr` and parses, and every image has real alt text. Every table you touched still has matching cell counts, and nested lists render.
- Every file link resolves to a file, not a directory.
- Each file you edited is no longer than the change needed. Record each file's line count before and after in the report.

## Report

End with a report under these headings: scope and summary (the rule that applied, files read and changed); Phase 1, Phase 2, and Phase 3 results, each with a status line, where Phase 3 names every code file in scope with its result; files changed, one row per file with the kind of change and its line count before and after; Unverified; observed outside scope; and code problems observed but not changed. Name files in code spans. Write "none" under a heading with nothing to report.

## Reminder

Keep every edit as short as the change allows, in plain English a developer understands on the first read. Audit the comments in every code file in scope, not only the Markdown.
