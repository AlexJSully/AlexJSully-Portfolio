//@ts-check
const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('next-pwa')({
	dest: 'public',
	buildExcludes: ['app-build-manifest.json'],
});

const moduleExports = withPWA({
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		minimumCacheTTL: 1800,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	swcMinify: true,
	async headers() {
		return [
			{
				source: '/',
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
						value: 'fullscreen=*, picture-in-picture=*, xr-spatial-tracking=*, gamepad=*, hid=*, idle-detection=*, window-placement=*',
					},
				],
			},
		];
	},
});

const sentryWebpackPluginOptions = {
	// Suppresses source map uploading logs during build
	silent: true,
	org: process.env.NEXT_PUBLIC_SENTRY_ORG,
	project: 'personal-portfolio',

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Transpiles SDK to be compatible with IE11 (increases bundle size)
	transpileClientSDK: true,

	// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
	tunnelRoute: '/monitoring',

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors.
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
