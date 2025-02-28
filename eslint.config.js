const eslintPluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

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
		plugins: {
			prettier: eslintPluginPrettier,
			react,
			'react-hooks': reactHooks,
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
			'prettier/prettier': 'warn',
			radix: 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react/forbid-prop-types': 'off',
			'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
			'react/jsx-props-no-spreading': 'off',
			'react/no-unknown-property': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/require-default-props': ['error', { ignoreFunctionalComponents: true }],
			'react/static-property-placement': 'off',
			semi: ['error', 'always'],
		},
	},
];
