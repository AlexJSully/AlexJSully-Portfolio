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
			'X-Forwarded-Proto': 'http',
			'X-Real-IP': '127.0.0.1',
			'X-Forwarded-For': '192.168.1.1, evil.com',
			Host: 'attacker.site',
		};

		Object.entries(sensitiveHeaders).forEach(([headerName, headerValue]) => {
			cy.request({
				url: 'http://localhost:3000',
				headers: {
					[headerName]: headerValue,
				},
				failOnStatusCode: false,
			}).then((response) => {
				const responseHeaderValues = Object.values(response.headers).join(' ');

				expect(responseHeaderValues).to.not.include(headerValue);

				if (response.status >= 300 && response.status < 400) {
					const location = response.headers.location;
					if (location) {
						expect(location).to.not.include('evil.com');
						expect(location).to.not.include('attacker.site');
					}
				}
			});
		});
	});

	it('should not redirect to an off-origin destination', () => {
		const maliciousRedirects = [
			'http://evil.com',
			'https://attacker.site/steal-data',
			'ftp://internal-server.local',
			'file:///etc/passwd',
			'gopher://localhost:25',
		];

		maliciousRedirects.forEach((redirectUrl) => {
			cy.request({
				url: `http://localhost:3000?redirect=${encodeURIComponent(redirectUrl)}`,
				followRedirect: false,
				failOnStatusCode: false,
			}).then((response) => {
				if (response.status >= 300 && response.status < 400) {
					const location = response.headers.location;
					if (location) {
						expect(location).to.not.include('evil.com');
						expect(location).to.not.include('attacker.site');
						expect(location).to.not.match(/^(ftp|file|gopher):/);

						if (typeof location === 'string' && location.startsWith('http')) {
							expect(location).to.match(/^https?:\/\/localhost(:\d+)?/);
						}
					}
				}
			});
		});
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
