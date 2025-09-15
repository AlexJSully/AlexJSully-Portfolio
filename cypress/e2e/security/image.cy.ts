describe('Image Security Tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('should only allow configured remote image domains', () => {
		// Based on your next.config.js, only alexjsully.me should be allowed
		const disallowedDomain = 'https://random-external-site.com/image.jpg';

		cy.request({
			url: `/_next/image?url=${encodeURIComponent(disallowedDomain)}&w=640&q=75`,
			failOnStatusCode: false,
		}).then((response) => {
			// Should return error status, not serve the image
			expect(response.status).to.not.equal(200);
		});
	});

	it('should prevent file download attacks through image optimization', () => {
		// Test that image optimization doesn't allow arbitrary file downloads
		const maliciousParams = ['../../../../etc/passwd', 'file:///etc/hosts'];

		maliciousParams.forEach((param) => {
			cy.request({
				url: `/_next/image?url=${encodeURIComponent(param)}&w=640&q=75`,
				failOnStatusCode: false,
			}).then((response) => {
				// Should return error status, not serve files
				expect(response.status).to.not.equal(200);
				const contentType = response.headers['content-type'] || '';
				expect(contentType).to.not.include('text/plain');
				expect(contentType).to.not.include('application/octet-stream');
			});
		});
	});
});
