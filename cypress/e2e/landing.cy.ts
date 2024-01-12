describe('Landing Page', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	it('should render page', () => {
		// Check that the page renders
		cy.get('[data-testid="profile_pic"]').should('exist');
	});
});
