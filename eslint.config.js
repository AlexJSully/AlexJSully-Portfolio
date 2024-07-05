const eslintPluginPrettier = require('eslint-plugin-prettier');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

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
			parser: tsParser,
		},
		plugins: {
			'@typescript-eslint': ts,
			import: importPlugin,
			prettier: eslintPluginPrettier,
			react,
			'react-hooks': reactHooks,
		},
		rules: {
			'@typescript-eslint/dot-notation': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-shadow': 'off',
			'@typescript-eslint/no-unused-vars': ['error'],
			'class-methods-use-this': 'off',
			'consistent-return': 'off',
			'import/default': 2,
			'import/export': 2,
			'import/named': 2,
			'import/namespace': 2,
			'import/no-cycle': 'off',
			'import/no-unresolved': [2, { commonjs: true, amd: true }],
			'import/order': 'off',
			'import/prefer-default-export': 'off',
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
