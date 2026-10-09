describe('Agent readiness', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('serves the home page as Markdown to clients that ask for it', () => {
		cy.request({ url: 'http://localhost:3000/', headers: { Accept: 'text/markdown' } }).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.headers['content-type']).to.eq('text/markdown; charset=utf-8');
			expect(response.headers.vary).to.include('Accept');
			expect(response.body).to.match(/^# Alexander Joo-Hyun Sullivan\n/);
		});
	});

	it('serves the home page as HTML to browsers', () => {
		cy.request({ url: 'http://localhost:3000/', headers: { Accept: 'text/html' } }).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.headers['content-type']).to.include('text/html');
		});
	});

	it('answers an unknown path with a Markdown 404 when Markdown is requested', () => {
		cy.request({
			url: 'http://localhost:3000/no-such-page',
			headers: { Accept: 'text/markdown' },
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(404);
			expect(response.headers['content-type']).to.eq('text/markdown; charset=utf-8');
			expect(response.body).to.include('/llms.txt');
		});
	});

	it('rejects a client that accepts neither HTML nor Markdown with 406', () => {
		cy.request({
			url: 'http://localhost:3000/',
			headers: { Accept: 'application/pdf' },
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(406);
		});
	});

	it('publishes llms.txt with a "When to use" section', () => {
		cy.request('http://localhost:3000/llms.txt').then((response) => {
			expect(response.headers['content-type']).to.eq('text/plain; charset=utf-8');
			expect(response.body).to.match(/^# /);
			expect(response.body).to.include('\n## When to use\n');
		});
	});

	it('redirects the About, Contact, and policy paths into the home page', () => {
		const redirects: Record<string, string> = {
			'/about': '/',
			'/contact': '/#contact',
			'/privacy': '/#privacy',
			'/policy': '/#privacy',
			'/cookie': '/#privacy',
			'/cookies': '/#privacy',
			'/privacy-policy': '/#privacy',
			'/cookie-policy': '/#privacy',
		};

		Object.entries(redirects).forEach(([source, destination]) => {
			cy.request({ url: `http://localhost:3000${source}`, followRedirect: false }).then((response) => {
				expect(response.status).to.eq(307);
				expect(response.headers.location).to.eq(destination);
			});
		});
	});

	it('serves /llm.txt as the same file as /llms.txt', () => {
		cy.request('http://localhost:3000/llms.txt').then((canonical) => {
			cy.request('http://localhost:3000/llm.txt').its('body').should('eq', canonical.body);
		});
	});

	it('opens the policy from the footer link without leaving the page', () => {
		// The banner renders only after hydration, and choosing clears it from over the footer.
		cy.contains('button', 'Essential only').click();
		// The page scrolls smoothly, so wait for the link to settle in the viewport before clicking it.
		cy.contains('footer a', 'Privacy & cookie policy').scrollIntoView();
		cy.contains('footer a', 'Privacy & cookie policy')
			.should(($link) => {
				expect($link[0].getBoundingClientRect().bottom).to.be.at.most(Cypress.config('viewportHeight'));
			})
			.click({ scrollBehavior: false });

		cy.get('[role="dialog"]').should('be.visible').and('contain.text', 'Privacy & cookie policy');
		cy.location('hash').should('eq', '');
		cy.get('button[aria-label="Close privacy and cookie policy"]').click();
		cy.get('[role="dialog"]').should('not.exist');
	});
});

// Kept apart from the suite above, whose beforeEach loads `/`: from there the `/#privacy` redirect target is a
// fragment-only change, which fires no load event for cy.visit to wait on.
describe('Privacy redirect', () => {
	afterEach(() => {
		cy.a11yCheck();
	});

	it('opens the privacy notice from /privacy', () => {
		cy.visit('http://localhost:3000/privacy');

		cy.get('[role="dialog"]').should('be.visible').and('contain.text', 'Privacy & cookie policy');
		cy.get('button[aria-label="Close privacy and cookie policy"]').click();
		cy.get('[role="dialog"]').should('not.exist');
		cy.location('hash').should('eq', '');
	});

	it('draws no rule under the last row of a policy table, which the section divider already follows', () => {
		cy.visit('http://localhost:3000/privacy');
		// The dialog fades in from its container; the accessibility check after this test measures contrast, so wait
		// until the fade has finished.
		cy.get('[role="dialog"]').parent().should('have.css', 'opacity', '1');

		// jsdom ignores selector specificity when computing styles, so this is checked in a real browser.
		cy.get('[role="dialog"] table').each((table) => {
			cy.wrap(table).find('tbody tr:last-of-type td').first().should('have.css', 'border-bottom-width', '0px');
			cy.wrap(table).find('tbody tr:first-of-type td').first().should('have.css', 'border-bottom-width', '1px');
		});
	});
});
