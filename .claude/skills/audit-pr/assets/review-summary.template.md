# Review summary template

Copy the blocks below into the review output and replace every bracketed placeholder. One finding block per finding, in severity order, then one closing summary at the end of the run.

- [Per-finding block](#per-finding-block)
- [Worked finding examples](#worked-finding-examples)
- [Closing summary block](#closing-summary-block)
- [Choosing the verdict line](#choosing-the-verdict-line)
- [Counting the quick stats and naming skipped categories](#counting-the-quick-stats-and-naming-skipped-categories)
- [Checks to run before the summary ships](#checks-to-run-before-the-summary-ships)

## Per-finding block

```text
### [🔴 blocking | 🟡 should fix | 🔵 suggestion | ✅ positive] [Short title, roughly eight words or fewer]

**File:** `[path/to/file.ext]`
**Category:** [category name, spelled as the triage table spells it]
**Changed line:** `[the line as the diff shows it, character for character]`

**Issue:** [what is wrong]. [what can go wrong, and the input or state that triggers it]. [the rule, standard, or project convention it violates]

**Suggested fix:** [corrected snippet or pseudocode, in the language of the file]
```

Filling rules that decide whether the block is usable:

- **Changed line** is copied, not retyped: keep the indentation, the spelling, and any trailing comma. Quote one line; where the defect needs two, quote both and no more. If you cannot produce the quote, the finding does not ship.
- **Issue** answers three questions in order and stops. A sentence that only restates the quoted line adds nothing.
- **Suggested fix** is deleted, along with its blank line, for a question and for every ✅ positive. A fix you could not verify is labelled `(unverified: [what would confirm it])`.
- One defect per block. Where the same defect repeats across files, write one block and list the other paths at the end of **Issue** rather than repeating the block.
- Pre-existing code that this change makes wrong is labelled `(pre-existing)` in the title.

## Worked finding examples

Two filled blocks, one at each end of the severity range.

```text
### 🟡 should fix Retry loop has no attempt ceiling

**File:** `services/billing/sync.py`
**Category:** Error handling and resilience
**Changed line:** `    while not response.ok:`

**Issue:** The loop repeats until the call succeeds, with no attempt cap, no backoff, and no timeout on the caller. A payment host returning 500 for a sustained period turns one user action into unbounded call volume against a metered endpoint. The other client in this package caps attempts at five.

**Suggested fix:**

for attempt in range(MAX_RETRIES):
    response = post(url, json=payload)
    if response.ok:
        break
    sleep(backoff(attempt))
```

```text
### ✅ positive Shutdown reaches a worker blocked on a receive

**File:** `internal/worker/pool.go`
**Category:** Concurrency and shared state
**Changed line:** `	case <-ctx.Done():`

**Issue:** Cancellation travels through the context, so a worker parked on a channel receive returns instead of holding the pool open. Two call sites can request shutdown without racing to close the same channel, which removes the double-close panic path.
```

The positive block carries no **Suggested fix** line and still names a file, a category, and a quoted line.

## Closing summary block

```markdown
## Overall verdict: [APPROVED | APPROVED WITH SUGGESTIONS | CHANGES REQUESTED]

### Quick stats

- **Files reviewed:** [N] of [M] changed files
- **Findings:** [N] blocking · [N] should fix · [N] suggestions · [N] positive
- **Findings dropped in refutation:** [N]
- **Categories skipped:** [category] ([reason]); [category] ([reason])

### Alignment

[One to three sentences on whether the code does what the title, description, or ticket says. Name any gap, scope creep, or unfinished piece. State where the intent came from when no ticket was reachable.]

### Top concerns

- [Issue that must be resolved before merge, one line each, in the order to resolve them. Write "None." when there are none.]

### What is done well

- [Specific pattern, with the file it appears in. Same evidence standard as any other finding: no file and no quoted line, no entry.]

### Before merging

- [ ] [Action item: the change to make, and where]
- [ ] [Action item]
```

## Choosing the verdict line

Set the verdict from the surviving severity counts, then read it back against them.

| Surviving findings                                 | Verdict                   |
| -------------------------------------------------- | ------------------------- |
| One or more 🔴 blocking                            | CHANGES REQUESTED         |
| No 🔴, at least one 🟡 should fix or 🔵 suggestion | APPROVED WITH SUGGESTIONS |
| Only ✅ positive, or nothing                       | APPROVED                  |

Three ways the line goes wrong:

- A blocking finding is reworded as a suggestion so the verdict can read APPROVED. Change the verdict, not the severity.
- A category was entered but its evidence was unavailable (a source that could not be fetched, a tool that could not run). The verdict states that limit in the same line rather than assuming the missing evidence is clean.
- The diff is too large to review with confidence. Say so on the verdict line, because it governs how much the rest of the summary is worth.

## Counting the quick stats and naming skipped categories

- **Files reviewed** is the number of changed files you opened. When that is lower than the number of files in the diff, both numbers appear, and the gap is explained in **Alignment** or **Top concerns**.
- **Findings** counts blocks that survived refutation. The four numbers added together equal the number of finding blocks above the summary. Recount rather than estimating.
- **Findings dropped in refutation** is the count deleted during the refutation pass. Zero is a claim that every drafted finding held up; verify it before writing it.
- **Categories skipped** names each one with its reason. "No trigger in this diff" is a complete reason. A category you entered and found nothing in was not skipped: it belongs in the body as a one-line statement that it is clear.

## Checks to run before the summary ships

1. No bracketed placeholder survives anywhere in the output, including inside a suggested fix.
2. Every severity count matches the blocks, and the verdict matches the counts.
3. Every quoted line still appears in the diff, spelled as quoted.
4. No ✅ block carries a suggested fix, and no 🔴 block lacks one.
5. Every **Before merging** item traces to a finding block above, and every 🔴 finding has an item.
6. No file path is cited that you did not open.
