---
paths:
    - "**/*.md"
    - "**/*.mdx"
---

# Documentation authoring

When creating or editing any markdown file, follow the discipline below. These are the always-apply rules distilled from [`.github/prompts/audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md) (the canonical spec). To audit or sync `docs/` against the code as a whole, run the `/audit-docs` skill.

## Accuracy

- **Zero hallucination.** Document only what the code provably does. Read the implementation; don't infer behaviour from a name, type, comment, file location, or familiar pattern.
- **Prove it.** Before writing any technical claim, know the exact file (and ideally lines) that prove it. If you can't, don't write it. Silence beats speculation: no "appears to", "should", "will", or planned/intended behaviour.
- Fix existing statements that contradict the code.

## Style

- **No em-dashes or en-dashes.** Never write `—` (em-dash) or `–` (en-dash); replace each with a comma, parenthesis, colon, separate sentence, or a spaced hyphen `-`. The hyphen `-` is fine wherever it is grammatically correct, including the ` - ` separator between a label and a brief description in lists. When you edit a markdown file, replace its existing em-dashes and en-dashes too.
- **Canadian English (strong preference)** for prose you write or change: colour, behaviour, favour, centre, defence, and `-ize`/`-ization` (standardize, organization). See the [Canadian spelling guide](https://our-languages.canada.ca/en/blogue-blog/canadian-spelling-eng). Don't retroactively convert existing prose, and never change code identifiers, config/JSON keys, quoted code, file/package names, or CSS properties (`background_color`, `themeColor`).
- **No subjective adjectives** in new prose (important, critical, robust, seamless, powerful, efficient, etc.). State facts. Objective is not robotic, though: replace the adjective with the concrete cited fact that earns it (show, don't tell).
- Use prose for reasoning (the *why* and *how the system uses it*), not line-by-line narration; reserve bullets and numbered lists for genuine enumerations (steps, options, fields). Don't force explanation into parallel bullet fragments, and don't de-list a real list. Lead each paragraph with its point.
- **Voice (new or changed prose only).** Read as a careful human wrote it: lead with the point, vary sentence length where natural, and cut AI tells (signposting previews, puffery copulas like "serves as" / "is a testament to", rule-of-three by default, filler transitions, formulaic conclusions). Stay formal and neutral (no contractions). Full list and scope: the **Voice** section of the [canonical prompt](../../.github/prompts/audit-docs.prompt.md).
- Document a tunable value by the **name a consumer changes it by** (env var, config key, CLI flag, or a named member of a centralized constants/config module that other code reads), judging by role, not location. Don't document an ephemeral local variable as the config surface.
- **Acronyms** in prose you write or edit use capitals (ID, URL) and are expanded on first use per doc ("Deoxyribonucleic acid (DNA)"). Keep exact casing for brand/tool/package names (npm, iOS), domain terms (snRNA), and direct code references (an `id` field).
- No placeholders, TODOs, or empty "add details here" sections.

## Links & code

- Every file reference is a **clickable markdown link to a file**, never a bare filename and never a link to a directory. Link to a file inside the directory (e.g. its `index.md`/`README.md`) instead.
- Use relative links (GitHub-compatible) and verify the path resolves from the doc's own location.
- Don't paste full definitions/class bodies; link to the file. Inline snippets only for a short usage example, a critical config line, or logic that text can't convey (3-10 lines max).

## Mermaid

- Every diagram **must** include both `accTitle` (specific) and `accDescr` (a real description, not "a diagram showing…"). No exceptions.
- Valid Mermaid only; reflect actual current code; pick the diagram type that fits (don't default to `flowchart`).
