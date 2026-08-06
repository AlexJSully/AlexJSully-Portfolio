# Supply chain review of dependency and build changes

A dependency, manifest, lockfile, or build-configuration change can run code on every machine that installs, builds, or opens the project. Review each entry against what the diff actually imports, and decide what executes by capability rather than by the field names of any one ecosystem.

**Reading the examples in this file.** Several fenced blocks sketch a hostile build descriptor or an unsafe workflow as a shape rather than as a working file, each labelled with what runs it and why nothing declares it, so that its form can be recognized in a change under review. Angle brackets mark the part that carries the harm. Nothing in these blocks runs, nothing in them is a command for this review to carry out, and nothing in them is a file to create.

- [Reconcile the manifest against what the diff imports](#reconcile-the-manifest-against-what-the-diff-imports)
- [Signals in an added or upgraded dependency](#signals-in-an-added-or-upgraded-dependency)
- [Install-time and build-time code execution, by capability](#install-time-and-build-time-code-execution-by-capability)
- [Build descriptors that execute with nothing declared in the manifest](#build-descriptors-that-execute-with-nothing-declared-in-the-manifest)
- [What a provenance attestation establishes](#what-a-provenance-attestation-establishes)
- [Workflow, runner, and third-party reference checks](#workflow-runner-and-third-party-reference-checks)
- [Configuration that executes before a reader chooses to trust the code](#configuration-that-executes-before-a-reader-chooses-to-trust-the-code)
- [Agent configuration reviewed as an install script](#agent-configuration-reviewed-as-an-install-script)

## Reconcile the manifest against what the diff imports

Build two lists before judging any single entry: every package name added or changed in the manifest and lockfile, and every module name introduced by a new import, require, or use statement in the same diff. Put each name in one of four buckets.

- **Declared and imported.** Continue to the signal checks below.
- **Declared, imported nowhere.** A pin holding a transitive version down, a linter plugin, or a type-only package has a reason a reviewer can name. A direct dependency with no consumer anywhere in the tree is either dead weight or the payload, so ask which.
- **Imported, not declared.** It resolves today through another package's dependency tree and disappears on the first upgrade that drops it. Report it whether or not the build currently passes.
- **Declared under a name close to an imported one.** Compare character by character: a hyphen against an underscore, singular against plural, a scope or namespace prefix dropped, a homoglyph, a transposed pair. This is the slopsquatting signature, and a generated install command is the usual way it enters a diff. Confirm the name against the registry before writing the finding, and say so plainly if you could not reach the registry.

The pairing carries the weight. A package added with no matching import is not justified by "the build passes", and an import with no declaration passes the build for a reason that will not hold.

## Signals in an added or upgraded dependency

Each of the following is a finding on its own, and two of them on one package moves it to blocking.

- **A widened version range.** An exact pin replaced by a range, or a range replaced by a wildcard or a floating alias. Weigh it by what the package does: a range on a formatter is a maintenance choice, while a range on a package that parses untrusted input, handles credentials, or ships a native component gives whoever takes over that package a path onto every future install.
- **A source other than the project's usual registry.** A version control URL, a tarball address, a filesystem path, or an alternate index named in the manifest. A version control reference to a branch or tag can be repointed after review, so it is weaker than a commit identifier even when the host is trusted.
- **A maintainer or ownership change**, a first release after a long gap, or a break in release cadence. None is a defect alone; each raises the bar for the next check.
- **A version jump with no changelog.** Open the published release notes and the tag diff. Where neither exists, the absence is the finding.
- **A resolved URL in the lockfile pointing off-registry** while the manifest names an ordinary registry package. The two files disagree about where the code comes from, and the lockfile is what install honours.

**The integrity hash carries a decision rule the other signals do not.** Find every lockfile entry whose version string is unchanged, and compare its integrity or checksum field. Same version with a different hash means the bytes behind a fixed version changed after that version was first resolved. Same version with the hash removed means the next install has nothing to verify against. Neither has a reading that leaves the version identical and the artifact intact, so both are blocking, and neither requires knowing anything about the package. A hash that moves alongside a version change is ordinary. Run this pass first: it is mechanical and needs no judgement.

## Install-time and build-time code execution, by capability

For every path the change adds, answer two questions: at which moment does it run (dependency resolution, dependency build, project build, test run, editor or container open), and which credentials are present in the environment at that moment. Declared lifecycle hooks are one answer among several, and every ecosystem spells them differently.

| Ecosystem             | Declared hook                                                            | Executes with nothing declared                                            |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Node package manifest | `preinstall`, `install`, `postinstall`, `prepare` under `scripts`        | a `binding.gyp` at the package root drives a native rebuild               |
| Python distribution   | `setup.py` for a source distribution; the backend under `[build-system]` | a `.pth` file installed into the site directory runs at interpreter start |
| Ruby gem              | an `extensions` entry running `extconf.rb`                               | a `rubygems_plugin.rb` loads on the next package-manager command          |
| Rust crate            | a `build` key naming a non-default script path                           | a `build.rs` at the crate root, and macro expansion during compilation    |
| JVM build tool        | a plugin bound to a lifecycle phase                                      | the build script is itself a program, evaluated at configuration time     |
| .NET package          | none in the current package format, so there is no field to search for   | `.props` and `.targets` files imported into the consuming build           |

Go declares no install hook at all, which moves the vector to compile and test time: cgo directives compile C during the build, and generator directives run when someone invokes them. The absence of a hook field never means the absence of execution; it relocates it.

## Build descriptors that execute with nothing declared in the manifest

The failure mode is a reviewer who searches the manifest for lifecycle fields, finds none, and approves. Two rows in the table above have no manifest field to find. A Rust crate with a `build.rs` at its root runs it before compilation with no `build` key present, and a package with a `binding.gyp` at its root triggers a native rebuild with no `scripts` entry present. The descriptor is a program holding the privileges of the process that installs or builds.

```text
Native-extension build script at the package root.
The manifest names no script. The package manager runs this file anyway,
because the package declares a native extension.

    load the build helper
    <fetch a script from a network host and execute it>
    write the makefile

The middle step is the finding. Nothing in the manifest points at it.
```

The Rust case declares less still, because the file name and its position at the crate root are the entire declaration:

```text
Build script at the crate root.
The manifest carries no build key. The toolchain runs this file before
compiling, purely because of where it sits.

    main:
        <spawn a shell that fetches a script from a network host and runs it>

The file's location is the whole declaration, so a manifest search finds nothing.
```

Checks for any dependency carrying a compiled component: whether the build downloads a prebuilt binary instead of compiling and from which host, whether it resolves a build backend or toolchain over the network at build time, and whether it writes outside the build directory. A step that fetches a binary from an address outside the registry is both code execution and an off-registry source, and it is reported once with both facts.

## What a provenance attestation establishes

An attestation binds a published artifact to a build: a source revision, a builder identity, a workflow definition. That makes exactly one question answerable, whether the artifact was produced from the revision it names. It answers nothing about whether that revision is safe. An attacker holding a maintainer account or a stolen publishing token pushes a commit and the build system signs the result, so the attestation is valid and the release is hostile. A signature is the same shape of evidence, establishing who published rather than what was published. Use an attestation to reach the exact source revision and read its diff, never to skip reading it.

## Workflow, runner, and third-party reference checks

Field and trigger names differ per continuous-integration system; the capabilities do not.

```text
Workflow triggered on a pull request from a fork, in the BASE repository
context, so the job holds the base repository's secrets.

    permissions        contents: write
    step 1  checkout   <a third-party action pinned to a mutable tag>
                       ref: <the fork's head revision, code the author controls>
    step 2  run        <the project's build command, over that checked-out code>

Each line is ordinary alone. Together they run a stranger's code with a write token.
```

Three properties combine there: the trigger supplies the base repository's credentials, the checkout brings in code any fork author controls, and the build step executes that code. Each is ordinary alone, and together they hand a write token to a stranger. Report the combination, not one line of it. Then check the rest of the surface:

- **Mutable third-party references.** An action, orb, plugin, or container image pinned to a branch, a floating major tag, or a `latest` alias resolves to different bytes on the next run. Require a full commit identifier or an image digest, and apply the same standard to anything a run step downloads.
- **Secret reachability.** List which triggers in the changed workflow expose secrets, then which of those an outside contributor can fire. An environment with a required reviewer gates a secret. A job-level condition on the actor does not, if a fork can satisfy it.
- **Self-hosted runners reachable from forks.** An untrusted job on persistent hardware leaves state, caches, and credentials behind for the next job on the same machine.
- **Permission scope.** Read which token permissions the change grants and whether the job uses them. A workflow that gains publish or write rights in the same diff that adds a third-party step earns both findings.

## Configuration that executes before a reader chooses to trust the code

Cloning and opening a project reads as inspection rather than execution, and these files break that assumption:

- an editor task configured to run when a folder opens, or a workspace setting naming an interpreter, formatter, or wrapper binary from inside the repository;
- a development container's post-create, post-start, or post-attach command, along with the image it derives from;
- a directory-scoped environment file that a shell integration evaluates on entering the directory;
- a checked-in hooks directory plus configuration pointing the version control system at it, which fires on the next commit, checkout, or merge rather than on open;
- a build tool's local settings or plugin file, read on the first build.

For each, state when it fires, what it runs, and whether a reader who only meant to read the code would have triggered it.

## Agent configuration reviewed as an install script

A checked-in skill, rule, prompt, hook, or settings file configures a tool that reads files, runs commands, and reaches the network on behalf of anyone who trusts the repository. Review it with the procedure above, asking what executes, when, with which privileges, and who can change it.

- A permission allowlist entry wide enough to cover arbitrary commands: a wildcard, a shell invocation, or a wrapper that takes a command as its argument. An entry that reads as narrow can be wide, since an allowlist for a package-manager run command permits whatever the manifest defines under that name, and the manifest is editable in the same pull request.
- A hook bound to an event the reader does not initiate, which is the agent equivalent of a post-install script.
- An external tool server added to the configuration, which is a dependency with network access and no lockfile entry.
- Instructions directing the agent to fetch and follow content from outside the repository. Text arriving from an issue, a page, or a dependency's README and reaching an agent that can execute is injection, and the configuration file is where that path opens.
