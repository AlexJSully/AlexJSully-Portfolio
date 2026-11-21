//@ts-check
const { withSentryConfig } = require('@sentry/nextjs/config');

const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

const nextConfig = {
	agentRules: false,
	images: {
		// SVGs are handled by @svgr/webpack (see turbopack.rules) and no other
		// image types are statically imported, so disable Next's static image
		// imports. This also removes Next's ambient `*.svg` declaration, which
		// conflicts with the @svgr/webpack-accurate one in types/svg.d.ts.
		disableStaticImages: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'alexjsully.me',
			},
		],
		minimumCacheTTL: 1800,
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload',
					},
					{
						key: 'Referrer-Policy',
						value: 'same-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'fullscreen=*, picture-in-picture=*, xr-spatial-tracking=*, gamepad=*, hid=*, idle-detection=*, window-management=*',
					},
				],
			},
			{
				source: '/sw.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8',
					},
					{
						key: 'Cache-Control',
						value: 'public, max-age=0, must-revalidate',
					},
					{
						key: 'Service-Worker-Allowed',
						value: '/',
					},
				],
			},
		];
	},

	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
};

const sentryWebpackPluginOptions = {
	// Suppresses source map uploading logs during build
	silent: true,
	org: process.env.NEXT_PUBLIC_SENTRY_ORG,
	project: 'personal-portfolio',

	// Tree-shakes Sentry SDK code this site never runs from the webpack and Turbopack bundles. Tracing stays, because
	// the server and edge configs set `tracesSampleRate`.
	bundleSizeOptimizations: {
		// Removes the SDK's own debug logging, which no Sentry.init call turns on.
		excludeDebugStatements: true,
		// Removes Session Replay's iframe recording, shadow DOM recording, and compression worker; no config adds
		// `replayIntegration`.
		excludeReplayIframe: true,
		excludeReplayShadowDom: true,
		excludeReplayWorker: true,
	},

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
};

module.exports = isDevelopment ? nextConfig : withSentryConfig(nextConfig, sentryWebpackPluginOptions);
