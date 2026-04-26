const globals = require('globals');

module.exports = [
	{
		ignores: [
			'**/*.min.js',
			'.next/**/*',
			'.vercel/**/*',
			'.vscode/**/*',
			'build/**/*',
			'eslint.config.js',
			'next.config.js',
			'node_modules/**/*',
			'public/sw.*',
			'public/workbox-*.*',
			'public/worker-*.*',
		],
	},
	{
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					modules: true,
					jsx: true,
				},
				project: './tsconfig.json',
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'class-methods-use-this': 'off',
			'consistent-return': 'off',
			indent: ['error', 'tab'],
			'no-console': 'off',
			'no-continue': 'off',
			'no-html-link-for-pages': 'off',
			'no-param-reassign': 'off',
			'no-restricted-syntax': 'off',
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			radix: 'off',
			semi: ['error', 'always'],
		},
	},
];
