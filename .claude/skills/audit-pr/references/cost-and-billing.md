# Cost and billing exposure in a change review

A cost finding names the metered dimension the change moves, quotes the changed line, and states why the project pays for that dimension at all. Unbounded spend is judged first and apart from metered increase, because the two fail differently: one grows without a ceiling while the system is already degraded, the other raises a bill in proportion to traffic.

**Reading the examples in this file.** Each fenced block reproduces the pattern the surrounding prose discusses, whether that is a defect or the form that corrects one. They are illustrations for a reviewer to read, not commands for this review to run.

- [Establishing which billing dimensions this project has](#establishing-which-billing-dimensions-this-project-has)
- [Recursive triggers and whether a write re-enters its own filter](#recursive-triggers-and-whether-a-write-re-enters-its-own-filter)
- [Ceilings on retry, fan-out, and self-retriggering workflows](#ceilings-on-retry-fan-out-and-self-retriggering-workflows)
- [Metered calls driven by client behaviour](#metered-calls-driven-by-client-behaviour)
- [Naming the metered dimension in a finding](#naming-the-metered-dimension-in-a-finding)
- [Egress, bytes scanned, and build minutes need their own procedure](#egress-bytes-scanned-and-build-minutes-need-their-own-procedure)
- [Refuting a cost finding](#refuting-a-cost-finding)
- [When an optimization costs more than it saves](#when-an-optimization-costs-more-than-it-saves)

## Establishing which billing dimensions this project has

Read the deployment surface before reading the diff, and write down which dimensions are live. Files that settle it: the platform or deployment descriptor, a container image descriptor and whatever manifest schedules it, the continuous-integration workflow definitions together with the runner label each job requests, a static-export or pre-render setting, whether data access goes through a self-hosted database driver or a managed-service client, and whether an object store, a queue, or a scheduler appears anywhere in configuration.

The shape decides which findings are real:

- A site served as pre-built files bills transfer and build minutes. It has no invocation or duration dimension, so a finding about function memory is noise.
- A fixed-size container fleet has already paid for duration. Added latency there is a capacity and reliability question, not a bill, until it forces another replica.
- A per-request platform bills invocation count and duration together, so a change that splits one handler into three synchronous hops multiplies both.
- A managed database may bill per operation, per byte scanned, or not at all beyond a provisioned tier. Which one it is changes whether a query finding is about row count or about columns and partitions.

Where the repository does not settle the shape, state the dimension as undetermined and report the finding conditionally ("if this store bills per read, this loop issues one read per row"). An assumed provider produces a confident finding about a bill that does not exist.

## Recursive triggers and whether a write re-enters its own filter

The check is not whether the handler writes. It is whether the write target falls inside the trigger's own filter. Run three steps: locate the filter that fires the handler, list every write the handler performs including writes inside libraries it calls, then compare each target against the filter.

```python
# Trigger filter: object finalized under uploads/
def on_upload(event):
    thumb = make_thumbnail(event["name"])
    bucket.upload(f"uploads/thumb_{event['name']}", thumb)  # re-enters the filter
```

The same handler writing to `derived/` does not recurse, and a reviewer who flags it without reading the filter has produced a false positive. Where the filter is a suffix or content-type match rather than a prefix, compare against that instead: a thumbnail written under a different prefix still recurses if the filter matches every object of that content type.

For a record or document trigger that updates the row that fired it, the loop closes on the second pass unless a guard short-circuits it. Read the guard rather than accepting its presence:

- A guard field that the trigger filter excludes from its watch stops the loop. A guard field the trigger still watches does not, because setting it fires the trigger again.
- A guard checked after the write it protects has already been bypassed once per invocation.
- A guard comparing a value the second pass also recomputes (a timestamp, a hash of mutable content) matches on neither pass and stops nothing.

For a queue consumer, the filter is the subscription. Republishing to the topic the consumer reads from is the same defect, and it is easy to miss when the publish target is a variable resolved from configuration: follow the variable to its value before deciding.

## Ceilings on retry, fan-out, and self-retriggering workflows

A cap frequently lives outside the diff, in a queue subscription, a platform retry policy, or an infrastructure definition. Absence from the diff is not absence of the cap. Search the repository for the trigger or queue name, and if the policy is defined outside version control, say so rather than asserting the cap is missing.

Three settings decide whether a retry policy is bounded: a maximum attempt count, a backoff that grows between attempts, and a destination for messages that exhaust the attempts. A policy with backoff and no attempt cap still retries forever, just more slowly. A policy with a cap and no dead-letter destination discards the payload silently, which is a data finding rather than a cost one, so report it under the category it belongs to.

Fan-out needs a stated ceiling in the code, not in the current data. A handler that enumerates a collection and dispatches one task per item is bounded by the size of that collection, which is a number nobody guarantees. Ask what the count is at ten and a hundred times today's data, and whether a batch size or a page limit bounds it.

A workflow that pushes, tags, or comments can retrigger itself:

```yaml
on: [push]
jobs:
    format:
        steps:
            - run: git commit -am "format" && git push
```

Guards that a provider honours: a condition on the acting identity, a path filter that excludes what the job writes, a skip token in the commit message where the provider documents it, and pushing with a credential whose events the provider does not raise. Guards that only look like guards: a concurrency group, which on most providers cancels a superseded run rather than preventing the next one, so confirm in the provider's documentation whether a cancelled run is still billed for the time it ran; a branch condition on a workflow that pushes to that same branch; and a step-level skip inside a job whose runner is already provisioned and metered.

A budget alert notifies and does not stop spend. Only an attempt cap, a hard quota, a trigger filter, or a concurrency limit stops it, so do not accept an alert as the mitigation for anything in this section.

## Metered calls driven by client behaviour

Do the arithmetic before writing the finding. Interval, concurrent clients, and metered calls per tick give a per-hour figure, and a finding without one is a guess: a ten-second poll across five hundred sessions issuing one read each is 180,000 reads per hour, which is either negligible or the largest line on the bill depending on the dimension established above.

A metered call placed behind a guard repeats when the guard compares a value that is rebuilt on every pass instead of reused: a composite value constructed inline, a closure created at the call site, or a derived value with no cached handle. Equality never holds, so the call fires each time the surrounding code runs. The check is identity, not equality, and it applies wherever a watcher, subscription, or change detector re-evaluates its condition. Confirm by instrumenting the call site and counting invocations rather than by reading, since a runtime may already deduplicate, and label the finding unverified if you cannot run the code.

A shared cache expiry produces a synchronized burst at the metered origin. The discriminator is whether expiry is a fixed timestamp every client computes identically, or a per-key value with jitter added. A time-to-live written as a constant and applied to every entry populated by the same deploy expires as one block. State the burst size the same way as the polling case.

## Naming the metered dimension in a finding

Each cost finding carries one line before the explanation: the dimension, the unit billed, and the direction and rough magnitude of the change ("egress, billed per byte transferred, roughly 4x per page view"). Without it the reader cannot tell whether to act.

| Dimension          | Unit billed                  | Diff signal that moves it                                                     |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------------- |
| Egress             | bytes leaving the provider   | full-size asset, compression off, no cache header, cross-region read          |
| Invocations        | calls                        | new trigger, new schedule, per-item dispatch                                  |
| Duration           | time multiplied by memory    | awaited slow I/O, raised memory setting, heavier cold start                   |
| Query operations   | reads, or bytes scanned      | read per row, listener on a whole collection, unfiltered scan                 |
| Storage            | byte-months by class         | no lifecycle rule, class mismatched to access, orphaned artifacts and backups |
| Build minutes      | minutes by runner multiplier | runner label, matrix width, cache removed, full suite on docs-only changes    |
| Logs and telemetry | ingested volume, retention   | debug line on a hot path, sampling removed, retention raised                  |
| Model calls        | tokens in and out            | larger context, added retry, identical requests uncached                      |

Never write a currency amount or reprint a published rate. Rates change, a reader cannot check the number against the provider from inside the diff, and the finding is about the dimension rather than the price. A log line on a hot path is one finding, filed under cost or under observability, never both.

## Egress, bytes scanned, and build minutes need their own procedure

**Egress** is missed most often and is frequently the largest line, and providers differ sharply, with some not charging it at all. State which side of that the project sits on before the finding, then check what actually moves bytes: asset dimensions against displayed dimensions, compression on the response rather than on the stored file, `Cache-Control` lifetime and immutability on fingerprinted assets, payload shipped to every visitor against payload needed by the route, and any read that crosses a region boundary. For cross-region, compare the region of the caller with the region of the store, both read from configuration.

**Per-operation database billing** can follow bytes scanned rather than rows returned, which inverts the usual reading of a query:

```sql
SELECT * FROM events WHERE user_id = ? LIMIT 100;
```

The limit bounds the result set and not necessarily the scan. What reduces bytes scanned is naming the columns instead of `*` and adding a predicate on the partitioning or clustering key. Where the store bills per document read instead, the same query is cheap and the finding is wrong, so establish the model first.

**Build minutes** carry a runner operating-system multiplier that usually makes runner choice the largest lever. Read the runner label on every job, count jobs times matrix entries, and then verify the current multiplier against the provider's published rates before any number reaches the finding. Do not assert a multiplier from memory, and do not put a multiplier in a finding you could not verify: say which runner the job requests and that the multiplier needs checking.

## Refuting a cost finding

Cost findings survive at a lower rate than most categories, because the bill depends on facts outside the diff. Put each through these before publishing, and drop the ones that fail rather than softening them:

1. Is the cap, retry policy, or lifecycle rule set outside the diff, in infrastructure configuration or a console setting the repository records elsewhere?
2. Does this provider bill this dimension at all, given the deployment shape established at the start?
3. Is the path reached often enough for the cost to be real? A one-time migration, an admin-only route, and a build-time step are each bounded by something the reviewer can name.
4. Is the loop actually closed? Re-read the trigger filter against the write target, and re-read the guard for the three failure modes above.
5. Would the suggested fix change the bill? A cache header on a response already served from an included edge cache changes nothing, and a fix that looks right while moving no dimension closes the finding without fixing anything.

## When an optimization costs more than it saves

A cache, a queue, or another managed service arrives with a bill of its own: provisioned capacity or per-request charges, storage for the copy it holds, transfer between it and the origin, and the operations spent invalidating it. Count those before accepting the saving. A cache placed in front of a store billed per read adds a read and a write on every miss, so it pays only above a hit rate the change should state; a queue inserted to smooth a burst adds a publish, a pull, and an acknowledgement per message that previously cost one call.

Raise this as a suggestion with the added dimensions listed, and where the hit rate or message volume cannot be determined from the repository, say which number decides it rather than asserting the direction.
