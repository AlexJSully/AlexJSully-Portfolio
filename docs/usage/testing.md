# Testing Documentation

## Overview

This document explains how the testing setup works in this codebase and how to run each test. If you want to contribute to this repository, please refer to the [Contributing Guide](../../CONTRIBUTING.md).

Implementation: [cypress.config.ts](../../cypress.config.ts), [jest.config.js](../../jest.config.js)

## Testing Setup

Two runners cover different layers. Jest exercises individual components and functions from test files colocated beside their source, and Cypress drives the running site end to end. They compile under separate TypeScript programs, which is why [`npm run tsc`](../../package.json) type-checks the root `tsconfig.json` and `cypress/tsconfig.json` in sequence.

### Key Elements

- **Jest Configuration**: [jest.config.js](../../jest.config.js) wraps Next.js's own Jest transform, sets the `jsdom` environment, mirrors the `tsconfig.json` path aliases through `moduleNameMapper`, and loads [jest/setup.ts](../../jest/setup.ts) after the environment is ready. It ignores `cypress/`, so the two suites never collide.
- **Cypress Configuration**: [cypress.config.ts](../../cypress.config.ts) sets `includeShadowDom` so commands reach into shadow roots, and enables `experimentalRunAllSpecs` to run every spec in one pass. No `baseUrl` is configured, so specs pass an absolute URL to `cy.visit()`.
- **Test Files**: End-to-end test specs are located in [cypress/e2e/landing.cy.ts](../../cypress/e2e/landing.cy.ts) and related files in the same directory.
- **Support Files**: Cypress support files are located in [cypress/support/e2e.ts](../../cypress/support/e2e.ts) and [cypress/support/commands.ts](../../cypress/support/commands.ts).

### Flowchart

```mermaid
flowchart TD
    accTitle: Validation Pipeline Workflow
    accDescr {
        npm run validate runs Prettier, ESLint, TypeScript, Jest, Cypress, the Next.js build, and Markdown linting in
        that order. A passing check leads to the next check, and a passing Markdown lint ends at All Checks Passed.
        A failing check leads to its corresponding fix action and stops the pipeline: Prettier to npm run prettier,
        ESLint to npm run eslint, TypeScript to fix type errors, Jest to fix unit tests, Cypress to fix end-to-end
        tests, the build to fix build errors, or Markdown lint to fix Markdown issues. Each fix action is terminal.
    }
    Validate[npm run validate] --> Prettier[Prettier Format]
    Prettier --> ESLint[ESLint Check]
    ESLint --> TSC[TypeScript Check]
    TSC --> Jest[Jest Unit Tests]
    Jest --> Cypress[Cypress E2E Tests]
    Cypress --> Build[Next.js Build]
    Build --> Markdown[Markdown Lint]
    Markdown --> Success[✓ All Checks Passed]

    Prettier -->|Fails| PrettierFix[Run: npm run prettier]
    ESLint -->|Fails| ESLintFix[Run: npm run eslint]
    TSC -->|Fails| TSCFix[Fix TypeScript errors]
    Jest -->|Fails| JestFix[Fix unit tests]
    Cypress -->|Fails| CypressFix[Fix E2E tests]
    Build -->|Fails| BuildFix[Fix build errors]
    Markdown -->|Fails| MarkdownFix[Fix markdown issues]
```

## Running Tests

To run the tests, you can use the following commands:

### Running Jest Unit Tests

1. **Run all Jest tests:**

    ```sh
    npm run test:jest
    ```

2. **Run Jest with coverage:**

    ```sh
    npm run test:jest:coverage
    ```

    This generates a coverage report showing which parts of the code are tested.

### Running Cypress Tests

1. **Open Cypress Test Runner:** This command opens the Cypress Test Runner, allowing you to run tests interactively.

    ```sh
    npm run cypress
    # or
    npm run test:cypress:open
    ```

2. **Run Cypress Tests in Headless Mode:** This command runs all Cypress tests in headless mode, which is useful for CI/CD pipelines.

    ```sh
    npm run e2e:headless
    # or
    npm run test:cypress:e2e
    ```

### Running All Tests

To run all tests, linting, type checking, and build, use the following command:

```sh
npm run validate
```

This command runs the following checks in order, stopping at the first one that exits non-zero:

1. **Prettier**: Rewrites formatting in place with `prettier --write ./`.
2. **ESLint**: Repairs what is autofixable with `eslint --fix ./` and reports the rest.
3. **TypeScript**: Ensures type safety by running `npm run tsc` (root `tsconfig.json` and `cypress/tsconfig.json`).
4. **Jest**: Runs unit tests.
5. **Cypress**: Runs end-to-end tests.
6. **Build**: Ensures the project builds successfully with `next build`.
7. **Markdown Lint**: Rewrites markdown in place with `markdownlint-cli2 --fix`, against the rules in [`.markdownlint-cli2.jsonc`](../../.markdownlint-cli2.jsonc).

Because steps 1, 2, and 7 write, a run that reaches exit code 0 can still leave the working tree dirty: each applies every fix its tool can apply and fails only on what is left, such as an ESLint rule with no automatic fix or a markdown file that does not open with a top-level heading. Commit whatever those three rewrote. The workflows described below re-check the same rules without writing, so a fix left unstaged fails CI on the rule the local run already settled.

### Cypress Test Example

Here is an example of a Cypress test located in [cypress/e2e/landing.cy.ts](../../cypress/e2e/landing.cy.ts). It stubs the third-party hosts matched by `TRACKERS`, then checks that before the visitor chooses, no `_ga` analytics cookie is set, no service worker is registered, and no request reaches a stubbed host. `waitForHydratedIdle()`, defined in the same spec, waits for hydration and then one idle period, capped at 2 seconds, so each assertion that something did not happen runs after the client has had its chance to do it:

```ts
describe('Landing Page', () => {
	afterEach(() => {
		cy.a11yCheck();
	});

	it('asks for consent before storing or sending anything optional', () => {
		cy.intercept(TRACKERS, { statusCode: 204 }).as('tracker');
		cy.visit('http://localhost:3000');

		cy.get('section[aria-label="Your privacy choices"]').should('be.visible');
		waitForHydratedIdle();
		cy.getCookies().should((cookies) => {
			expect(cookies.map((cookie) => cookie.name).filter((name) => name.startsWith('_ga'))).to.be.empty;
		});
		cy.window()
			.then((win) => win.navigator.serviceWorker.getRegistrations())
			.should('have.length', 0);
		cy.get('@tracker.all').should('have.length', 0);
	});
});
```

## Continuous Integration

This repository uses a CI workflow defined in [code-qa.yaml](../../.github/workflows/code-qa.yaml) to ensure code quality. It runs on Node 24.x, on every push and pull request to `main` whose changed files match its `paths` filter: anything under `public/` or `src/`, any `.json`, `.js`, `.ts`, `.tsx`, `.jsx`, `.css`, `.scss`, or `.html` file, or the workflow itself. A pull request touching only Markdown therefore skips it entirely. The checks are:

- **Prettier**: Ensures code formatting is consistent, via `npm run prettier:check`.
- **ESLint**: Checks for code quality and potential issues, via `npm run eslint:check`.
- **TypeScript**: Ensures type safety.
- **Jest**: Runs unit tests.
- **Cypress**: Runs end-to-end tests.
- **Build**: Ensures the project builds successfully.

Markdown is linted by a separate [markdown-lint.yaml](../../.github/workflows/markdown-lint.yaml) workflow, which runs `npm run lint:markdown:check` when a `.md` or `.MD` file, a `.markdownlint-cli2.jsonc`, or the workflow itself changes. Splitting the two means editing prose does not spend a full build, and editing code does not wait on markdown.

No workflow calls `npm run validate`, and none of the steps above writes to a checked-out file. A violation that `npm run validate` would have repaired locally therefore fails CI instead, which is why the local run belongs before the commit rather than after the push.

### Dependency review

The [dependency-review.yaml](../../.github/workflows/dependency-review.yaml) workflow runs the [dependency review action](https://github.com/actions/dependency-review-action/blob/v5.0.0/README.md) on every pull request to `main`, without a path filter. It compares dependency changes between the pull request's base and head revisions using GitHub's dependency graph, which records detected packages and their relationships. The action is available for public repositories on GitHub Free, including repositories owned by personal accounts. It does not require the separate [enterprise licence compliance feature](https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/supply-chain-security/open-source-license-compliance).

The workflow sets these policy inputs:

- **`allow-licenses`**: Accepts `0BSD`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `BlueOak-1.0.0`, `CC0-1.0`, `ISC`, `MIT`, `MIT-0`, `Python-2.0`, `PSF-2.0`, and `Unlicense`. These are Software Package Data Exchange (SPDX) identifiers, standardized names for licences. The action evaluates compound licence expressions against this list. No package-specific licence exceptions are configured.
- **`fail-on-severity`**: Fails on introduced known vulnerabilities rated `high` or `critical`.
- **`fail-on-scopes`**: Includes `runtime`, `development`, and `unknown`, covering application dependencies, development tools, and dependencies whose scope GitHub cannot determine. Detected transitive dependencies, packages brought in by other dependencies, are included in the review.
- **`retry-on-snapshot-warnings`**: Retries dependency comparisons with snapshot warnings for up to 120 seconds while GitHub processes dependency data.

The workflow grants only `contents: read`, uses the automatic GitHub token, and posts no pull-request comments. Results appear in the `Dependency Review` check's job summary and logs. On failure, inspect the affected package and dependency chain, then update, remove, or replace the dependency, or review a deliberate change to `allow-licenses`. A licence outside the list requires review; the failed check is not a legal finding. Do not add a blanket exception solely to make the check pass.

The action reviews dependency changes, not the entire existing dependency tree. It does not generate licences, verify attribution or redistribution obligations, or certify legal compliance. Its [licence detection limitation](https://github.com/actions/dependency-review-action/blob/v5.0.0/README.md#configuration-options) means an undetected licence is reported without failing the check; an unresolvable licence expression can fail. Review missing licence information manually. Existing dependencies with licences outside the allowlist are not automatically approved, and dependency updates involving those packages can fail.

To prevent merging on a failed review, after the workflow has run, a repository administrator can select `Dependency Review` as a required status check in the branch protection rule or ruleset targeting `main`. The workflow itself does not configure branch protection. GitHub documents [required status checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-status-checks-before-merging).

## Contributing

If you want to contribute to this repository, please refer to the [Contributing Guide](../../CONTRIBUTING.md) for more details on the pull request process and code of conduct.

## Related Documentation

- [Contributing Guide](../../CONTRIBUTING.md)
- [Setup & Installation](./setup.md)
