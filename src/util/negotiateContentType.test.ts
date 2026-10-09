import { type PageRepresentation, negotiateContentType } from './negotiateContentType';

const CHROME_ACCEPT =
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';

describe('negotiateContentType', () => {
	it.each<[string, string | null, PageRepresentation]>([
		['a missing header', null, 'html'],
		['an empty header', '', 'html'],
		['a malformed header', 'nonsense', 'html'],
		['the full wildcard', '*/*', 'html'],
		['a browser header', CHROME_ACCEPT, 'html'],
		['text/html alone', 'text/html', 'html'],
		['text/* alone', 'text/*', 'html'],
		['text/markdown alone', 'text/markdown', 'markdown'],
		['text/markdown with parameters', 'text/markdown; charset=utf-8', 'markdown'],
		['upper-case text/markdown', 'Text/Markdown', 'markdown'],
		['text/markdown preferred by weight', 'text/html;q=0.5, text/markdown', 'markdown'],
		['text/markdown and text/html at equal weight', 'text/markdown, text/html', 'markdown'],
		['text/html listed first at equal weight', 'text/html, text/markdown', 'markdown'],
		['text/markdown preferred over a wildcard fallback', 'text/markdown, */*;q=0.1', 'markdown'],
		['text/html rejected beside a wildcard', 'text/html;q=0, */*', 'markdown'],
		['text/html weighted above text/markdown', 'text/html, text/markdown;q=0.5', 'html'],
		['text/markdown explicitly rejected', 'text/markdown;q=0', 'not-acceptable'],
		['text/markdown rejected beside a wildcard', 'text/markdown;q=0, */*', 'html'],
		['an unrelated type', 'application/pdf', 'not-acceptable'],
		['a JSON-only client', 'application/json', 'not-acceptable'],
		['every type rejected', '*/*;q=0', 'not-acceptable'],
		['an out-of-range weight, which is ignored', 'text/markdown;q=2', 'html'],
	])('negotiates %s', (_label, accept, expected) => {
		expect(negotiateContentType(accept)).toBe(expected);
	});
});
