# audit-quality

Audits code as it stands, rather than a change to it, across thirteen categories including architecture, security, privacy, testing, dependencies and supply chain, and operating cost. Every finding rests on a file opened during the run and names the symbol it concerns.

## What it does

- Resolves its scope first, states which rule decided it, and audits only what that scope selects.
- Gives every finding a severity: blocking, should fix, suggestion, or positive.
- Tries to refute each finding before reporting it, and drops the ones that do not survive.
- Applies changes only when invoked in a mode that allows edits, in small batches, running the project's full validation after each one.

## Usage

Invoke the skill by name, for example `/audit-quality`, optionally followed by paths, categories, or `all`. Without one, it audits the active pull request, then uncommitted changes, then the component the surrounding task concerns, and the whole repository only when nothing narrower applies.

- `/audit-quality`
- `/audit-quality src/payments`
- `/audit-quality security`

## Licence

MIT. The full text is in `LICENSE.txt`.
