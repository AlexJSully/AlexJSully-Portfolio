// This test suite is for the landing page
describe('Landing Page', () => {
	afterEach(() => {
		// Accessibility check
		cy.a11yCheck();
	});

	// This test checks that the page renders correctly
	it('should render page', () => {
		cy.visit('http://localhost:3000');
		// Check that the profile picture exists on the page
		cy.get('[data-testid="profile_pic"]').should('exist');
	});

	it('should show cookie snackbar on first load and not after accepting', () => {
		cy.visit('http://localhost:3000');

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
	});

	it('initialises without console errors or uncaught exceptions', () => {
		const uncaught: Error[] = [];
		cy.on('window:before:load', (win) => {
			cy.spy(win.console, 'error').as('consoleError');

			win.addEventListener('error', (event) => {
				uncaught.push(event.error ?? new Error(event.message));
			});
			win.addEventListener('unhandledrejection', (event) => {
				const reason = (event as PromiseRejectionEvent).reason;
				uncaught.push(reason instanceof Error ? reason : new Error(String(reason)));
			});
		});

		cy.visit('http://localhost:3000');
		cy.get('[data-testid="profile_pic"]').should('exist');

		cy.get('@consoleError').then((spy: unknown) => {
			const calls = (spy as sinon.SinonSpy).getCalls();
			const messages = calls.map((c) =>
				c.args.map((a: unknown) => (a instanceof Error ? a.message : String(a))).join(' '),
			);

			expect(messages, `unexpected console.error calls:\n${messages.join('\n')}`).to.have.lengthOf(0);
		});

		cy.then(() => {
			expect(
				uncaught,
				`unexpected uncaught errors:\n${uncaught.map((e) => e.message).join('\n')}`,
			).to.have.lengthOf(0);
		});
	});
});
