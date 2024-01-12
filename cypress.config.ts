import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		includeShadowDom: true,
		// Experimental attributes
		experimentalCspAllowList: true,
		experimentalRunAllSpecs: true,
		experimentalStudio: true,
	},
});
