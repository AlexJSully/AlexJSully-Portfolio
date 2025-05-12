import 'cypress-axe';

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
	namespace Cypress {
		interface Chainable {
			a11yCheck(): Chainable<void>;
		}
	}
}

/**
 * Project default settings for `cypress-axe` accessibility check
 * Only thing being changed is the addition of `violationCallback` console logging any violations
 * This adds support to see what the violation is instead of the default behaviour just to state there is a violation
 *
 * This is a default configuration for all tests
 */
const axeParams = {
	context: undefined,
	rules: undefined,
	violationCallback: (violations: any) => {
		console.log('violations', violations);
	},
};

// Defines a custom accessibility check which injects `cypress-axe` and performs a default/basic a11y check
Cypress.Commands.add('a11yCheck', () => {
	cy.injectAxe();
	cy.checkA11y(axeParams.context, axeParams.rules, axeParams.violationCallback);
});
