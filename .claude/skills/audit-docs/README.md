# audit-docs

Audits a project's documentation against its code and corrects what has drifted, in both its Markdown pages and the comments in its code. It grounds every claim in a file opened during the run. It edits documentation only, never code behaviour.

## What it does

- Brings the documentation in line with the code, the active pull request, or uncommitted changes.
- Corrects statements the code contradicts, and writes documentation for a component that has none.
- Audits the comments and file headers in every code file it covers, including every code file a pull request touched. It documents a public symbol in scope that lacks a comment; on a pull request, only the symbols the change added or changed.
- Keeps its edits as short as the change needs, in plain English.
- Edits files where they are. It renames, moves, splits, or deletes a file only when asked, and otherwise asks first or proposes the change in its report.
- Holds every page to two readers: a newcomer meeting the system for the first time, and someone who already works in it.
- Lists each claim it could not verify under "Unverified" in its report, rather than writing it into the documentation.

## Usage

Invoke the skill by name, for example `/audit-docs`, optionally followed by the paths or area to audit. Without one, it works from the active pull request, then uncommitted changes, then the files the surrounding task created or changed, and only then the whole documentation set.

- `/audit-docs`
- `/audit-docs docs/api`
- "Check the setup guide against the code"

It ships subagents and reference material that it opens only when a run needs them.

## Licence

MIT. The full text is in `LICENSE.txt`.
