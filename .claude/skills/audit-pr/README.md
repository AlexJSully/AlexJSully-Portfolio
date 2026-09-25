# audit-pr

Reviews a pull request, or a working branch's diff, across eighteen categories from correctness and security to cost and accessibility, and produces findings a person can verify and paste into the pull request. It reports findings rather than editing files.

## What it does

- Checks that the change does what its title, description, and linked ticket say.
- Enters only the categories the diff triggers, chosen through a triage table.
- Quotes the changed line behind every finding, with any credential value redacted.
- Tries to refute each finding before publishing it, and drops the ones that do not survive.
- Gives every finding a severity, says what the change does well, and ends with a verdict.

## Usage

Invoke the skill by name, for example `/audit-pr`, optionally followed by a pull request number or a branch. Without one, it reviews the active pull request, then uncommitted changes, then the branch's own commits. With no change to review, it says so and stops rather than auditing the whole codebase.

- `/audit-pr`
- `/audit-pr 42`
- "Review the changes on this branch before I merge"

It ships a refutation subagent, reference material, and a summary template that it opens only when a run needs them.

## Licence

MIT. The full text is in `LICENSE.txt`.
