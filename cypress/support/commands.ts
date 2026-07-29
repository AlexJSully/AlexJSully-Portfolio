import 'cypress-axe';

/// <reference types="cypress" />

declare global {
	namespace Cypress {
		interface Chainable {
			a11yCheck(): Chainable<void>;
		}
	}
}

/**
 * Settings passed to every `cypress-axe` accessibility check.
 *
 * `violationCallback` logs each violation so a failure names the offending rule; the reporter
 * otherwise states only that a violation occurred. `violations` is `any` because `cypress-axe`
 * does not export the callback's result type.
 */
const axeParams = {
	context: undefined,
	rules: undefined,
	violationCallback: (violations: any) => {
		console.log('violations', violations);
	},
};

/** Injects `cypress-axe` and runs an accessibility check with the project defaults. */
Cypress.Commands.add('a11yCheck', () => {
	cy.injectAxe();
	cy.checkA11y(axeParams.context, axeParams.rules, axeParams.violationCallback);
});
