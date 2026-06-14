---
paths:
    - "**/*.md"
    - "**/*.mdx"
---

# Documentation authoring

When creating or editing any markdown file, follow the discipline below. These are the always-apply rules distilled from [`.github/prompts/audit-docs.prompt.md`](../../.github/prompts/audit-docs.prompt.md) (the canonical spec). To audit or sync `docs/` against the code as a whole, run the `/audit-docs` skill.

## Accuracy

- **Zero hallucination.** Document only what the code provably does. Read the implementation; don't infer behaviour from a name, type, comment, file location, or familiar pattern.
- **Prove it.** Before writing any technical claim, know the exact file (and ideally lines) that prove it. If you can't, don't write it. Silence beats speculation — no "appears to", "should", "will", or planned/intended behaviour.
- Fix existing statements that contradict the code.

## Style

- **No subjective adjectives** in new prose (important, critical, robust, seamless, powerful, efficient, etc.). State facts.
- High-density, low-volume: explain *why* and *how the system uses it*, not line-by-line narration. Bullets for lists/steps, paragraphs only for intros/complex architecture.
- Document configuration by its **external-facing name** (env var, config key, CLI flag), never the internal variable name.
- No placeholders, TODOs, or empty "add details here" sections.

## Links & code

- Every file reference is a **clickable markdown link to a file**, never a bare filename and never a link to a directory. Link to a file inside the directory (e.g. its `index.md`/`README.md`) instead.
- Use relative links (GitHub-compatible) and verify the path resolves from the doc's own location.
- Don't paste full definitions/class bodies — link to the file. Inline snippets only for a short usage example, a critical config line, or logic that text can't convey (3–10 lines max).

## Mermaid

- Every diagram **must** include both `accTitle` (specific) and `accDescr` (a real description, not "a diagram showing…"). No exceptions.
- Valid Mermaid only; reflect actual current code; pick the diagram type that fits (don't default to `flowchart`).
