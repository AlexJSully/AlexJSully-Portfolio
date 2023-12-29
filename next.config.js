//@ts-check
const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('next-pwa')({
	dest: 'public',
	buildExcludes: ['app-build-manifest.json'],
});

const moduleExports = withPWA({
	basePath: '',
	reactStrictMode: true,
	distDir: 'build',
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
	modularizeImports: {
		'@mui/material': {
			transform: '@mui/material/{{member}}',
		},
		'@mui/icons-material/?(((\\w*)?/?)*)': {
			transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
		},
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
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true, // Suppresses all logs
	options: {
		environment: process.env.NEXT_PUBLIC_SENTRY_ENV,
	},
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
