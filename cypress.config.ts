import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		// Include shadow DOM elements in command results
		includeShadowDom: true,
		// Allow certain Content Security Policies
		experimentalCspAllowList: true,
		// Run all specs together
		experimentalRunAllSpecs: true,
		// Enable experimental interactive run events
		experimentalInteractiveRunEvents: true,
		// Enable experimental memory management
		experimentalMemoryManagement: true,
		setupNodeEvents(on) {
			on('task', {
				/**
				 * Prints accessibility violations to the terminal, where a headless run shows them; the browser
				 * console the check runs in is not visible there. Each element gets its own row, because
				 * `console.table` prints only the first three items of a nested array.
				 */
				logA11yViolations(violations: { id: string; impact: string; help: string; targets: string[] }[]) {
					console.table(
						violations.flatMap(({ targets, ...violation }) =>
							targets.map((target) => ({ ...violation, target })),
						),
					);
					return null;
				},
			});
		},
	},
});
