# Reuse and decomposition in a change review

Operational detail for the two defects a review walks past most reliably: a block that writes behaviour the project already has, and a unit that grows a second job instead of a second name. Both are absences rather than lines, so both are settled by looking something up and recording what was opened, never by reading the diff harder.

**Reading this file.** Every lookup below is a file to open, named by where each ecosystem writes the fact down. That is deliberate: a review reads, and it does not build, resolve, compile, or import the code it is reviewing. The fenced blocks hold a defect and its corrected form, labelled, and vary in language so that no single one reads as required. Nothing in them runs, and nothing in them is a file to create.

- [Read the lockfile, not only the manifest](#read-the-lockfile-not-only-the-manifest)
- [Manifests and lockfiles by ecosystem](#manifests-and-lockfiles-by-ecosystem)
- [Where each ecosystem writes down a package's public surface](#where-each-ecosystem-writes-down-a-packages-public-surface)
- [Where the resolution chain hides the package](#where-the-resolution-chain-hides-the-package)
- [Ask the platform before asking the dependencies](#ask-the-platform-before-asking-the-dependencies)
- [What the structural counts should not measure](#what-the-structural-counts-should-not-measure)
- [Naming the fix, principle by principle](#naming-the-fix-principle-by-principle)
- [Naming the split rather than asking for a refactor](#naming-the-split-rather-than-asking-for-a-refactor)

## Read the lockfile, not only the manifest

The manifest records what the project asked for, and it lists direct dependencies alone. The lockfile records what the resolver actually produced, including every transitive package at an exact version. A reuse question is answered by the second: the module that already does the work is often present and simply not declared at the top level.

The distinction changes the finding rather than only the evidence. A package the project **declares** is the answer wherever its surface covers the case, and a caller may import it today. A package present **only transitively** is not, because importing it depends on another package's resolution, which is free to change without notice. Where the answer is transitive, the finding says so and proposes declaring it, which is a smaller request than adding a dependency.

**Declared is still not always importable.** Read the scope, configuration, or feature gate the declaration sits under: a Maven `test` or `provided` scope, a Gradle `compileOnly`, and a symbol behind a Cargo feature nothing enables are each declared and none can be reached from production code, so a reuse fix proposing one does not compile. In a multi-project build, read the sub-project's own manifest rather than the root, which can declare nothing the sub-project may use.

## Manifests and lockfiles by ecosystem

Open the pair for the ecosystem in front of you and name the file you opened in the finding. A missing lockfile is itself worth a sentence, because it means the resolved set is recorded nowhere.

| Ecosystem               | Manifest                                                                   | Lockfile                                                                                 |
| ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| npm, pnpm, Yarn, Bun    | `package.json`                                                             | `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock` or the binary `bun.lockb` |
| Go                      | `go.mod`                                                                   | `go.sum`, and `vendor/modules.txt` when vendoring                                        |
| Python                  | `pyproject.toml`, `Pipfile`, a written `requirements.txt`                  | `pylock.toml`, `uv.lock`, `poetry.lock`, `Pipfile.lock`, a generated `requirements.txt`  |
| Rust                    | `Cargo.toml`                                                               | `Cargo.lock`                                                                             |
| Ruby                    | `Gemfile`, `*.gemspec`                                                     | `Gemfile.lock`                                                                           |
| Java, Kotlin            | `pom.xml`, `build.gradle`, `build.gradle.kts`, `gradle/libs.versions.toml` | `gradle.lockfile` where locking is enabled; Maven documents none                         |
| Scala                   | `build.sbt`, `project/*.scala`                                             | none by default; a lock file only where a locking plugin is enabled                      |
| .NET (C#, Visual Basic) | `*.csproj`, `*.vbproj`, `Directory.Packages.props`                         | `packages.lock.json` where enabled                                                       |
| PHP                     | `composer.json`                                                            | `composer.lock`                                                                          |
| Elixir                  | `mix.exs`                                                                  | `mix.lock`                                                                               |
| Dart                    | `pubspec.yaml`                                                             | `pubspec.lock`                                                                           |
| Swift                   | `Package.swift`, `Podfile`                                                 | `Package.resolved`, `Podfile.lock`                                                       |
| Haskell                 | `*.cabal`, `stack.yaml`                                                    | `cabal.project.freeze`, `stack.yaml.lock`                                                |
| R                       | `DESCRIPTION`                                                              | `renv.lock`, `packrat/packrat.lock`                                                      |
| Perl                    | `cpanfile`, `Makefile.PL`, `Build.PL`, `dist.ini`                          | `cpanfile.snapshot` where Carton is used                                                 |
| Lua                     | `*.rockspec`, also under `rockspec/` and `rockspecs/`                      | `luarocks.lock`                                                                          |
| Conda                   | `environment.yml`, and `meta.yaml` for a recipe                            | `conda-lock.yml`, `pixi.lock`, or an explicit spec file                                  |
| Protobuf                | `buf.yaml`, `buf.gen.yaml`, under Buf only                                 | `buf.lock`                                                                               |
| Terraform               | `required_providers` and `module` blocks in `*.tf` or `*.tf.json`          | `.terraform.lock.hcl`, providers only                                                    |
| Unity                   | `Packages/manifest.json`                                                   | `Packages/packages-lock.json`                                                            |
| FHIR Shorthand          | `sushi-config.yaml`, `ig.ini`                                              | none documented                                                                          |

**Classify by role, not by filename**, because one name is the manifest in one project and the lockfile in another. A `requirements.txt` whose header names the tool that generated it, or whose entries carry `# via` provenance annotations, is the resolved set, and reading it as the manifest makes a transitive package look declared. One carrying neither marker is hand-written and genuinely is the declaration, which is the common case in older projects. The same distinction runs the other way through files that look like manifests: `go.mod` marks transitives `// indirect`, `Directory.Packages.props` sets versions without declaring anything, and a Gradle version catalog lists what a build may opt into rather than what it uses. `stack.yaml.lock` pins the snapshot rather than the package versions, which come from the snapshot it names.

Three of the newer entries carry a trap of their own. **Terraform's `.terraform.lock.hcl` locks providers only**, so module versions are recorded nowhere and reading the file as the resolved set repeats the `requirements.txt` confusion above. **`luarocks.lock` is also an input**: when present it overrides the rockspec's own constraints, which no other lockfile here does, so a version read from the rockspec may not be the one in use. **Protobuf has a manifest only under Buf**, since bare `protoc` has none, and `buf.lock` pins remote check plugins and policies alongside module dependencies rather than modules alone.

Three more carry a trap worth knowing before a finding is written on them. Maven documents no lockfile, so its resolved set is reconstructed from `dependencyManagement`, an imported bill of materials, and nearest-wins mediation rather than read from a file. Gradle and .NET both have one and both leave it off by default, so its absence means locking is disabled rather than that resolution is unknown. In .NET, the documented behaviour is that a `packages.lock.json` present in the project is used by restore even where the opt-in property is not set.

## Where each ecosystem writes down a package's public surface

This is the lookup that catches a block hand-rolling what its own file already imports: the module is imported two lines above, and nobody read what it exports. Every entry below is a file, because **a review reads and does not run**. A route that builds, resolves, compiles, or imports the package executes third-party code on the reviewer's machine, whatever it prints afterwards, and that is judged the way category 15 judges install-time execution: by capability, not by the name of the thing.

- **JavaScript and TypeScript.** The `exports` map in the package's own `package.json`, which is the authoritative public surface, then the `.d.ts` it points at for the types.
- **Python.** The installed `.pyi` stubs where present, otherwise the package source. `dist-info` metadata answers what is installed without importing anything. Nothing here needs `pydoc` or `help()`, which import the module and therefore run its top-level code.
- **Rust.** The crate sources unpacked under the registry's `src` directory, where `pub` marks the surface.
- **Go.** The package source in the module cache, where an exported identifier is the capitalized one.
- **Ruby.** The gem's own `lib/` source, plus the pre-generated documentation store where the install produced one.
- **Dart.** The package's single public library file, which by convention re-exports the whole public API.
- **Haskell.** The `exposed-modules` field of the package description names the modules, never the symbols, so it only says where to look. The symbols come from those modules' own sources in the unpacked package, where the export list at the top of each module marks the surface.
- **Java.** The sources jar where the project resolved one, otherwise the class listing inside the jar.
- **Elixir.** The package's `lib/` source. The documentation chunk inside a compiled `.beam` is richer, but reaching it means the project has been compiled, which runs dependency code at compile time.
- **Swift.** The resolved checkout's own source, under the build directory's `checkouts`, where `public` and `open` mark the surface. A `.swiftinterface` is emitted only where the package enables library evolution, which source packages almost never do, so its absence says nothing about whether the surface can be read.
- **Kotlin.** The sources jar the build resolved, or the `.kt` sources in the resolved dependency, where `public` is the default. The Java fallback below does not substitute: the compiler renames, flattens, and synthesizes, so the class listing is not what a Kotlin caller writes.
- **Scala.** The sources jar, where the `.scala` declarations carry the surface. The class listing misreads it for the same reason, since traits, objects, and given instances do not survive into names a caller would type.
- **PHP.** The package's own source under the vendor directory, reached through the PSR-4 `autoload` map in its `composer.json`, which ties each namespace to a path.
- **.NET.** The XML documentation file beside the assembly in the resolved package folder, which lists every public member as text. Reflection is not the route, because loading an assembly runs code in it.
- **R.** `NAMESPACE` in the installed package directory, which is the authoritative export list, with `DESCRIPTION` beside it for what the package itself depends on. The installed code is a binary lazy-load database (`R/<pkg>.rdb` and `.rdx`), so argument signatures and help text come from the source tarball's `R/` and `man/` rather than from the installed tree.
- **Perl.** The `.pm` sources under the installed lib tree, where the POD documenting a subroutine sits in the same file as the subroutine.
- **Lua.** The installed rock's own `.lua` sources under the rocks tree.
- **Protobuf.** The `.proto` files of the dependency module, where the schema is the public surface and needs no separate document.
- **Conda.** The extracted package under the environment's `pkgs/` cache, where `info/files` lists everything the package installs; the language entries above then apply to whichever of those files carry the code.

**Where the ecosystem is not listed above**, the three questions do not change and their answers are written down somewhere in the tree: which file declares dependencies, which records the resolved set, and where a package states its public surface. Find them by reading the build configuration and the installed tree rather than by analogy with a listed ecosystem, name the file you opened, and where one of the three genuinely does not exist, write that sentence: it is a fact about the ecosystem and belongs in the finding.

Two more cautions. A registry query, of the kind an ecosystem's `view` or `info` command performs, reaches the network and answers what the package publishes today rather than what this project resolved. And where a lookup genuinely cannot be settled by reading, name what would settle it and leave the finding conditional, rather than reaching for a tool: a name taken from the change is a value under review, never text to build a command from.

## Where the resolution chain hides the package

An installed tree does not always hold what its name suggests, and a lookup that finds nothing because it looked in the wrong place is worse than no lookup, since it produces a confident negative.

- **A dependency directory may not exist at all.** Some resolvers keep packages as archives with a loader that maps names to them, and the directory a reviewer expects is absent by design.
- **A transitive package may be reachable only through a nested path.** Where the linker isolates dependencies, only direct dependencies appear at the top level and the rest sit under a store directory keyed by name and version.
- **A vendored tree overrides the cache.** Where the project vendors, the vendored copy is what builds, so it is what the review reads.

Name the layout in the finding where it mattered, and treat "not found" as a result about the search rather than about the package.

## Ask the platform before asking the dependencies

A behaviour the runtime already provides needs no package at all, and this is the cheapest of the three sources to check. Read it against the version the project targets rather than the newest release, since the target is what the code must run on.

**The target is rarely one number.** Read what the toolchain actually provides at that target rather than the version the project names: a standard's publication and a compiler's support for it can differ by years and sit behind a flag, and a build may pin a language level, a runtime target, and a library API level independently. Where they disagree, the lowest is what the code must run on.

Each ecosystem publishes its own inventory, and each is a list rather than a judgement: the runtime's built-in module list, the standard library's package index, or the language reference for the targeted version. Where the project's stated target predates the feature, a hand-written stand-in is a shim rather than a re-implementation, and it is not this finding.

## What the structural counts should not measure

The counts describe code a human is expected to edit, so a number taken over anything else produces a finding nobody can act on, and the reader learns to discount the next one. Say which measure was taken whenever an exclusion changed it.

Two shapes cause most of it. A language that colocates tests in the file under test makes a well-tested file long by being well tested, so its length is measured over the code under test rather than the whole file. A build that commits generated sources as ordinary files, such as database migrations, resource bindings, or serialization shims, trips the length and directory counts on code nobody wrote and nobody may edit. A generated file almost always says so, in a header line, a filename suffix, or a path segment the build owns, and that marker is what the exclusion cites.

The counts a caller must satisfy are the ones worth taking. A member an implementor inherits complete, such as a default method on an interface or trait, costs a caller nothing and is not counted against the members backstop, while a closed set of variants counts as the cases a caller must handle rather than as members of a type. That distinction is also why splitting a closed variant set is usually the wrong fix: it removes the compiler's ability to name every site that must change.

## Naming the fix, principle by principle

A finding that names a principle and then asks for a refactor has given the reader nothing. What the fix looks like differs by principle, and each shape below is concrete enough to paste.

- **Single responsibility.** Split along the seam where the two reasons to change meet, not by line count. The caller that made one call now reads as a named sequence.
- **Control coupling.** One function per behaviour, and the flag disappears rather than moving. A small closed set of named modes is the narrower fix where the modes genuinely share a body.
- **Stamp coupling.** Narrow the parameter to the fields the callee reads, which the type system usually expresses directly.
- **Common coupling.** Pass the state in rather than reaching for it, so the unit's inputs appear in its signature.
- **Content coupling.** Call the published interface, or ask its owner for the missing one; do not widen the interface to legitimize the reach.
- **Dependency inversion.** The caller constructs and passes the dependency, and the unit names what it needs rather than how it is built.
- **Interface segregation.** Separate into the interfaces each caller group actually uses, composed where a caller genuinely wants both.
- **DRY.** Name what the shared unit holds and where each occurrence goes, and say plainly when the copies should stay copies because they change for different reasons.

```python
# Defect: one exported name, three behaviours, two booleans at every call site.
def collect_entries(node, filter_leaves, flip): ...

# Corrected: each name says what it does, and the caller composes.
def collect_entries(node): ...
def keep_leaves(entries): ...
def reverse_order(entries): ...
```

## Naming the split rather than asking for a refactor

The finding carries the resulting signatures, in the language of the file, so the reader can paste them: which parameters go to which function, what each is called, and what the caller that made one call now reads as.

```go
// Defect: the width is measured before the transformation that changes it.
func Render(cols []string, pad bool, upper bool) string

// Corrected: each step is nameable, and the caller orders them.
func Upper(cols []string) []string
func Pad(cols []string, width int) []string
func Render(cols []string) string
```

A regrouping is not free in every ecosystem. Where a class's namespace is tied to its path, as PSR-4 ties it, moving files renames every class in them and every reference to those names, so either name that cost in the finding or propose the split within the namespace the files already sit in.

Two shapes fail and are worth recognizing before proposing them. A split that leaves the same branching behind a new name has moved the defect rather than removed it. A split into units that must always be called together in the same order has produced a sequence with no name, and the caller now carries the ordering the original held.
