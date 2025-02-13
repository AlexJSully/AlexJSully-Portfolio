describe('Security Tests', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	// This test checks for XSS vulnerability
	it('should not execute malicious scripts', () => {
		// Define a malicious input that attempts to inject a script
		const maliciousInput = {
			regex: /<\/script><script>alert('XSS')<\/script>/,
		};
		// Serialize the malicious input to a JSON string
		const serialized = JSON.stringify(maliciousInput);

		// Access the window object and evaluate the serialized input
		cy.window().then((win) => {
			// Deserialize the JSON string back to an object
			const deserialized = JSON.parse(serialized);
			// Use eval to execute the deserialized object as JavaScript code
			// This simulates the scenario where the deserialized data is executed in the browser
			win.eval(`const input = ${JSON.stringify(deserialized)};`);
		});

		// Listen for any alert dialogs that may be triggered
		cy.on('window:alert', (str) => {
			// Assert that the alert dialog does not contain the XSS payload
			expect(str).not.to.equal('XSS');
		});
	});
});
