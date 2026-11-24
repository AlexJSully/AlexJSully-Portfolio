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
 * Injects `cypress-axe` and runs an accessibility check over the whole page with axe's default rules.
 *
 * The violation callback sends each violation's rule, impact, and element selectors to the
 * `logA11yViolations` task, which prints them in the terminal so a failure names the offending
 * rule; the reporter otherwise states only that a violation occurred.
 */
Cypress.Commands.add('a11yCheck', () => {
	cy.injectAxe();
	cy.checkA11y(undefined, undefined, (violations) => {
		cy.task(
			'logA11yViolations',
			violations.map(({ id, impact, help, nodes }) => ({
				id,
				impact,
				help,
				// A target entry inside a shadow root is itself an array, from the host down to the element.
				targets: nodes.map((node) =>
					node.target.map((part) => (Array.isArray(part) ? part.join(' >>> ') : part)).join(' '),
				),
			})),
		);
	});
});
