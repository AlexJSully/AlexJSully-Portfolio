module.exports = {
	preset: 'ts-jest',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@configs/(.*)$': '<rootDir>/src/configs/$1',
		'^@constants/(.*)$': '<rootDir>/src/constants/$1',
		'^@data/(.*)$': '<rootDir>/src/data/$1',
		'^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
		'^@images/(.*)$': '<rootDir>/src/images/$1',
		'^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
		'^@styles/(.*)$': '<rootDir>/src/styles/$1',
		'^@util/(.*)$': '<rootDir>/src/util/$1',
		'\\.(css|less|scss|sass)$': 'jest-transform-stub',
		'\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/jest/svg-mock.js',
	},
	testEnvironment: 'jsdom',
	verbose: true,
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
	setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
};
