describe('Security headers', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('should not reflect forwarded-host headers back in the response', () => {
		const sensitiveHeaders = {
			'X-Forwarded-Host': 'evil.com',
			'X-Forwarded-Proto': 'evil-proto',
			'X-Real-IP': '127.0.0.1',
			'X-Forwarded-For': '192.168.1.1, evil.com',
			Host: 'attacker.site',
		};

		Object.entries(sensitiveHeaders).forEach(([headerName, headerValue]) => {
			// `/about` redirects, so the response carries a Location for each forged header to leak into.
			cy.request({
				url: 'http://localhost:3000/about',
				headers: {
					[headerName]: headerValue,
				},
				followRedirect: false,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.equal(307);
				expect(response.headers.location).to.equal('/');
				expect(Object.values(response.headers).join(' ')).to.not.include(headerValue);
			});
		});
	});

	it('should not redirect to an off-origin destination', () => {
		const forgedHosts = { Host: 'attacker.site', 'X-Forwarded-Host': 'evil.com' };

		for (const { source, destination } of [
			{ source: '/about', destination: '/' },
			{ source: '/privacy', destination: '/#privacy' },
		]) {
			cy.request({
				url: `http://localhost:3000${source}`,
				headers: forgedHosts,
				followRedirect: false,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.equal(307);
				expect(response.headers.location).to.equal(destination);
			});
		}
	});

	it('should not leak internal paths from rewritten request headers', () => {
		cy.request({
			url: 'http://localhost:3000',
			headers: {
				'X-Forwarded-Host': 'evil.com',
				'X-Forwarded-Proto': 'javascript',
				'X-Original-URL': '/admin/secret',
				'X-Rewrite-URL': '/../../etc/passwd',
			},
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.body).to.not.include('/etc/passwd');
			expect(response.body).to.not.include('/admin/secret');
			expect(response.status).to.not.equal(500);
		});
	});
});
