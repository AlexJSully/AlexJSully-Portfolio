/** Returns the image optimizer URL for `source` at a width and quality the default configuration allows. */
function optimizerUrl(source: string): string {
	return `http://localhost:3000/_next/image?url=${encodeURIComponent(source)}&w=640&q=75`;
}

describe('Image Security Tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('serves a local image from public/ through image optimization', () => {
		cy.request({ url: optimizerUrl('/images/drawn/profile_pic_drawn.webp'), failOnStatusCode: false }).then(
			(response) => {
				expect(response.status).to.equal(200);
				expect(response.headers['content-type']).to.match(/^image\//);
			},
		);
	});

	it('should only allow configured remote image domains', () => {
		// next.config.js allows only alexjsully.me as a remote image host.
		const disallowedDomain = 'https://random-external-site.com/image.jpg';

		cy.request({ url: optimizerUrl(disallowedDomain), failOnStatusCode: false }).then((response) => {
			expect(response.status).to.equal(400);
		});
	});

	it('should prevent file download attacks through image optimization', () => {
		// Test that image optimization doesn't allow arbitrary file downloads
		const maliciousParams = ['../../../../etc/passwd', 'file:///etc/hosts'];

		maliciousParams.forEach((param) => {
			cy.request({ url: optimizerUrl(param), failOnStatusCode: false }).then((response) => {
				expect(response.status).to.equal(400);

				const contentType = response.headers['content-type'] || '';
				expect(contentType).to.not.include('text/plain');
				expect(contentType).to.not.include('application/octet-stream');
			});
		});
	});
});
