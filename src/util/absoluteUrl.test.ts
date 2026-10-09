import { absoluteUrl } from './absoluteUrl';

describe('absoluteUrl', () => {
	it.each([
		['/', 'https://alexjsully.me/'],
		['/llms.txt', 'https://alexjsully.me/llms.txt'],
		['/resume/Resume.pdf', 'https://alexjsully.me/resume/Resume.pdf'],
	])('resolves %s against the production domain', (path, expected) => {
		expect(absoluteUrl(path)).toBe(expected);
	});
});
