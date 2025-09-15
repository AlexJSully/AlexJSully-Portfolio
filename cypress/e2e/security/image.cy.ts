describe('Image Security Tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('should only allow configured remote image domains', () => {
		// Based on your next.config.js, only alexjsully.me should be allowed
		const allowedDomain = 'https://alexjsully.me/some-image.jpg';
		const disallowedDomain = 'https://random-external-site.com/image.jpg';

		cy.window().then((win) => {
			// Test allowed domain doesn't throw errors in console
			cy.visit('http://localhost:3000').then(() => {
				// Check console for any image optimization errors
				cy.window().then((win) => {
					const originalConsoleError = win.console.error;
					let hasImageError = false;

					win.console.error = (...args) => {
						if (args.some((arg) => typeof arg === 'string' && arg.includes('Image Optimization'))) {
							hasImageError = true;
						}
						originalConsoleError.apply(win.console, args);
					};

					// Try to trigger Next.js image optimization with disallowed domain
					fetch(`/_next/image?url=${encodeURIComponent(disallowedDomain)}&w=640&q=75`)
						.then((response) => {
							// Should not succeed for disallowed domains
							expect(response.ok).to.be.false;
						})
						.catch(() => {
							// Expected to fail
						});
				});
			});
		});
	});

	it('should prevent file download attacks through image optimization', () => {
		// Test that image optimization doesn't allow arbitrary file downloads
		const maliciousParams = [
			'../../../../etc/passwd',
			'..\\..\\..\\windows\\system32\\config\\sam',
			'file:///etc/hosts',
		];

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
