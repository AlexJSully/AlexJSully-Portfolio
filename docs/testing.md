# Testing Documentation

## Overview

This document explains how the testing setup works in this codebase and how to run each test. If you want to contribute to this repository, please refer to the [Contributing Guide](../../CONTRIBUTING.md).

## Testing Setup

The testing setup in this codebase uses Cypress for end-to-end (E2E) testing. The configuration for Cypress is located in [cypress.config.ts](../../cypress.config.ts).

### Key Elements

- **Cypress Configuration**: The Cypress configuration file defines the settings and options for running tests.
- **Test Files**: Test files are located in the `cypress/e2e` directory.
- **Support Files**: Support files are located in the `cypress/support` directory and include custom commands and global configuration.

### Flowchart

```mermaid
flowchart LR
    A[Cypress Configuration] -->|Defines| B[Test Settings]
    B --> C[Test Files]
    B --> D[Support Files]
    C --> E[Run Tests]
    D --> F[Custom Commands]
    D --> G[Global Configuration]
 L[Code Quality and Linting] -->|Runs| H[Prettier]
 L --> I[ESLint]
 T[TypeScript] -->|Runs| J[Type Checking]
 K[NextJS Build] -->|Runs| M[Build Tests]
```

## Running Tests

To run the tests, you can use the following commands:

### Running Cypress Tests

1. **Open Cypress**: This command opens the Cypress Test Runner, allowing you to run tests interactively.

```sh
npm run cypress
```

2. **Run Cypress Tests in Headless Mode**: This command runs all Cypress tests in headless mode, which is useful for CI/CD pipelines.

```sh
npm run e2e:headless
```

### Running All Tests

To run all tests, including linting and type checking, use the following command:

```sh
npm run validate
```

This command runs the following checks:

- **Prettier**: Ensures code formatting is consistent.
- **ESLint**: Checks for code quality and potential issues.
- **TypeScript**: Ensures type safety.
- **Cypress**: Runs end-to-end tests.
- **Build**: Ensures the project builds successfully.

### Cypress Test Example

Here is an example of a Cypress test located in [cypress/e2e/landing.cy.ts](../../cypress/e2e/landing.cy.ts):

```ts
// This test suite is for the landing page
describe('Landing Page', () => {
	// This hook runs before each test in the suite
	beforeEach(() => {
		// Visit the landing page
		cy.visit('http://localhost:3000');
	});

	// This test checks that the page renders correctly
	it('should render page', () => {
		// Check that the profile picture exists on the page
		cy.get('[data-testid="profile_pic"]').should('exist');
	});
});
```

## Continuous Integration

This repository uses a CI workflow defined in [code-qa.yml](../../.github/workflows/code-qa.yml) to ensure code quality. The workflow runs the following checks on every push and pull request to the `main` branch:

- **Prettier**: Ensures code formatting is consistent.
- **ESLint**: Checks for code quality and potential issues.
- **TypeScript**: Ensures type safety.
- **Cypress**: Runs end-to-end tests.
- **Build**: Ensures the project builds successfully.

## Contributing

If you want to contribute to this repository, please refer to the [Contributing Guide](../../CONTRIBUTING.md) for more details on the pull request process and code of conduct.

By following these steps, you can successfully run and contribute to the tests in this codebase.
