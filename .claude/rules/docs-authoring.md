---
paths:
    - '**/*.md'
    - '**/*.mdx'
---

# Documentation authoring

When creating or editing any markdown file, follow the discipline below. These are the always-apply rules distilled from the `audit-docs` audit, which ships as [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md) and as the fuller [`audit-docs/SKILL.md`](../skills/audit-docs/SKILL.md), whose bundled references carry the operational detail. To audit `docs/` against the code as a whole, run the `/audit-docs` skill.

## Accuracy

- **Zero hallucination.** Document only what the code provably does. Read the implementation; don't infer behaviour from a name, type, comment, file location, or familiar pattern.
- **Prove it.** Before writing any technical claim, know the exact file (and ideally lines) that prove it. If you can't, don't write it. Silence beats speculation: no "appears to", "should", "will", or planned/intended behaviour.
- Fix existing statements that contradict the code.
- **Compress, don't just delete, an overlong comment.** Removing bloat means deleting a comment that restates the code; where a comment explains a genuinely non-obvious internal but runs far longer than that content needs, compress it to the non-obvious fact instead of leaving it, since being accurate is not, on its own, a reason a comment stays at whatever length it was written.
- **Current state only.** Describe the code as it is now, in prose and in comments alike. Never narrate the past ("replaces", "used to", "formerly", "for the first time", "unlike the old") and never name a file, flag, or tool that no longer exists: git carries that history, and a reader cannot check a claim against something that is gone. Future intent lives in a `TODO` in the code, never in the documentation. **Name the line a comment describes**, and delete the comment where no line corresponds: that is the test the phrase list misses, and a comment explaining why something was removed is what it catches, since its subject is a decision and its reader is looking at the pull request. Rationale worth keeping goes in a decision record of its own under [`docs/`](../../docs/index.md), created when the first one is needed, rather than scattered through the files it explains.

## Style

- **No em-dashes or en-dashes.** Never write `—` (em-dash) or `–` (en-dash); replace each with a comma, parenthesis, colon, separate sentence, or a spaced hyphen `-`. The hyphen `-` is fine wherever it is grammatically correct, including the `-` separator between a label and a brief description in lists. When you edit a markdown file, replace its existing em-dashes and en-dashes too.
- **Canadian English (strong preference)** for prose you write or change: colour, behaviour, favour, centre, defence, and `-ize`/`-ization` (standardize, organization). See the [Canadian spelling guide](https://our-languages.canada.ca/en/blogue-blog/canadian-spelling-eng). Don't retroactively convert existing prose, and never change code identifiers, config/JSON keys, quoted code, file/package names, or CSS properties (`background_color`, `themeColor`).
- **No subjective adjectives** in new prose (important, critical, robust, seamless, powerful, efficient, etc.). State facts. Objective is not robotic, though: replace the adjective with the concrete cited fact that earns it (show, don't tell).
- Use prose for reasoning (the _why_ and _how the system uses it_), not line-by-line narration; reserve bullets and numbered lists for genuine enumerations (steps, options, fields). Don't force explanation into parallel bullet fragments, and don't de-list a real list. Lead each paragraph with its point.
- **Voice (new or changed prose only).** Read as a careful human wrote it: lead with the point, vary sentence length where natural, and cut AI tells (signposting previews, puffery copulas like "serves as" / "is a testament to", rule-of-three by default, filler transitions, formulaic conclusions). Stay formal and neutral (no contractions). Full list and scope: the **Voice** section of [`audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md), with worked before-and-after pairs in [`voice-and-ai-tells.md`](../skills/audit-docs/references/voice-and-ai-tells.md).
- Document a tunable value by the **name a consumer changes it by** (env var, config key, CLI flag, or a named member of a centralized constants/config module that other code reads), judging by role, not location. Don't document an ephemeral local variable as the config surface.
- **Acronyms** in prose you write or edit use capitals (ID, URL) and are expanded on first use per doc ("Deoxyribonucleic acid (DNA)"). Keep exact casing for brand/tool/package names (npm, iOS), domain terms (snRNA), and direct code references (an `id` field).
- No placeholders, TODOs, or empty "add details here" sections.
- **Two readers, one document.** Every page is read by a newcomer meeting the system for the first time and by someone who already works in it, and serving only the second is the ordinary failure. Serve both by order rather than by splitting the page: what the subject is and why a reader would reach for it, what that reader must already have or have read, then the depth in full. A page only its author can follow is not finished, and neither is one whose reader could have got it faster from the source.
- **Brevity is measured too, not only whether each paragraph earns its place.** Judge the whole document: would a careful human asked to write the same brief have produced something shorter? Where a page mixes a brief overview with deep reference, how-to, or explanation content, split it into a short overview (a README or index) and a dedicated depth page, filed by the same directory-type-precedent logic a new file already uses. This is a judgement call, not a word or line count, worked through in [`writing-for-both-readers.md`](../skills/audit-docs/references/writing-for-both-readers.md#document-length-as-a-whole).
- **Complement a passage that stays long, rather than only cutting it.** Where a passage survives the trim above because the subject needs it, consider whether a Mermaid diagram (never defaulting to `flowchart`, chosen per [`diagram-and-image-accessibility.md`](../skills/audit-docs/references/diagram-and-image-accessibility.md#choosing-the-mermaid-diagram-type)), a table, a code/config snippet, or an image would let a reader absorb it faster than prose alone. Weigh this more heavily as the passage grows longer, though a short passage can use it too where one of these forms fits the content better than prose.
- **Introduce every term of art where the document first uses it**, in a short parenthesis or by a link to the document that defines it, then use it unchanged. Expanding an acronym is not introducing it, since the expansion is often as opaque as the abbreviation. Spell a concept one way across [`docs/`](../../docs/index.md): a concept spelled three ways is three concepts to anyone meeting it, and it defeats their search.
- A document opens with a single H1 named for its file, then a one to three sentence introduction for a reader who does not yet know the subject, then H2s. Headings are unique and fully descriptive ("Retry backoff limits", not "Limits"), because anchors are generated from them, and use sentence case.
- **Tables only for uniform data scanned quickly.** If columns repeat across rows, cells sit empty, or a cell holds a sentence of prose, use a list instead.
- Prefer Markdown to raw HTML for layout or styling.
- Link text names the destination: never "here", "link", "this", or a bare URL.

## Links & code

- Every file reference is a **clickable markdown link to a file**, never a bare filename and never a link to a directory. Link to a file inside the directory (e.g. its `index.md`/`README.md`) instead. A generic reference, where no particular file is meant, is a code span rather than a link: "update your `README.md`".
- Use relative links (GitHub-compatible) and verify the path resolves from the doc's own location.
- Don't paste full definitions/class bodies; link to the file. Inline snippets only for a short usage example, a critical config line, or logic that text can't convey (3-10 lines max).

## Mermaid

- Every diagram **must** include both `accTitle` (specific) and `accDescr` (a real description, not "a diagram showing…"). No exceptions. Images are held to the same bar: real alt text, never "screenshot" or "diagram".
- Valid Mermaid only; reflect actual current code; pick the diagram type that fits (don't default to `flowchart`).
