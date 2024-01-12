import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		// Include shadow DOM elements in command results
		includeShadowDom: true,
		// Allow certain Content Security Policies
		experimentalCspAllowList: true,
		// Run all specs together
		experimentalRunAllSpecs: true,
		// Enable experimental Cypress Studio feature
		experimentalStudio: true,
	},
});
