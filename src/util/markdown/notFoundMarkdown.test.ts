import { buildNotFoundMarkdown } from './notFoundMarkdown';

describe('buildNotFoundMarkdown', () => {
	const markdown = buildNotFoundMarkdown('/missing-page');

	it('opens with a top-level heading', () => {
		expect(markdown.startsWith('# Page not found\n')).toBe(true);
	});

	it('names the requested path in an explanation of at least 20 characters', () => {
		const explanation = markdown.split('\n').find((line) => line.includes('`/missing-page`'));

		expect(explanation?.length).toBeGreaterThanOrEqual(20);
	});

	it.each(['https://alexjsully.me/', 'https://alexjsully.me/llms.txt', 'https://alexjsully.me/sitemap.xml'])(
		'links to %s',
		(url) => {
			expect(markdown).toContain(`](${url})`);
		},
	);
});
