import { absoluteUrl } from './absoluteUrl';

describe('absoluteUrl', () => {
	it.each([
		{ path: '/llms.txt', expected: 'https://alexjsully.me/llms.txt' },
		{ path: '/#privacy', expected: 'https://alexjsully.me/#privacy' },
	])('resolves $path against the production domain', ({ path, expected }) => {
		expect(absoluteUrl(path)).toBe(expected);
	});
});
