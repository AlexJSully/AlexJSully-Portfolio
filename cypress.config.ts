import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {},
		// Include shadow DOM elements in command results
		includeShadowDom: true,
		// Allow certain Content Security Policies
		experimentalCspAllowList: true,
		// Run all specs together
		experimentalRunAllSpecs: true,
		// Enable experimental Cypress Studio feature
		experimentalStudio: true,
		// Enable experimental interactive run events
		experimentalInteractiveRunEvents: true,
		// Enable experimental memory management
		experimentalMemoryManagement: true,
	},
});
