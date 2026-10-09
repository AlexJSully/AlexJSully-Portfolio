import { type PageRepresentation, negotiateContentType } from './negotiateContentType';

const CHROME_ACCEPT =
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';

describe('negotiateContentType', () => {
	it.each<{ label: string; accept: string | null; expected: PageRepresentation }>([
		{ label: 'a missing header', accept: null, expected: 'html' },
		{ label: 'an empty header', accept: '', expected: 'html' },
		{ label: 'a malformed header', accept: 'nonsense', expected: 'html' },
		{ label: 'the full wildcard', accept: '*/*', expected: 'html' },
		{ label: 'a browser header', accept: CHROME_ACCEPT, expected: 'html' },
		{ label: 'text/html alone', accept: 'text/html', expected: 'html' },
		{ label: 'text/* alone', accept: 'text/*', expected: 'html' },
		{ label: 'text/markdown alone', accept: 'text/markdown', expected: 'markdown' },
		{ label: 'text/markdown with parameters', accept: 'text/markdown; charset=utf-8', expected: 'markdown' },
		{ label: 'upper-case text/markdown', accept: 'Text/Markdown', expected: 'markdown' },
		{ label: 'text/markdown preferred by weight', accept: 'text/html;q=0.5, text/markdown', expected: 'markdown' },
		{
			label: 'text/markdown and text/html at equal weight',
			accept: 'text/markdown, text/html',
			expected: 'markdown',
		},
		{ label: 'text/html listed first at equal weight', accept: 'text/html, text/markdown', expected: 'markdown' },
		{
			label: 'text/markdown preferred over a wildcard fallback',
			accept: 'text/markdown, */*;q=0.1',
			expected: 'markdown',
		},
		{ label: 'text/html rejected beside a wildcard', accept: 'text/html;q=0, */*', expected: 'markdown' },
		{ label: 'text/html weighted above text/markdown', accept: 'text/html, text/markdown;q=0.5', expected: 'html' },
		{ label: 'text/markdown explicitly rejected', accept: 'text/markdown;q=0', expected: 'not-acceptable' },
		{ label: 'text/markdown rejected beside a wildcard', accept: 'text/markdown;q=0, */*', expected: 'html' },
		{ label: 'an unrelated type', accept: 'application/pdf', expected: 'not-acceptable' },
		{ label: 'every type rejected', accept: '*/*;q=0', expected: 'not-acceptable' },
		{ label: 'an out-of-range weight, which is ignored', accept: 'text/markdown;q=2', expected: 'html' },
	])('negotiates $label', ({ accept, expected }) => {
		expect(negotiateContentType(accept)).toBe(expected);
	});
});
