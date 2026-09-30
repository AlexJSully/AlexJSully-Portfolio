# Writing guidelines

The prose rules for every sentence this audit writes or changes in a Markdown page. `SKILL.md` names this file where a rule depends on it; open it before writing or changing a sentence in a document.

- [Voice](#voice)
- [Brevity & style](#brevity--style)
- [Language](#language)
- [Configuration references](#configuration-references)
- [File citations & references (strictly enforced)](#file-citations--references-strictly-enforced)
- [Code snippets](#code-snippets)
- [Formatting](#formatting)

## Voice

Write as a careful human technical writer: formal and neutral, never robotic. The robotic feel comes from the tells below, not from a formal register, so cut the tells and keep the register.

- **Lead with the point**, putting the conclusion, answer, or action in the first sentence. **Show, do not tell:** demonstrate with a command, number, cited line, or named edge case instead of asserting significance. Vary sentence length where natural, without forcing a cadence target.
- **Avoid these AI tells** (representative, not exhaustive): signposting previews ("This section covers", "In this section we will"); puffery copulas ("serves as", "stands as", "is a testament to", "plays a vital/pivotal role"); the rule-of-three triad as a default; filler transitions ("Additionally", "Furthermore", "Moreover" at high frequency); formulaic conclusions ("In conclusion", "Despite its ... it faces challenges"); and padded words such as delve, leverage, underscore, showcase, intricate, vibrant, foster, tapestry, seamless. Keep a word when it is factually correct in context (a test `harness`, an OAuth `realm`).
- **A why-claim is still a claim (Rule 2).** Cite the comment, design record, commit, test, or config that proves a rationale or trade-off, or state the _what_ and stop.
- **Scope.** Apply this only to prose you add or change; do not rewrite accurate existing prose for rhythm (Phase 2, Rule 1). Introducing a term, naming a subject, or stating a prerequisite is an addition rather than a rewrite, so it is made in a document you edit in full even where the surrounding prose is accurate. It governs `docs/` prose, not in-code documentation, which Phase 3 keeps terse.
- **Stay formal.** No contractions, casual asides, emoji, or detector-evasion tricks. Naturalness comes from cutting tells, not from informality.

## Brevity & style

- Use prose to carry reasoning (the _why_ and _how_); reserve bullets and numbered lists for genuine enumerations (steps, options, fields, parameters). Do not force explanation into parallel bullet fragments, and do not de-list a real list: enumerations stay lists, scannable for people and easy to retrieve. No walls of text. **Concise, not choppy:** no line-by-line narration, but keep the connective prose that carries logic. Lead each paragraph and section with its point, then give the detail.
- **Tables only for uniform data scanned quickly**, meaning many parallel items with distinct attributes. If columns repeat across rows, cells sit empty, or a cell holds a sentence of prose, use a list with sub-headings instead.

## Language

- **No em-dashes or en-dashes.** Never write `—` (em-dash) or `–` (en-dash). Replace each with the grammatically appropriate punctuation: a comma, parenthesis, colon, separate sentence, or a spaced hyphen `-`. The plain hyphen `-` is fine wherever it is grammatically correct, including the `-` separator between a label and a brief description in lists (e.g. `**Label** ([file](path)) - what it does`). When an audit edits a document in full, replace that document's existing em-dashes and en-dashes the same way; do not sweep any other file.
- **Canadian English (strong preference).** Spelling you write or change uses Canadian forms: colour, behaviour, favour, licence (noun), centre, defence, and `-ize`/`-ization` (standardize, organization, recognize). See the [Canadian spelling guide](https://our-languages.canada.ca/en/blogue-blog/canadian-spelling-eng). Do not retroactively convert existing American prose; apply this only to text you add or change. **Never** alter code identifiers, config or JSON keys, quoted code, file or package names, CSS properties, or API names (`user_id`, `maxRetries`, and the like stay exactly as written).
- **Acronyms and terms of art.** In prose you write or edit, write acronyms in capitals (ID, URL, API) and, on first use per document, give the full term first, e.g. "Deoxyribonucleic acid (DNA)", then the bare acronym after. Keep exact casing in three cases: an established brand, tool, or package name (npm, iOS, ESLint), an intentional domain term (snRNA, mRNA), and a direct code reference (a method, field, env var, or config key, such as an `id` property, stays as written in the code). **Expanding an acronym is not introducing it**, since an expansion is often as opaque as the abbreviation. A term the reader could not define from general knowledge is introduced where the document first uses it, in a short parenthesis or by a link to the document defining it, and used unchanged after: once per document rather than once per set, because a reader arrives by search and lands in the middle of it. **Test it against what you knew before this run:** a term whose meaning you settled by reading this project's code, rather than by knowing the word, needs introducing. Judging by whether it feels obvious fails, because you have just read the implementation. Spell a concept one way across the documents you edit, since a concept spelled three ways is three concepts to anyone meeting it, and defeats their search.

## Configuration references

- Document a tunable value by the **name a consumer changes it by**, judging by role, not location. That surface includes external interfaces (env vars, config-file keys, CLI flags) and named members of a centralized or exported constants module that other code reads: if a named, stable value is read elsewhere and changing it changes behaviour, document it by that name even when it is internal. Format: "Set or change `<NAME>` in `<LOCATION>` to control `<behaviour>`." Name the consumer-facing value, for example `LIMITS.MAX_RETRIES`, not a transient local.

## File citations & references (strictly enforced)

- **Every technical claim cites its source file.** No citation, no claim.
- **Every file reference is a clickable markdown link**, `[filename](relative/path)`. No bare filenames.
    - ❌ "See server.ts for the implementation."
    - ✅ "See [`server.ts`](../src/server.ts) for the implementation."
- **Links target files, not directories.** If the text refers to a directory, link to a file inside it such as its `index.md` or `README.md`.
    - ❌ "[`/design`](../design)"
    - ✅ "[`/design`](../design/index.md)"
- **Link text names the destination.** Never "here", "link", "this", or a bare URL: write the sentence first, then wrap the phrase that names what it points at.
- Weave links into prose; use a footer `Implementation:` only when inline is unnatural. Do not link the same file twice in adjacent sentences.
- Verify every path resolves from the doc's own location, and every anchor against the current heading text it points at, since a renamed heading breaks a link that still looks correct. If a referenced file, or a heading an anchor names, does not exist, correct or remove the statement.

## Code snippets

- Do not inline full definitions or class bodies; link to the file. Exceptions, 3-10 lines maximum: a specific usage example or how-to, a single critical configuration line, or logic that text alone cannot convey.
- **An example a reader copies and adapts is a usage example and belongs inside that allowance.** Write it in the language and file format the reader will actually edit, and label the fence with that language: a block labelled as one format and written in another does not run, and the reader who pastes it learns that after the error rather than before.

## Formatting

- **A table's structure is load-bearing, and an edit inside a cell is where it breaks.** Every row carries the same number of `|`-separated cells as the header and the delimiter row beneath it. A cell holds one line: never a newline, a bullet list, or a fenced block. A literal `|` inside a cell is written `\|`, or the column count silently changes. Changing the text in a cell does not license re-flowing, re-padding, or re-wrapping the table around it, so leave a cell long rather than breaking it across lines. Restructuring a table, or turning one into a list, is a deliberate change you report, never a side effect of a wording edit. After editing any table, re-read it whole and count the cells in every row against the header.
- Always use relative links, including `../` paths, for GitHub compatibility. Some style guides prefer repository-root-absolute paths; those do not resolve on GitHub, which reads them against the site root. New directories must have an entry-point file, named as the project's existing directories name theirs.
- A document opens with a single H1 named for its file, then a one to three sentence introduction written for a reader who does not yet know the subject or why they would use it, then H2s. Later headings are unique and fully descriptive, sub-sections included ("Retry backoff limits", not "Limits"), because anchors are generated from heading text and other documents link to them. Use sentence case.
- Prefer standard markup to raw HTML. If the markup cannot express it, reconsider whether the document needs it.
- Add a related-documentation section at the file bottom only when genuinely relevant links exist, and not in a directory's entry-point file. Match the heading text the project already uses for it.
