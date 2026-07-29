describe('General Security Tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	afterEach(() => {
		cy.a11yCheck();
	});

	it('should not execute malicious scripts', () => {
		const maliciousInput = {
			regex: /<\/script><script>alert('XSS')<\/script>/,
		};
		const serialized = JSON.stringify(maliciousInput);

		// Access the window object and evaluate the serialized input
		cy.window().then((win) => {
			const deserialized = JSON.parse(serialized);
			// Use eval to execute the deserialized object as JavaScript code
			// This simulates the scenario where the deserialized data is executed in the browser
			win.eval(`const input = ${JSON.stringify(deserialized)};`);
		});

		cy.on('window:alert', (str) => {
			expect(str).not.to.equal('XSS');
		});
	});
});
