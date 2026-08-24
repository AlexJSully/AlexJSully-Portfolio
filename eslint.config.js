const tsParser = require('@typescript-eslint/parser');

module.exports = [
	{
		ignores: [
			'**/*.min.js',
			'.claude/**/*',
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
		// One rule set for every file. The TypeScript parser reads plain JavaScript too, so
		// JS and TS are linted identically rather than drifting apart.
		files: ['**/*.js', '**/*.cjs', '**/*.mjs', '**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					modules: true,
					jsx: true,
				},
			},
		},
		rules: {
			curly: ['error', 'multi-line'],
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		},
	},
];
