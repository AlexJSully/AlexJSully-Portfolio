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

	// Test: Check that the page loads correctly
	it('should render page', () => {
		// Check that the profile picture exists on the page
		cy.get('[data-testid="profile_pic"]').should('exist');
	});

	// Test: Small screen should not show 'Joo-Hyun' in name
	it('should not show Joo-Hyun on small screens', () => {
		cy.viewport('iphone-6');
		cy.visit('http://localhost:3000');
		cy.get('h1[aria-label="Name"]').should('exist');
		cy.get('h1[aria-label="Name"]').should('not.contain.text', 'Joo-Hyun');
	});

	// Test: Large screen should show 'Joo-Hyun' in name
	it('should show Joo-Hyun on large screens', () => {
		cy.viewport(1280, 800);
		cy.visit('http://localhost:3000');
		cy.get('h1[aria-label="Name"]').should('exist');
		cy.get('h1[aria-label="Name"]').should('contain.text', 'Joo-Hyun');
	});
});
