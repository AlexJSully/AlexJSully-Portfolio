/** Hosts of every third-party service the consent banner gates, stubbed so tests never send real analytics. */
const TRACKERS =
	/google-analytics\.com|googletagmanager\.com|firebase(installations|logging)?\.googleapis\.com|vercel-scripts\.com|_vercel\/speed-insights|youtube|icons\.duckduckgo\.com/;

describe('Landing Page', () => {
	afterEach(() => {
		cy.a11yCheck();
	});

	it('should render page', () => {
		cy.visit('http://localhost:3000');
		cy.get('[data-testid="profile_pic"]').should('exist');
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

	it('asks for consent before storing or sending anything optional', () => {
		cy.intercept(TRACKERS, { statusCode: 204 }).as('tracker');
		cy.visit('http://localhost:3000');

		cy.get('section[aria-label="Your privacy choices"]').should('be.visible');
		cy.getCookies().should((cookies) => {
			expect(cookies.map((cookie) => cookie.name).filter((name) => name.startsWith('_ga'))).to.be.empty;
		});
		cy.window()
			.then((win) => win.navigator.serviceWorker.getRegistrations())
			.should('have.length', 0);
		cy.get('@tracker.all').should('have.length', 0);
	});

	it('remembers "Essential only" and reopens from Cookie settings', () => {
		cy.intercept(TRACKERS, { statusCode: 204 }).as('tracker');
		cy.visit('http://localhost:3000');

		cy.contains('button', 'Essential only').click();
		cy.get('section[aria-label="Your privacy choices"]').should('not.exist');
		cy.getCookie('cookie-consent')
			.its('value')
			.should('match', /^v2\.a0\.m0\.o0\.l0\.t\d+$/);

		cy.reload();
		cy.get('section[aria-label="Your privacy choices"]').should('not.exist');
		cy.get('@tracker.all').should('have.length', 0);

		// Stars render only after hydration; clicking earlier lets Cypress's scroll styling trip a hydration warning.
		cy.get('[data-testid="star"]').should('exist');
		// The page scrolls smoothly, so wait for the link to settle in the viewport before clicking it.
		cy.contains('footer a', 'Cookie settings').scrollIntoView();
		cy.contains('footer a', 'Cookie settings')
			.should(($link) => {
				expect($link[0].getBoundingClientRect().bottom).to.be.at.most(Cypress.config('viewportHeight'));
			})
			.click({ scrollBehavior: false });
		cy.get('section[aria-label="Your privacy choices"]').should('be.visible');
		cy.location('hash').should('eq', '');
		cy.get('[role="switch"][aria-labelledby$="analytics-label"]').should('not.be.checked');
	});

	it('starts analytics only after "Accept all", with no advertising cookies', () => {
		// The stub answers with an empty 204, which Firebase Installations reads as JSON because the response is OK.
		// Only that parse failure, caused by the stub rather than the site, is ignored; any other error still fails.
		cy.on('uncaught:exception', (error) => !error.message.includes('Unexpected end of JSON input'));
		cy.intercept(TRACKERS, { statusCode: 204 }).as('tracker');
		cy.visit('http://localhost:3000');
		cy.get('@tracker.all').should('have.length', 0);

		cy.contains('button', 'Accept all').click();

		cy.getCookie('cookie-consent')
			.its('value')
			.should('match', /^v2\.a1\.m1\.o1\.l1\.t\d+$/);
		cy.wait('@tracker');
		cy.getCookies().should((cookies) => {
			expect(cookies.map((cookie) => cookie.name).filter((name) => name.startsWith('_gcl'))).to.be.empty;
		});
	});
});
