# Review summary template

Copy the blocks below into the review output and replace every bracketed placeholder. `[REDACTED]` is the one exception: it marks a credential value withheld on purpose, and it is left in place. One finding block per finding, in severity order, then one closing summary at the end of the run.

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
**Changed line:** `[the line as the diff shows it, with any credential value replaced by [REDACTED]]`
**Measured:** [structural findings only: the count, how it was obtained, and what it is measured against]
**Looked up:** [reuse findings only: the sources checked in order, and the symbol that already provides the behaviour]
**Principle:** [architecture and design findings only: the named principle or coupling type this unit violates]

**Issue:** [what is wrong]. [what can go wrong, and the input or state that triggers it]. [the rule, standard, or project convention it violates]

**Suggested fix:** [the corrected code, in the language of the file]
```

Filling rules that decide whether the block is usable:

- **Changed line** is copied, not retyped: keep the indentation, the spelling, and any trailing comma. Quote one line; where the defect needs two, quote both and no more. Where the line holds a credential value, such as a token, a password, an API key, a private key, or a session identifier, write `[REDACTED]` in place of that value and keep the rest of the line as it reads. Make the substitution here and nowhere earlier, because the checks below search the diff for the line as it stands. A redacted quote is a quote, so the finding still ships. If you cannot produce the quote at all, the finding does not ship, unless it carries **Measured** instead under the next rule.
- **Measured** replaces **Changed line** on a finding no single line can carry, and fills all three parts, since a number alone reads as a fact rather than a defect: the count, how it was obtained, and what it is measured against. A bare number has nothing for the refutation pass to check.
- **Looked up** replaces neither field and sits beside them on a reuse finding: the sources checked in the order the review gives them, and the symbol that settles it. A finding claiming nothing already provides the behaviour carries this field too, naming what was opened and what was searched, because that claim cannot be checked without it. Name each file; never quote a credentialed registry URL out of a lockfile into the field.
- **Principle** sits on an architecture or design finding and names one principle from the maintainability lens, with one clause saying how this unit violates it. A finding that cannot name one is describing taste rather than a defect, and it is dropped rather than reworded. Omit the field on every other category.
- **Issue** answers three questions in order and stops. A sentence that only restates the quoted line adds nothing, and every step of the chain it describes has to be one you can point at in the file.
- **Suggested fix** carries code, not a description of code. Write the corrected form in the file's own language, complete enough to paste. Prose belongs here only where the finding is not about code, such as a process or a documentation gap. The field is deleted, along with its blank line, for a question and for every ✅ positive. A fix you could not verify keeps its code and is labelled `(unverified: [what would confirm it])`.
- One defect per block. Where the same defect repeats across files, write one block and list the other paths at the end of **Issue** rather than repeating the block.
- Pre-existing code that this change makes wrong is labelled `(pre-existing)` in the title.

## Worked finding examples

Four filled blocks: two at the ends of the severity range, then the two evidence shapes, one carrying no quoted line and one carrying a quoted line beside a lookup.

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

Two more, showing how the two evidence fields are filled.

```text
### 🟡 should fix Utility takes two behaviour switches

**File:** `src/lib/collect.ts`
**Category:** Architecture and design
**Measured:** 3 parameters on `collectEntries`, 1 supplying data and 2 switching behaviour, from the signature, against 0 switches on `flattenNodes` and 0 on `countLeaves`, the two other exported functions in the same module
**Principle:** single responsibility: the unit traverses, filters, and orders, so three reasons to change sit in one name

**Issue:** `filter` and `flip` are branched on rather than operated on, so one exported name carries three behaviours and every caller reads the two booleans at the call site to know which it gets. The module is a utility by its own path and its exports, where a caller cannot see the body. Adding a fourth mode doubles the branches again, and no caller can reuse the traversal without also choosing a filter and a direction.

**Suggested fix:**

export function collectEntries(node: Node): Entry[]
export function keepMatching(entries: Entry[], match: Matcher): Entry[]
export function reverseOrder(entries: Entry[]): Entry[]
```

```text
### 🔴 blocking Hand-written digest comparison beside the library that exports one

**File:** `src/main/java/app/TokenVerifier.java`
**Category:** Security
**Changed line:** `        for (int i = 0; i < expected.length; i++) {`
**Looked up:** the file's own imports, then the manifest and its lockfile; `java.security.MessageDigest`, already imported two lines above, exports `isEqual` for exactly this comparison

**Issue:** The loop returns as soon as two bytes differ, so the time it takes reveals how many leading bytes of the digest were guessed correctly, and an attacker recovers the token one byte at a time. The comparison settles an authorization outcome, and the class already imports the module whose `isEqual` performs it in constant time. Reading cannot show a hand-written primitive correct, and its failures are silent.

**Suggested fix:**

if (!MessageDigest.isEqual(expected, presented)) {
    throw new SecurityException("token mismatch");
}
```

The first block carries **Measured** and **Principle** and no **Changed line**, because no single line shows a signature carrying two switches and an architecture finding names the principle it rests on. The second carries both a quoted line and **Looked up**, because the defect is a line and the fix is a symbol the file already had.

## Closing summary block

```markdown
## Overall verdict: [APPROVED | APPROVED WITH SUGGESTIONS | CHANGES REQUESTED]

### Quick stats

- **Files reviewed:** [N] of [M] changed files
- **Findings:** [N] blocking · [N] should fix · [N] suggestions · [N] positive
- **Findings dropped in refutation:** [N]
- **Reuse lookups:** [N] blocks checked against what the project already has, naming each source opened
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
- **Reuse lookups** counts the blocks whose behaviour was checked against what the project already has, naming each manifest, lockfile, module, or import list opened. Zero on a change that adds a function is a claim that nothing it wrote was already available, and that claim needs the same evidence as any other.
- **Categories skipped** names each one with its reason. "No trigger in this diff" is a complete reason. A category you entered and found nothing in was not skipped: it belongs in the body as a one-line statement that it is clear.

## Checks to run before the summary ships

1. No bracketed placeholder survives anywhere in the output, including inside a suggested fix. `[REDACTED]` is not a placeholder and is left in place.
2. Every severity count matches the blocks, and the verdict matches the counts.
3. Every quoted line still appears in the diff, spelled as it reads there. A line carrying `[REDACTED]` is checked on the text around that placeholder, and never by recovering the value it stands for.
4. No ✅ block carries a suggested fix, and no 🔴 block lacks one. Every fix on a code finding is code rather than a description of code.
5. Every step of every **Issue** points at a line in the file, so no block explains the defect by a mechanism the code does not carry.
6. Every **Before merging** item traces to a finding block above, and every 🔴 finding has an item.
7. No file path is cited that you did not open.
8. Every structural finding carries **Measured** with all three parts, and every reuse finding carries **Looked up** naming the sources opened.
9. Every architecture and design finding carries **Principle** naming one from the maintainability lens. A block that cannot name one was dropped rather than reworded into a suggestion.
