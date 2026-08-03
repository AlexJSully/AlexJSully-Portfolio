# Mocking policy

The full argument behind the mocking rules in the skill body, plus the escalation ladder, the test that separates logic from a boundary, and worked examples.

## Contents

- What a mock costs
- The escalation ladder
- The logic-against-boundary test
- Boundaries that qualify
- Boundaries that do not qualify
- The one-line justification rule
- Never mock to make a failing test pass
- Worked examples
- Retrieving mock state

## What a mock costs

A mock is a claim about how a dependency behaves, written by the person whose code is under test. It has three properties that make it expensive:

1. **It is written from belief, not observation.** The author writes what they think the dependency does. Where belief and reality differ, the test passes and production fails.
2. **It does not decay when the dependency changes.** The real module can change its return shape, throw a new error, or become asynchronous, and every mock of it keeps returning the old shape. The test stays green through the exact change it existed to catch.
3. **It subtracts from what the test proves.** Each mock removes one real collaborator from the assertion. A test whose collaborators are all mocked asserts only that mocks were called in the expected order, which is a restatement of the implementation rather than a check on it.

This applies to every substitution technique, not only a module mocker: stubs, fakes, spies that replace behaviour, hand-written doubles, dependency-injection containers wired to fakes, and monkey-patching a module's export.

A spy that only records calls while the real implementation still runs is not a substitution and does not carry this cost.

## The escalation ladder

Work down it. Stop at the first rung that works. Reaching rung five without having genuinely tried the four above it is the common failure.

1. **Use the real implementation with real inputs.** Most helpers, utilities, pure functions, hooks, and components run fine in a browser-like test environment. Try it before assuming it cannot.
2. **Pass the value in rather than replacing the module.** A function that receives its dependency as an argument needs no mock, only a different argument. Where the code does not allow that, changing the code to allow it is usually the better fix, and it improves the production design at the same time.
3. **Build a real object or fixture and assert on real output.** A hand-built input plus the real code path proves more than a mocked call count.
4. **Move the assertion to a level where the seam is real.** A behaviour that cannot be tested honestly at the unit level often can be at the integration or end-to-end level, where the real dependency is present.
5. **Only then, mock the outermost boundary the test needs.**

## The logic-against-boundary test

Ask one question about the module you are about to mock: **if this module's body changed, should some test fail?**

- **Yes** means it holds logic. Do not mock it. Helpers, utilities, domain logic, components, hooks, constants, and static data modules all answer yes, whoever wrote them.
- **No, its whole job is to hand work to something outside the process** means it is a boundary, and mocking it may be justified.

**Never mock the subject under test, in whole or in part.** A partial mock of the module you are testing means the test no longer tests it: the parts you replaced are the parts you stopped checking, and the test will keep passing when they break.

## Boundaries that qualify

Each is here because the real thing cannot run in a test environment, not because mocking it is convenient.

| Boundary | Why it qualifies |
| --- | --- |
| A third-party SDK that reaches the network | The call leaves the process. Running it makes the test slow, non-deterministic, and dependent on someone else's uptime. |
| The project's own thin wrapper around such an SDK, when testing a consumer of it | Its whole job is to reach the outside world, so it carries no logic of its own to lose. |
| Framework context the test renderer cannot supply | Routing, navigation, and request context that only exist inside the framework's own runtime. |
| The clock | Fake timers replace the environment rather than your code, which is why they are not the same kind of substitution. |
| Platform APIs the test environment omits | Browser or runtime APIs the test environment does not implement. |
| A module with an unavoidable side effect at import time | Analytics initialization, telemetry registration, or a network call that fires on load. |

**The wrapper exception is narrow.** A wrapper qualifies only because it does nothing but reach outside. The moment it validates, transforms, retries, caches, or branches, it holds logic and rung one applies again.

## Boundaries that do not qualify

- A module that is merely slow. Fix the slowness or accept it.
- A module that is awkward to set up. That awkwardness is a design signal, and rung two usually addresses it.
- A module whose real output is hard to assert on. That means the assertion needs rethinking, not that the module needs replacing.
- A module you did not write. Authorship is irrelevant; the logic-against-boundary test is the only criterion.
- The file system, in most cases. A temporary directory is usually cheaper and more honest than a mock.

## The one-line justification rule

**Anything outside the qualifying table needs a one-line comment above the mock naming the boundary it crosses.** Not what the mock returns, and not that it is needed: which boundary, and why the real thing cannot run here.

If you cannot write that sentence, the mock is not justified. Use the real thing.

This rule exists because it is cheap to check. In review, a mock without that comment is a finding, and a mock whose comment does not name a boundary is the same finding.

## Never mock to make a failing test pass

A mock introduced while chasing a red test is hiding the failure rather than fixing it. The sequence to watch for is: the test fails, a collaborator looks like the cause, the collaborator gets mocked, the test goes green, and the original defect ships.

When a test is red, the fix is upstream: read the test, read the source, name the cause. If a mock still seems necessary afterwards, restart the ladder at rung one, because the reasoning that led to it was reached under pressure.

## Worked examples

**Rung two instead of a mock.** A function that reads configuration through an imported singleton needs the singleton mocked. The same function taking the configuration as a parameter needs a different argument. Changing the signature costs one line at each call site and removes the mock permanently.

**A real fixture instead of a mocked return.** Testing a formatter by mocking the parser it calls asserts that the formatter passed the parser's fake output through. Testing it with a real parsed fixture asserts that the formatter formats. Only one of those breaks when the formatter breaks.

**Leaving a framework component unmocked.** A framework image or link component that rewrites its attributes at render time is often mocked so a test can assert an exact value. Leaving it real and asserting on a substring of the rendered attribute keeps the real component in the test, so the assertion still holds when the rewriting changes.

**Where a mock is right.** A module whose entire body is a call to a network SDK, imported by the component under test, mocked so rendering the component does not fire a live request. The mock replaces nothing that computes, and the comment naming the boundary writes itself.

## Retrieving mock state

Reach for the test runner's own typed accessor rather than a bare dynamic import inside the test body: it keeps the type of the mocked symbol and it does not run at a different time than the rest of the module graph. Cast the imported symbol to the runner's mocked-function type where the runner provides one.

Clear mock state between cases in a shared setup hook. A mock whose call history leaks across cases makes the order of the file load-bearing, which is one of the flakiness sources listed in the test standards.
