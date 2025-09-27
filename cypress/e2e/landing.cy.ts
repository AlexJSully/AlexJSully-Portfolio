// This test suite is for the landing page
describe('Landing Page', () => {
	// This hook runs before each test in the suite
	beforeEach(() => {
		// Visit the landing page
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		// Accessibility check
		cy.a11yCheck();
	});

	// This test checks that the page renders correctly
	it('should render page', () => {
		// Check that the profile picture exists on the page
		cy.get('[data-testid="profile_pic"]').should('exist');
	});

	it('should show cookie snackbar on first load and not after accepting', () => {
		const hydrationErrorPattern = /hydration|did not match|content does not match/i;
		cy.on('window:before:load', (win) => {
			cy.spy(win.console, 'error').as('consoleError');
		});

		// The snackbar should be visible on first load
		cy.get('.MuiSnackbar-root').should('exist').and('be.visible');
		cy.contains('This website uses cookies to enhance the user experience.').should('be.visible');

		// Click the close button to accept cookies
		cy.get('.MuiSnackbar-root button[aria-label="close"]').click();
		cy.get('.MuiSnackbar-root').should('not.exist');

		// Reload the page
		cy.reload();

		// The snackbar should not appear again
		cy.get('.MuiSnackbar-root').should('not.exist');

		// Assert no hydration errors in the browser console
		cy.get('@consoleError').should('not.have.been.calledWithMatch', hydrationErrorPattern);
	});
});
