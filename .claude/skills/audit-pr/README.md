# audit-pr

Reviews a pull request, or a working branch's diff, across triaged categories from correctness and security to testing, accessibility, cost, and the contracts of the external systems it calls, and returns one report a person can verify. It reports findings rather than editing files.

## What it does

- Checks that the change does what its title, description, and linked ticket say.
- Enters only the categories the diff triggers, chosen through a triage table.
- Cites the file path and line number of the changed line behind every finding, and quotes it, with any credential value redacted.
- Tries to refute each finding before publishing it, and drops the ones that do not survive.
- Shows the corrected code for every finding it can fix, ready for the author to apply.
- Gives every finding a severity, says what the change does well, and ends with a verdict.

## Usage

Invoke the skill by name, for example `/audit-pr`, optionally followed by a pull request number or a branch. Without one, it reviews the active pull request, then uncommitted changes, then the branch's own commits. With no change to review, it says so and stops rather than auditing the whole codebase.

- `/audit-pr`
- `/audit-pr 42`
- "Review the changes on this branch before I merge"

It ships a refutation subagent, reference material, and a summary template that it opens only when a run needs them.

## Licence

MIT. The full text is in `LICENSE.txt`.
