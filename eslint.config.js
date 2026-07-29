const globals = require('globals');
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
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					modules: true,
					jsx: true,
				},
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
			curly: ['error', 'multi-line'],
			indent: ['error', 'tab'],
			'no-console': 'off',
			'no-continue': 'off',
			'no-html-link-for-pages': 'off',
			'no-param-reassign': 'off',
			'no-restricted-syntax': 'off',
			// The base rule cannot see TypeScript declaration merging (`declare module`,
			// `declare global`) or parameter names inside function types, so it reports
			// live code as unused. The plugin version understands both.
			'no-unused-vars': 'off',
			'padding-line-between-statements': [
				'error',
				{ blankLine: 'always', prev: '*', next: ['return', 'continue', 'throw'] },
				// `break` is excluded above: it cannot be told apart from a `switch` break,
				// and switches take no blank lines.
				{ blankLine: 'any', prev: '*', next: ['case', 'default', 'break'] },
				{ blankLine: 'any', prev: ['case', 'default'], next: '*' },
			],
			radix: 'off',
			semi: ['error', 'always'],
		},
	},
];
