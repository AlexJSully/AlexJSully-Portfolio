//@ts-check
const { withSentryConfig } = require('@sentry/nextjs');

const isDevelopment = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

const withPWA = require('next-pwa')({
	buildExcludes: ['app-build-manifest.json'],
	dest: 'public',
	disable: isDevelopment,
	register: true,
	skipWaiting: true,
});

const nextConfig = withPWA({
	images: {
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
						value: 'fullscreen=*, picture-in-picture=*, xr-spatial-tracking=*, gamepad=*, hid=*, idle-detection=*, window-management=*',
					},
				],
			},
		];
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		return config;
	},
	// ESLint 9 causes issues with NextJS so disable on build
	eslint: {
		// Warning: This allows production builds to successfully complete even if your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
});

const sentryWebpackPluginOptions = {
	// Suppresses source map uploading logs during build
	silent: true,
	org: process.env.NEXT_PUBLIC_SENTRY_ORG,
	project: 'personal-portfolio',

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Enables automatic instrumentation of Vercel Cron Monitors.
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
};

module.exports = isDevelopment ? nextConfig : withSentryConfig(nextConfig, sentryWebpackPluginOptions);
