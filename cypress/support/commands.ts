import 'cypress-axe';

/// <reference types="cypress" />

declare global {
	// eslint-disable-next-line no-unused-vars
	namespace Cypress {
		interface Chainable {
			a11yCheck(): Chainable<void>;
		}
	}
}

/**
 * Settings passed to every `cypress-axe` accessibility check.
 *
 * `violationCallback` sends each violation's rule, impact, and element selectors to the
 * `logA11yViolations` task, which prints them in the terminal so a failure names the offending
 * rule; the reporter otherwise states only that a violation occurred. `violations` is `any`
 * because `cypress-axe` does not export the callback's result type.
 */
const axeParams = {
	context: undefined,
	rules: undefined,
	violationCallback: (violations: any) => {
		cy.task(
			'logA11yViolations',
			violations.map(({ id, impact, help, nodes }: any) => ({
				id,
				impact,
				help,
				targets: nodes.map((node: any) => node.target.join(' ')),
			})),
		);
	},
};

/** Injects `cypress-axe` and runs an accessibility check with the project defaults. */
Cypress.Commands.add('a11yCheck', () => {
	cy.injectAxe();
	cy.checkA11y(axeParams.context, axeParams.rules, axeParams.violationCallback);
});
