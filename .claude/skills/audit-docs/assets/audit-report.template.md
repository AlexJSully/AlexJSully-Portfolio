# Documentation audit report template

Copy this skeleton, replace every bracketed placeholder, and delete each parenthetical hint once the text beside it is written. `[REDACTED]` is the one exception: it marks a credential value withheld on purpose, and it is left in place. Keep every heading: a section with nothing to report gets its stated empty-case line, because a deleted section reads as a phase that never ran.

- [How to complete this template](#how-to-complete-this-template)
- [Audit scope and summary](#audit-scope-and-summary)
- [Phase 1 result: pull request sync](#phase-1-result-pull-request-sync)
- [Phase 2 result: documentation directory audit](#phase-2-result-documentation-directory-audit)
- [Phase 3 result: in-code documentation audit](#phase-3-result-in-code-documentation-audit)
- [Files changed and kind of change](#files-changed-and-kind-of-change)
- [Unverified claims and symbols](#unverified-claims-and-symbols)
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

Sources that could not be resolved this run: [name each one and what you used instead, or write "none"].

## Phase 1 result: pull request sync

**Status:** [changed / already accurate / not applicable, no pull request or working changes found]

- `[document]`: [behaviour the diff changed, and the statement that now describes it]. Grounded in `[symbol]` in `[file]`.
- `[document]`: already described the changed behaviour correctly, left as it stands.

(Cover only behaviour the diff changed. A document that was already correct for a diff hunk is a result worth stating, so name it rather than omitting it.)

## Phase 2 result: documentation directory audit

**Status:** [changed / already accurate]

- Corrected `[document]`: [the statement that contradicted the code] replaced with [the statement the code supports], from `[symbol]` in `[file]`.
- Deleted [section] from `[document]`: [describes a removed feature / duplicated in `[document]` / cannot be corrected].
- Created `[new document]`: [why no existing document was a home for it], filed as [tutorial / how-to guide / reference / explanation].
- Oriented `[document]`: [the acronym, term of art, prerequisite, or missing statement of subject that stopped a first-time reader] introduced at [where].

**Both readers, one line per document opened:**

| Document | Newcomer                                                                   | Experienced reader                                                                              |
| -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `[path]` | [served, or the first place a reader who has not seen this codebase stops] | [served, or the paragraph they could get faster from the source, and what it would have to add] |

**Entry path:** [present, naming the document that takes a first-time reader through one task end to end / absent, and what a first-time reader has to read instead].

(Deletion needs one of the three listed reasons. Anything else is a correction. A created file needs the structure check stated first: which existing homes were considered and why each did not fit. The entry path is reported whether or not it was written, and it is written only where the invoking task asked for it.)

## Phase 3 result: in-code documentation audit

**Status:** [changed / audited in-code documentation across [count] files, all accurate, no changes required]

- `[file]`: [kind of change, such as documented a public symbol, corrected a parameter entry that named a removed argument, removed a comment that restated its line, removed an orphaned TODO, kept one copy of a repeated comment on the declaration of `[symbol]` and removed [count] copies above usage sites].
- `[file]`: [kind of change].

Public symbols left as they stand because their implementation was not read: [`Cache::evict` in `[file]`, `settle_invoice` in `[file]`, or write "none"].

(Every symbol listed on that last line also gets an entry under Unverified. Leaving a public symbol undocumented and reporting it is a result; writing its comment from its name is not.)

## Files changed and kind of change

| File     | Kind of change                                                 |
| -------- | -------------------------------------------------------------- |
| `[path]` | [corrected a factual statement about `[symbol]`]               |
| `[path]` | [documented [count] previously undocumented public symbols]    |
| `[path]` | [created, [tutorial / how-to guide / reference / explanation]] |

Kinds to choose from: corrected a factual statement, documented a public symbol, corrected an existing documentation tag, removed an outdated or restating comment, removed a comment repeated above a usage site, removed a duplicated section, introduced a term on first use, added orientation for a first-time reader, created, deleted.

(One row per file, not one per edit. If no file changed, replace the table with "No files changed.")

## Unverified claims and symbols

An entry here is a result rather than a failure: the alternative is a sentence in the documentation that no reader can check.

- Claim: [the statement that could not be grounded]. Blocked by: [the file could not be opened / the behaviour crosses into a dependency outside the tree / two locations disagree and neither settles it]. Settled by: [what would ground it, such as reading a specific file or running a specific test].
- Symbol: `OrderService.cancel` in `[file]`. Behaviour could not be established because [reason]. Left as it stands, no comment written.
- Reference: `[path or anchor]` cited by `[document]` does not resolve. Action taken: [statement corrected / statement removed / left in place, needs a decision from a maintainer].

(Write "Nothing unverified" only when that is true. Do not move an item into the documentation to empty this list.)

## Code problems observed, not changed

This run edits documentation, so a code defect is reported here and left alone. Give each entry enough for someone else to reproduce it without repeating the audit.

- `[file]`, `[symbol]`: [the defect stated as behaviour, for example "`settle_invoice` returns a null value for a zero-amount invoice, and each of its three callers dereferences the result"]. Evidence: `[short string copied from the source]`.
- `[file]`, `[symbol]`: [a behaviour an existing comment claimed and the code does not perform]. The comment was corrected to match the code; the code was left as it stands.

(Write "None observed" if there are none. A defect fixed rather than reported is a scope breach, so say plainly if the invoking task authorized a code change.)

## Checks before returning this report

(Delete this section from the finished report.)

- Every phase carries a status line, including a phase whose answer is that the documentation was already accurate.
- Every symbol reported as left undocumented in Phase 3 also appears under Unverified.
- Every file named in a phase result appears in the files changed table, and every row of that table is a file that was edited.
- The file count in the summary matches the number of rows in the table.
- No hedge ("appears to", "seems to", "likely", "probably") survives anywhere in the report.
- No entry in the code problems section describes an edit that was made.
