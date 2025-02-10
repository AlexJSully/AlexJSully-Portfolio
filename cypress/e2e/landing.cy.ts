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

	// This test checks if the YouTube video plays on hover
	it('should play YouTube video on hover for Masterpiece X project', () => {
		// Check if the page contains the "Masterpiece X" project and mouse hover over it
		cy.get('[data-testid="project-mpx-grid"]').should('exist').scrollIntoView().trigger('mouseover');

		// Check if the thumbnail is hidden
		cy.get('[data-testid="project-mpx-thumbnail"]').should('not.be.visible');

		// Mouse hover out of the project and check if the video stops playing
		cy.get('[data-testid="project-mpx-grid"]').trigger('mouseout');

		// Check if the video is hidden
		cy.get('[data-testid="project-mpx-thumbnail"]').should('be.visible');
	});
});
