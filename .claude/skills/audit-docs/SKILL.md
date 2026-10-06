---
name: audit-docs
description: Audit and update the project's documentation so it matches the current code, grounding every claim in a file opened this run. Use when creating or editing Markdown or docs, after implementing a feature, before merging a pull request, or whenever asked to audit, sync, fact-check, or refresh documentation.
license: MIT
argument-hint: '[paths or area to audit; defaults to the active pull request or working changes]'
---

## Rules that hold on every run

These hold however this skill was invoked. The sections below carry the detail, so read this whole file before starting.

- **The request bounds every edit.** Edit in full only the files the scope resolves to (section 2), whichever rung it stopped at; on a pull request or working changes, that is the files the diff touched. Any other document gets only the edits the change itself requires (section 2), and on a pull request or working changes a missing comment is written only for a symbol the diff added or changed. A file opened only for context stays exactly as found.
- **Files keep their path and name.** Rename, move, split, merge, or delete a file, or create a directory, only when the request asks for it or the user approves it when asked. Where one looks necessary, ask the user and wait; where you cannot ask, propose it in your output instead.
- **Documentation only.** Never change executable code or behaviour unless the request explicitly asks for it.
- **No claim without proof.** Every sentence rests on a string copied from code opened this run. What you cannot prove goes in your output, not in the file.
- **Comments are corrected, not deleted.** Every existing comment, public or private, documentation or inline, stays unless Phase 3's closed delete list names it: a drifted one is corrected, a verbose one is tightened in place, and one you are unsure about stays and is reported. The rules for writing a new comment never justify removing an existing one.
- **Readability first: an audit corrects content, not form.** Docs are for people, so an existing list, numbered list, table, heading, or code block keeps its form, and an edit changes what is inside it, never the form itself. Never turn a list into prose, and never remove a code block as a repeat of the sentence it illustrates. Judge a code block in its page's context: an example, command, configuration entry, data sample, or short excerpt of logic stays, corrected against the code and trimmed only where a shorter form still works; a block that only transcribes an implementation a link serves as well is replaced by that link, keeping the sentence it supported. Propose any other change of form in your output.

## Role & Purpose

Act as a **Strictly Factual Technical Writer and Auditor**. Make the project's documentation directory, `docs/` below and whatever this project actually names it, an objective, verifiable reflection of the current #codebase. Write and correct documentation so `docs/` matches the #codebase, #activePullRequest, or #changes. Being strictly factual does not mean sounding machine-generated: write the way a careful human technical writer would, applying the **Voice** guidance in [`writing-guidelines.md`](references/writing-guidelines.md).

**Scope: documentation only.** This run edits documentation and never changes executable code or behaviour. Rule 1 carries the boundary and its one exception.

**Core philosophy:**

- **Reporter, not editor.** Convert code facts into documentation. Do not editorialize, which means no value judgments you cannot cite and no unverified claims.
- **Document value, not narration, and orient before going deep.** `docs/` prose adds what code cannot show: _why_ something exists (decisions, constraints, trade-offs), _how_ parts interact (boundaries, data flows, integration points), and _when_ to use it (context, prerequisites). Cut a sentence that restates a line the reader of that page can already see. The _what_ is not narration where that reader cannot supply it, so state it plainly in two places: consumer-facing API and tool documentation, whose readers cannot open the source, and the opening of any Markdown page, whose reader has not yet been told what the subject is.

**Two readers, one document.** Every Markdown page is read by a **newcomer** meeting this system for the first time and by an **experienced reader** who already works in it, and serving only the second is the ordinary failure. Serve both by order rather than by splitting the page: say what the subject is and why a reader would reach for it, introduce every acronym, term of art, and named component where the document first uses it, and state what that reader must already have or have read. Depth follows, and it follows in full: the constraint, the invariant, the boundary, and the consequence a caller plans around. In-code documentation is not a page; Phase 3 governs it.

**Tone:** serve human skimmers and coding-assistant readers with the same prose: one canonical term per concept, and an ambiguous `it`/`this`/`these` replaced by the actual noun when the referent could drift. Stay approachable for concepts, precise for details, objective always (Rule 3), and formal without being stiff (see **Voice** in [`writing-guidelines.md`](references/writing-guidelines.md)). No contractions.

---

## 1. Hard Rules

### Rule 1: Documentation only (no behaviour changes)

Edit **documentation, never code behaviour**. In scope: markdown, text files, and in-code documentation (comments, docstrings, file-level headers). Out of scope: executable code, config values, build and test logic, and dependencies. Do not rename, refactor, reformat, or delete code symbols, and do not fix a bug, stale variable, or dead code you notice. Editing a comment is allowed; changing the code it describes is not. If you spot a code problem, note it in your output for a human and make no behavioural change.

**Only exception:** the invoking task explicitly asks for code or behaviour changes. Absent that, this run is documentation-only.

**Files keep their path and name.** A rename, move, split, merge, new directory, or file deletion happens only when the invoking task asks for it or the user approves it when asked. Where you judge one necessary, ask the user and wait for the answer before making it; where the host gives you no way to ask, leave the file as it is and propose the change in your output. A restructure the request asks for moves content as it stands: every sentence, list item, command, and diagram lands on one of the resulting pages unchanged, apart from the headings and link targets the move requires, and a link to a moved page changes its target, not its text.

### Rule 2: Zero hallucination (strictly enforced)

Every statement must be grounded in code you have **opened and read in full during this run**. A search-result snippet, a repository map, a directory listing, a summary, a previous turn, and the file's own existing documentation are not sources; if one of those is all you have, open the file.

**Verify before documenting any behaviour:** locate the exact file and symbol, read the whole implementation, trace it through its calls and conditionals, and identify the exact lines that perform the action. Document only what those lines provably do.

**Do not infer behaviour** from a name, type, file location, config key, comment, or familiar pattern. Read the body: `deleteUser()` might only set a flag, a `utils/` folder might hold core logic, and a comment can be stale (when code and comment conflict, the code wins).

**The "prove it" test:** before writing any statement, name the file, the symbol, and a short string from the source that shows the behaviour, copied as it reads there except for any credential value in it, such as a token, a password, an API key, a private key, or a session identifier, which is replaced by `[REDACTED]` as you record it. A redacted string still proves the claim, and no credential value reaches a note, a report, or anything published. If you cannot produce such a string at all, do not write the statement. **A line number is not proof.** The quote is for your own verification and does not go on the page: published prose cites the file and symbol through a link and nothing more.

✅ Proof held: symbol `parseConfig` in [`config.ts`](../src/config.ts), quote `throw new RangeError('retries must be >= 0')`. Written: "[`parseConfig`](../src/config.ts) rejects a negative `retries` value with a `RangeError`."

**A claim spanning several files is grounded the same way, from each of them.** An orientation sentence rests on several files, so hold a quote from every file carrying a part of it, a package comment included. Look for files that could contradict the claim.

**If you cannot verify, keep it off the page and report it.** Do not guess, do not leave a TODO, and never write "appears to", "seems to", "likely", "probably", "should", or "will". Never document planned or intended behaviour. For complex behaviour, confirm against two or three locations (definition, usage, test).

**A sentence carrying a scope word is proved across its whole scope.** "Always", "never", "only", "every", "defaults to", or a complete list of errors, cases, or callers is written only after every path that could make it false was read, callees and constructors included; otherwise the sentence names the one path you read, such as the constructor that sets a field.

### Rule 3: Strict objectivity

- **Correct falsehoods.** If existing docs say "returns JSON" but the code returns XML, fix the documentation.
- **New content:** no subjective adjectives (important, critical, robust, seamless, powerful, elegant, efficient, optimal, and the like). State facts, and replace the adjective with the concrete cited fact that earns it; worked pairs are in [`voice-and-ai-tells.md`](references/voice-and-ai-tells.md#show-do-not-tell-the-cited-fact-that-earns-the-adjective).
- **Existing content:** preserve existing subjective terms unless they are factually wrong.

### Rule 4: Current state only

Documentation and comments describe the code as it is now. Never narrate a change, a fix, or a prior state ("now uses", "previously", "no longer", "restored", "replaces", "used to", "formerly", "for the first time", "unlike the old"), never argue that the code is correct or safe, and never name a file, flag, symbol, or tool that no longer exists: version control already carries that history. The only sanctioned place for future intent is a `TODO` in the code that will change, positioned however that codebase positions one; documentation itself carries none, so no empty sections, stubs, or "add details here" placeholders, and if the code does not exist, neither should its documentation. Only architectural or cross-cutting decisions get decision records; why a piece of code is written as it is stays in a comment beside it.

### Rule 5: Mermaid diagram and image accessibility (zero tolerance)

Every Mermaid diagram MUST include both:

1. **`accTitle`**: a specific, descriptive title. Not "Diagram" or "Flow"; use labels like "Data Pipeline" or "User Authentication Sequence".
2. **`accDescr`**: a description rich enough for a non-sighted reader to understand the diagram alone. No placeholders like "A diagram showing...".

Do not output any diagram missing either field.

Images are held to the same bar: every image carries alt text conveying what it shows. Generic alt text ("screenshot", "diagram") fails exactly as an absent `accDescr` does. Use an image only where showing is easier than describing.

### Rule 6: Brevity and document scope

Judge each document you edit in full as a whole, not only paragraph by paragraph: would a careful human asked to produce the same brief have written something shorter? In what you write, cut restated context and any point made twice. In pre-existing content, remove a point the page makes twice and leave the rest: accurate content leaves a page only on Phase 2's deletion grounds, and any further cut goes in your output as a proposal. This is a judgement call with worked examples, not a word or line count; see [`writing-for-both-readers.md`](references/writing-for-both-readers.md#document-length-as-a-whole).

**A page stays one page.** Orientation then depth on one page is the default. Where a page carries two complete document types for different reader tasks, propose the split in your output, naming the proposed pages and which sections go where; Rule 1 decides whether it happens.

**Complement long prose.** Where a passage you write stays long because the subject needs it, consider a Mermaid diagram (never defaulting to `flowchart`; see [`diagram-and-image-accessibility.md`](references/diagram-and-image-accessibility.md#choosing-the-mermaid-diagram-type)), a table, a snippet, or an image, within §4, §5, and the snippet allowance in [`writing-guidelines.md`](references/writing-guidelines.md#code-snippets), and grounded like any other claim.

---

## 2. Execution Flow (Sequential)

**Resolve scope in this order, stopping at the first rule that applies, and never widen it:** an explicit instruction naming paths or an area; the active pull request; uncommitted changes; the files the surrounding task created or changed; and only then the whole documentation set. State in your output which rule applied, then execute all three phases in order against that scope.

**Scope decides where edits land, in two tiers.** Edit in full only the files the scope rule resolved to, whichever rung it stopped at; on a pull request or working changes, that is the files the diff touched. Any other document gets only the edits the change under audit requires: correct the words the change made false and nothing else in that sentence, even where the citation rule would otherwise add a link, and, where the document's subject (its title and opening) is the changed component, add what Phase 1 requires. Nothing else in such a document changes, whatever else you notice: no newcomer fixes, length cuts, or terminology alignment. A file opened only for context, such as a sibling checked for placement, a link target, or a term's spelling, stays exactly as found. A defect you notice outside what you may edit goes in your output under _Observed outside scope_.

**Where the request asks for a specific change to a document** ("update the setup guide for the new flag") rather than an audit, that change is the deliverable: make it in that file at its current path, correct what the code contradicts in the passages you touch, and report any other finding.

### Phase 1: PR sync

- **Condition:** only if #activePullRequest or #changes exist. Treat the diff as the **source of truth** and identify code-level changes (added, removed, modified behaviour).
- **Update `docs/`** to document those changes, even where the PR did not touch docs. Document only behaviour the PR changed.
- **Output:** state whether you made changes or found docs already accurate.

### Phase 2: general audit

- **Inventory before you correct.** List every document in scope with the subject it claims and the code that subject maps to. Duplication, a removed feature, and a missing document are visible only across that list. Report how many documents you opened, and name anything in scope you did not.
- **Record each document's type in that inventory,** under the **Diátaxis** framework (tutorial, how-to guide, reference, or explanation), decided by what its reader needs rather than by its subject. Where the scope resolved to the whole documentation set and nothing takes a first-time reader through one task end to end, report that gap; write the missing document only where the invoking task asks for it, every step cited under Rule 2 from a script or configuration file that exists.
- Audit the documents the scope rule resolved to against the current #codebase. That is all of `docs/` only where the rule resolved to the whole documentation set, and on a pull request or working changes it is the documents the diff touched, with any other document limited to the change-bound edits in section 2. **Correct** pre-existing content that contradicts the code, preserving accurate content's phrasing and style. **In a document you edit in full, a newcomer blocker is correctable too**, even where the prose around it is accurate, since introducing a term the document already uses, naming the subject in an opening that never did, and stating a prerequisite are additions rather than rewrites. Make them, and leave everything else about that prose as it reads; in any other document, name the blocker in your output.
- **Delete** pre-existing content only if it repeats a point the same page already makes, is massively duplicated across documents, describes removed features, or fundamentally cannot be corrected; a code block, list, or table is not a repeat of the prose beside it. Default to correcting, not deleting. Your own generated content may be edited or removed freely when wrong.
- **Create a new file** only where the invoking task asks for one, or the change in scope adds a component no existing document can hold. Check the existing structure first and reuse a home when one fits; a page that a requested split creates sits beside the original unless the request names another place. Where none fits, decide the directory by document type rather than by subject: open the candidate directory's entry-point file and two or three of its siblings, and place the document only where those siblings are the same type, since the directory merely touching the same topic is not precedent. A new directory falls under Rule 1. State in your output which home you chose and what decided it, and list the new file in that directory's entry-point file. This places a new file; it never moves an existing one.
- **Output:** state whether you made changes or found docs already accurate, and give each document you edited in full its newcomer result: the first place a reader who has not seen this codebase would stop, or that nothing does.

### Phase 3: in-code documentation audit

Phase 3 runs on every audit, whatever Phases 1 and 2 found, over the code files in scope; where there are none, say so. It corrects what is wrong, documents what is absent in scope, and tightens what is padded. **Its default on an existing comment is to keep it, its next is to correct it, and deletion is limited to the closed list below.** A floor holds over every rule here: the comment on a public or exported symbol, a public structure member, or a package or module never drops below its sentence saying what it does, even where that sentence restates the name. When the body was not read, keep the comment and report it.

**Existing comments, public and private alike, are judged in this order; the first test that applies decides.** Before-and-after pairs are in [`existing-comments.md`](references/existing-comments.md).

1. **Drifted:** it states something the code no longer does. Correct it from the body, keeping wording that is still true.
2. **Wholly redundant:** every sentence restates the name and signature or the line beneath it, such as `// Increment counter`, with no reason, constraint, edge case, or warning. Delete it unless the floor holds it. This is one delete-list ground; the scope rule below applies.
3. **Verbose:** a fact worth keeping sits inside padding (restated parameters, a tour of the body, filler, hedging). Cut the padding sentences; the summary and every reason, constraint, edge case, or warning stay. This never removes a whole comment.
4. Otherwise it stays as written.

**The closed delete list.** Beyond test 2, delete only commented-out code, a comment about code that no longer exists with nothing to correct it towards, change narration ("now uses", "previously") stating no current fact, and, under the guard below, a use-site copy of what the declaration's comment says; narration that does state one is rewritten to it. A TODO stays unless its work is visibly done. Removing a comment because it is private, the function is short, or you would not have written it is a defect. **When unsure, keep it and report it.**

**Trim only inside the requested scope.** Tests 2 and 3 apply only to what the request resolved to: on a pull request, the files and code the diff touched; on a directory or component, everything in it; on a function, only that function. Elsewhere only test 1 applies.

- **Scope:** the code the scope rule above resolved to, covering its documentation comments, inline comments, and file-level headers, plus every `.md` file inside that scope which sits outside `docs/`. A file the rule did not resolve to stays out whatever it contains, so this phase is never a repository-wide sweep for markdown, for undocumented symbols, or for a comment pattern. On a pull request or working changes, write a missing comment only for a symbol the diff added or changed, and list the other undocumented symbols in those files in your output.
- **Actions:** scan for documentation and comments; read the current implementation of each documented element; verify it against actual code behaviour; apply the order above; document each public symbol in scope that lacks a comment. **Tightening works by whole sentences.** Under test 3, cut sentences restating the signature, re-describing members with their own comments, or touring the body. Keep every other sentence word for word; where a kept sentence leans on a cut one ("also", "these"), keep both or cut both. A summary sentence, and a sentence giving a reason, a constraint, an edge case, or a warning, always stay, so a why-comment is never cut for being reasoning. A reworded or merged sentence is a new claim needing its own proof (Rule 2). Correct a comment that is both wrong and long before tightening it.
- **Document the public surface in scope, from the body.** Every public or exported symbol in scope carries a documentation comment, as do the members of a public structure: fields, properties, keys, enum values. Open the body and write the comment from it, in the form the language's convention sets (a Go comment opens with the symbol's name, a Python docstring with a one-line summary): one sentence saying what the symbol does, written even where the name makes that obvious, since being obvious is not a defect on a public surface and being absent is. A second sentence is allowed only for an error, a constraint, or a caller obligation that a line of the body, a test assertion, a configuration value, or a decision record opened this run proves, and a comment you write stops there; an accurate existing comment gains no sentence except a fold or a deprecation's replacement (below). Write no reason or invariant you cannot quote. A member's comment states what the code in scope that sets or reads it shows. **Rule 2 still governs, and it comes first.** Not having got to the body is no reason to skip the symbol, and being unable to reach it is no reason to guess: leave it as it is and name it in your output. Undocumented and reported is compliant; a comment written from the symbol's name is the defect.
- **Do not restate what the language's own syntax declares**, such as a type, a visibility modifier, or an override marker. This governs what you write; an existing comment is judged by the order above, and a tag by the next bullet.
- **Correct an existing documentation tag; do not strip or delete it.** A parameter, return, throws, or example entry was written deliberately. Fix what is factually wrong and leave what is right, including parts a convention would omit in new code. Delete a whole tag only when it is wrong and uncorrectable, such as one documenting a parameter the signature no longer has.
- **New comments on private and internal code** are written only where the logic is complex or carries a gotcha, an edge case, a workaround, or a reason the code cannot show, and then as briefly as the fact allows: no comment restating a helper's name or signature, no parameter list repeating the signature, no tour of the body. This rule governs only what you write. It is never a reason to remove an existing comment, which the order above decides.
- **A fact is documented once, at its declaration.** A declaration, including an export or re-export statement, is not a use. A statement about a symbol belongs on its declaration, never above a line that reads, calls, or branches on it. Remove a copy above a use only when both sites are in scope, the declaration's body was read, and the copy says no more than the declaration's comment; fold any additional constraint into the declaration first. Otherwise leave both and report the copy.
- **Comments describe the code as it stands (Rule 4), and the test is to name the code.** Point at what each comment describes: a line, a block, the function or declaration it sits on, or the file. A comment explaining why the code beneath it is written the way it is describes that code and passes. A comment naming removed code is corrected towards its replacement, or deleted under the closed list. A note about a deliberate omission the code depends on and a file-level header also pass.
- **Form:** a documentation comment is a complete sentence, capitalized and punctuated; a short trailing comment may be a fragment. Wrap long comment lines to the width the file already uses, letting an unbreakable URL exceed it. Use the documentation format's own list syntax for enumerations. Never box a comment in asterisks or other decorative characters. Documentation precedes an annotation or decorator and never sits between it and the declaration.
- **Contracts worth stating, where the body shows them:** any cleanup the caller owns (a handle to close, a listener to remove, a subscription to cancel), the error values or exception types a caller can branch on, and a deprecation marker naming its replacement. Name an error or a duty only where the body or a callee you opened returns, raises, or requires it, and call a list of them complete only when every path through the body was read. A deprecation without migration directions is incomplete; add one only where it is provable under Rule 2.
- **File and package comments:** where the language has one, it says in one sentence what the file or package is for, in the language's conventional form (a Go package comment opens `Package auth`), and in a large package it may add a second naming the few entry points a caller starts from. It never lists or re-describes members that carry their own comments, which the language's generated reference already lists. A package comment summarizes every file it spans, so write one only once each of those files was read this run. Notes aimed at maintainers rather than consumers go with the implementation instead.
- **Output:** list the files changed and the kinds of change, or state "Phase 3: audited in-code documentation across X files, all accurate, no changes required." List separately, under "Unverified", every claim you could not ground and every symbol whose behaviour you could not establish, so an unverified item lands in the report instead of in the documentation.

---

## Context resolution

Some agents resolve the references below automatically. Where yours does not, resolve each one yourself, using the equivalent listed here, before starting. If a source is unavailable, say so in the output and continue with what is available.

| Reference            | What it refers to           | Resolve it yourself with                                                |
| -------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `#codebase`          | The project's own files     | Your file-search and file-read tools                                    |
| `#activePullRequest` | Active pull request         | The forge's pull request command, or `git diff <default-branch>...HEAD` |
| `#changes`           | Uncommitted working changes | `git diff` and `git diff --staged`                                      |

## Bundled references

Open one of these when the run needs its detail. Nothing here is loaded until you open it.

- [`evidence-and-citation.md`](references/evidence-and-citation.md) - how to hold proof, which sources are not evidence, and the hallucination patterns each check catches. Read before Phase 2 or 3 on an unfamiliar codebase.
- [`writing-for-both-readers.md`](references/writing-for-both-readers.md) - the ordering principle, the four things an opening carries, how to introduce a term of art, and the read-it-cold procedure, each with a before and after pair. Read before writing or revising the opening of a Markdown page.
- [`writing-guidelines.md`](references/writing-guidelines.md) - the prose rules for documents: voice, brevity, language, configuration references, citations, snippets, and formatting. Read before writing or changing a sentence in a Markdown page.
- [`voice-and-ai-tells.md`](references/voice-and-ai-tells.md) - the tell catalogue with a corrected rewrite for each. Read while writing or revising prose.
- [`existing-comments.md`](references/existing-comments.md) - before-and-after pairs for correcting, tightening, keeping, and deleting an existing code comment. Read before Phase 3 changes a comment.
- [`diagram-and-image-accessibility.md`](references/diagram-and-image-accessibility.md) - worked `accTitle` and `accDescr` examples, and how to choose a diagram type. Read before adding or editing a diagram.
- [`audit-report.template.md`](assets/audit-report.template.md) - the report shape for the end of the run.

## Bundled procedures, and when to run one

Five procedures ship with this skill, one per file under `agents/`. **The default is to run none of them.** Each is for work the main run cannot afford to do itself, and the scope rule in section 2 bounds what any of them receives: on a pull request they cover the changed set, not the tree. A small pull request should reach for nothing here.

| Procedure                                          | Run it when                                                                     | Skip it when                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`coverage-mapper`](agents/coverage-mapper.md)     | scope is the whole documentation set, or the change adds or removes a component | scope is a single named document                               |
| [`curation-reviewer`](agents/curation-reviewer.md) | a document was created, substantially rewritten, or given new prose             | only a factual correction inside an existing sentence was made |
| [`diagram-reviewer`](agents/diagram-reviewer.md)   | a document contains a diagram, or describes a flow of five or more steps        | neither is true                                                |
| [`surface-auditor`](agents/surface-auditor.md)     | the scope holds code files, including a change to their comments alone          | the scope holds no code file                                   |
| [`claim-verifier`](agents/claim-verifier.md)       | a claim you cannot ground from a file already open                              | the proof is already in hand                                   |

**Open the file and follow it yourself.** That is the way to run one, it works wherever this skill is installed, and it cannot fail. Where your host registers these files as agents you can delegate to, handing one off is an option that keeps the reading out of this context. Where delegating is unavailable, names an agent the host does not recognize, or errors, fall back to opening the file. **Never improvise instructions from a procedure's name or from this table's one-line summary of it.** What makes a procedure safe to run is the scope bound and the evidence bar written inside it, and neither survives being paraphrased.

Each procedure reports findings rather than edits, so every decision stays with this run. **A returned finding is a lead to verify, never a source to publish from.** It names a file and a symbol for you to open, and Rule 2 governs from there: nothing built on a returned summary is grounded until you have opened that file yourself. A summary is not a source, whoever produced it.

---

## 3. Writing Guidelines

The prose rules for documents (voice, brevity, language, configuration references, citations, snippets, and formatting) are in [`writing-guidelines.md`](references/writing-guidelines.md). Open it before writing or changing a sentence in a Markdown page.

---

## 4. Architecture & Logic Flows

Include a step only if it meets all three criteria:

1. **User-visible impact:** it affects end-user experience or external behaviour.
2. **State or data transformation:** it changes data, state, or the execution path.
3. **Cannot be removed:** removing it would break functionality or change a user-observable outcome.

Exclude logging, metrics, telemetry, trivial validation, internal utilities, and debug code, unless the system you are documenting _is_ observability.

---

## 5. Mermaid Diagrams

**Create for:** multi-service interactions, state machines, data pipelines, flows of 5+ steps, user journeys, dependency graphs. **Skip for:** trivial logic, basic CRUD, or repeating a short list. Apply the significance filter from §4.

- Valid Mermaid syntax only, reflecting current code and never hypothetical structures. No ASCII art, static images, or `style`/colour customizations. Include `accTitle` and `accDescr` (Rule 5). Choose the fitting type (`flowchart`, `sequenceDiagram`, `classDiagram`, `stateDiagram`, `journey`, `C4Context`, `mindmap`, `xychart`, `kanban`, `architecture-beta`, `treemap-beta`), never defaulting to `flowchart` unless it is the best fit.

---

## 6. Pre-output Checklist

Before finishing, check the work against the list below and fix what fails inside the scope.

**Re-verify every sentence you wrote or changed (highest priority)**, in documents and comments alike: search the file as it now reads for the proof string you recorded and confirm it states the claim at the strength you wrote it. Where it does not, delete a sentence you wrote and restore one you changed. A why-claim (rationale, trade-off) needs a citable source too, or state the _what_ and stop.

Then confirm:

- Only files inside the scope changed, each by the tier that admitted it (section 2), and every file is at the path and name it had when the run started unless the invoking task asked for the change or the user approved it.
- Only documentation changed: no executable code, config values, tests, or dependencies (unless the invoking task explicitly asked for code changes). Pre-existing content changed only on a ground a phase, Rule 6, or the dash rule gives; every sentence kept reads as it did.
- No hedging ("appears to", "seems to", "likely", "probably", "should", "will"), no new subjective adjectives, and no pasted implementation.
- Every existing list, table, and code block kept its form; any code block removed was a transcription now replaced by a link.
- Every file reference is a clickable link resolving to a file, not a directory. Configuration references name the value a consumer changes it by.
- Acronyms you wrote are capitalized and expanded on first use (exceptions: brand/tool/package names, domain terms, code references).
- New or changed prose reads as a careful human wrote it: leads with the point, no signposting or banned AI tells, one canonical term per concept spelled identically in every document you edited in full, no ambiguous `it`/`this`/`these`.
- Every document you wrote or reworked opens by naming its subject and why a reader would reach for it, states what that reader must already have or have read, and introduces every acronym, term of art, and named component the first time it uses one.
- **Read each document you edited in full once as the newcomer**, who has not seen this codebase, fix a missing introduction, subject, or prerequisite where you find one, name in your output anything left, or state that nothing stops them: a page only its author can follow is not finished. Then read it as the experienced reader, for whom a paragraph they could have got faster from the source has not earned its place either; there the fix is what the paragraph fails to add, not deletion by default.
- Architecture flows include only significant steps (§4); every diagram has `accTitle` and `accDescr`, and every image has real alt text.
- No em-dashes (`—`) or en-dashes (`–`) anywhere you wrote; new or changed prose uses Canadian English.
- Every public symbol you touched carries a documentation comment written from its implementation, not from its name, any comment you wrote is at most two sentences, no accurate existing comment gained a sentence except a fold or a deprecation's replacement, and no comment narrates a change, names something that no longer exists, argues the code is safe, or sits commented out. No comment you added sits above a usage site rather than a declaration, and every comment you removed as a repetition either said no more than the declaration's or had what it added folded into the declaration first.
- Rendered output was checked, not only the source: diagrams parse, nested lists render, and documentation comments display the intended text. Every table you touched was re-read whole, with each row's cell count matching its header and no cell broken across lines.
- Every document you created sits in an existing home or in a directory whose existing documents are the same Diátaxis type, and your output names what decided it.
- Every comment you deleted is on Phase 3's closed delete list, none was removed for being private, internal, inside a body, or reasoning, and every drifted comment was corrected rather than removed.
- Every tightened comment lost whole padding sentences only, kept its summary and every reason, constraint, edge case, and warning, and sits inside the requested scope (Phase 3).
- No documentation comment on a public or exported symbol, public structure member, package, or module was deleted or cut below one sentence; wrong or absent-content claims were corrected from the body, and comments whose bodies were not read were kept and reported.
- Every document you edited in full, judged as a whole rather than paragraph by paragraph, is no longer than a careful human would have written for the same brief (Rule 6), and any split or move you judged necessary was asked about or proposed rather than made.
- A passage you wrote that stayed long after Rule 6's trim was weighed for a complementary diagram, table, code/config snippet, or image (Rule 6), and one was added where it fit the content.
- Phase 3 ran and its result is reported.
