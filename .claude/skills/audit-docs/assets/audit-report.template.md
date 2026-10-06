# Documentation audit report template

Copy this skeleton, replace every bracketed placeholder, and delete each parenthetical hint once the text beside it is written. `[REDACTED]` is the one exception: it marks a credential value withheld on purpose, and it is left in place. Keep every heading: a section with nothing to report gets its stated empty-case line, because a deleted section reads as a phase that never ran.

- [How to complete this template](#how-to-complete-this-template)
- [Audit scope and summary](#audit-scope-and-summary)
- [Phase 1 result: pull request sync](#phase-1-result-pull-request-sync)
- [Phase 2 result: documentation directory audit](#phase-2-result-documentation-directory-audit)
- [Phase 3 result: in-code documentation audit](#phase-3-result-in-code-documentation-audit)
- [Files changed and kind of change](#files-changed-and-kind-of-change)
- [Unverified claims and symbols](#unverified-claims-and-symbols)
- [Observed outside scope, not changed](#observed-outside-scope-not-changed)
- [Code problems observed, not changed](#code-problems-observed-not-changed)
- [Checks before returning this report](#checks-before-returning-this-report)

## How to complete this template

(Delete this section from the finished report.)

- Name files in a code span, not a markdown link. This report is text returned to whoever asked for the audit, so a relative path from it resolves nowhere.
- A phase result states what changed or states that the documentation already matched the code. It does not narrate the search.
- Counts are literal: "read 14 files" means 14 files were opened during this run.
- Any statement that needed a hedge belongs under Unverified rather than in a phase result with the hedge attached.

## Audit scope and summary

[what you audited] over [scope as it resolved: the active pull request, the uncommitted working changes, or the paths named in the request]. Read [count] files, changed [count]. [One or two sentences on what the audit found overall.]

(Name the scope as it resolved, not as it was requested: if the request said "the active pull request" and none existed, say the scope fell back to the working changes and name them.)

Requested change: [the specific change the request asked for, and whether it was made; if not, why. Write "none, this was an audit" when the request asked for no specific change].

Sources that could not be resolved this run: [name each one and what you used instead, or write "none"].

## Phase 1 result: pull request sync

**Status:** [changed / already accurate / not applicable, no pull request or working changes found]

- `[document]`: [behaviour the diff changed, and the statement that now describes it]. Grounded in `[symbol]` in `[file]`.
- `[document]`: already described the changed behaviour correctly, left as it stands.

(Cover only behaviour the diff changed. A document that was already correct for a diff hunk is a result worth stating, so name it rather than omitting it.)

## Phase 2 result: documentation directory audit

**Status:** [changed / already accurate]

- Corrected `[document]`: [the statement that contradicted the code] replaced with [the statement the code supports], from `[symbol]` in `[file]`.
- Deleted [section] from `[document]`: [repeats a point the page already makes / duplicated in `[document]` / describes a removed feature / cannot be corrected].
- Proposed, not performed: [split / move / rename / delete] of `[document]`, because [reason], with [which sections go where, or the new path]. Asked the user: [yes, and they declined / no, the host could not ask].
- Performed on the user's approval: [split / merge / move / rename / delete / new directory] of `[document]`, asked because [reason].
- Created `[new document]`: [why no existing document was a home for it], filed as [tutorial / how-to guide / reference / explanation].
- Oriented `[document]`: [the acronym, term of art, prerequisite, or missing statement of subject that stopped a first-time reader] introduced at [where].

**Both readers, one line per document you edited in full:**

| Document | Newcomer                                                                   | Experienced reader                                                                              |
| -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `[path]` | [served, or the first place a reader who has not seen this codebase stops] | [served, or the paragraph they could get faster from the source, and what it would have to add] |

**Entry path:** [present, naming the document that takes a first-time reader through one task end to end / absent, and what a first-time reader has to read instead].

**Length:** [passages repeated within a document you edited in full, and whether each was removed or proposed for removal, or write "none found"].

(Deletion needs one of the four listed reasons. Anything else is a correction. A file is split, merged, moved, renamed, or deleted only where the request asked or the user approved it when asked; otherwise it is proposed above. A created file needs the structure check stated first: which existing homes were considered and why each did not fit. The entry path is reported whether or not it was written, and it is written only where the invoking task asked for it.)

## Phase 3 result: in-code documentation audit

**Status:** [changed / audited in-code documentation across [count] files, all accurate, no changes required]

- `[file]`: [kind of change, such as documented a public symbol, corrected a parameter entry that named a removed argument, removed a comment that restated its line, removed an orphaned TODO, kept one copy of a repeated comment on the declaration of `[symbol]` and removed [count] copies above usage sites, cut sentences restating the code or re-describing members from the comment on `[symbol]`, keeping the rest word for word].
- `[file]`: [kind of change].

Public symbols left as they stand because their implementation was not read: [`Cache::evict` in `[file]`, `settle_invoice` in `[file]`, or write "none"].

Undocumented public symbols outside the change, listed rather than documented: [`Pool::resize` in `[file]`, or write "none"].

(Every symbol left as it stands because its implementation was not read also gets an entry under Unverified. Leaving a public symbol undocumented and reporting it is a result; writing its comment from its name is not.)

## Files changed and kind of change

| File     | Kind of change                                                 |
| -------- | -------------------------------------------------------------- |
| `[path]` | [corrected a factual statement about `[symbol]`]               |
| `[path]` | [documented [count] previously undocumented public symbols]    |
| `[path]` | [created, [tutorial / how-to guide / reference / explanation]] |

Kinds to choose from: made the change the request asked for, corrected a factual statement, documented a public symbol, retained a public documentation comment at its one-sentence floor, corrected an existing documentation tag, corrected a drifted comment, removed a comment on the closed delete list (commented-out code, restating its code with nothing more, about code that no longer exists, change narration with no current fact, or a use-site comment that says no more than the declaration's comment, removed only when both sites were in scope, the declaration body was read, and any additional constraint was folded into the declaration), cut sentences from a comment, removed a duplicated section, replaced a transcribed code block with a link, introduced a term on first use, added orientation for a first-time reader, created, and, only where the request asked or the user approved it, renamed, moved, split, merged, or deleted.

(One row per file, not one per edit. If no file changed, replace the table with "No files changed.")

## Unverified claims and symbols

An entry here is a result rather than a failure: the alternative is a sentence in the documentation that no reader can check.

- Claim: [the statement that could not be grounded]. Blocked by: [the file could not be opened / the behaviour crosses into a dependency outside the tree / two locations disagree and neither settles it]. Settled by: [what would ground it, such as reading a specific file or running a specific test].
- Symbol: `OrderService.cancel` in `[file]`. Behaviour could not be established because [reason]. Left as it stands, no comment written.
- Reference: `[path or anchor]` cited by `[document]` does not resolve. Action taken: [statement corrected / statement removed / left in place, needs a decision from a maintainer].

(Write "Nothing unverified" only when that is true. Do not move an item into the documentation to empty this list.)

## Observed outside scope, not changed

A document or file this run opened but was not allowed to edit stays as it was found, and anything noticed in it is reported here instead.

- `[path]`: [the finding, such as a stale term, a newcomer blocker, or a sentence the change did not make false]. Why it was out of scope: [opened for context / outside the files the request or diff named].

(Write "None observed" if there are none.)

## Code problems observed, not changed

This run edits documentation, so a code defect is reported here and left alone. Give each entry enough for someone else to reproduce it without repeating the audit.

- `[file]`, `[symbol]`: [the defect stated as behaviour, for example "`settle_invoice` returns a null value for a zero-amount invoice, and each of its three callers dereferences the result"]. Evidence: `[short string copied from the source]`.
- `[file]`, `[symbol]`: [a behaviour an existing comment claimed and the code does not perform]. The comment was corrected to match the code; the code was left as it stands.

(Write "None observed" if there are none. A defect fixed rather than reported is a scope breach, so say plainly if the invoking task authorized a code change.)

## Checks before returning this report

(Delete this section from the finished report.)

- Every phase carries a status line, including a phase whose answer is that the documentation was already accurate.
- Every symbol reported in Phase 3 as left as it stands because its implementation was not read also appears under Unverified.
- No documentation comment on a public or exported symbol, public structure member, package, or module was deleted or cut below one sentence.
- Every comment removed, public or private, documentation or inline, is on the closed delete list; every other comment was kept, corrected, or tightened by whole sentences inside the requested scope.
- Every file changed is inside the scope, and none was renamed, moved, split, or deleted unless the request asked for it or the user approved it.
- Every file named in a phase result appears in the files changed table, and every row of that table is a file that was edited.
- The file count in the summary matches the number of rows in the table.
- No hedge ("appears to", "seems to", "likely", "probably") survives anywhere in the report.
- No entry in the code problems section describes an edit that was made.
