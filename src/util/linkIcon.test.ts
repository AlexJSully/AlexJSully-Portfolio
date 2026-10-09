import { glyphDataUri, hueFor, linkIconFor, normaliseHostname, rememberIconMiss, resetIconMisses } from './linkIcon';

const ORIGIN = 'https://alexjsully.me';

describe('linkIcon', () => {
	afterEach(() => {
		resetIconMisses();
	});

	it.each(['/#privacy', 'https://alexjsully.me/', '/resume/Resume.pdf'])('marks %s as this site', (href) => {
		expect(linkIconFor(href, ORIGIN, true)).toEqual({ kind: 'site' });
	});

	it('draws the generated globe for another site until Link icons is allowed', () => {
		expect(linkIconFor('https://www.github.com/AlexJSully', ORIGIN, false)).toEqual({
			kind: 'glyph',
			hue: 41,
		});
	});

	it('fetches the real icon through the DuckDuckGo proxy once Link icons is allowed', () => {
		expect(linkIconFor('https://www.github.com/AlexJSully', ORIGIN, true)).toEqual({
			kind: 'remote',
			hostname: 'github.com',
			src: 'https://icons.duckduckgo.com/ip3/github.com.ico',
		});
	});

	it('falls back to the globe for a hostname the proxy already failed to serve', () => {
		rememberIconMiss('www.example.org');

		expect(linkIconFor('https://example.org/page', ORIGIN, true)?.kind).toBe('glyph');
	});

	it.each(['mailto:someone@example.org', 'tel:+15550100'])('gives %s no mark, since it is not a web page', (href) => {
		expect(linkIconFor(href, ORIGIN, true)).toBeNull();
	});

	it('draws the globe for a malformed href rather than throwing', () => {
		expect(linkIconFor('http://[', ORIGIN, true)).toEqual({ kind: 'glyph', hue: 61 });
	});

	it('normalises the hostname by case and a leading www', () => {
		expect(normaliseHostname('WWW.Example.ORG')).toBe('example.org');
	});

	it.each([
		{ label: 'a hostname', hostname: 'doi.org', hue: 175 },
		{ label: 'its anagram, distinctly', hostname: 'oid.org', hue: 315 },
		{ label: 'a hostname whose hash goes negative', hostname: 'linkedin.com', hue: 344 },
		{ label: 'an empty hostname', hostname: '', hue: 61 },
	])('gives $label a stable hue of $hue', ({ hostname, hue }) => {
		expect(hueFor(hostname)).toBe(hue);
	});

	it('encodes the globe as an SVG data URI tinted by the hue', () => {
		const uri = glyphDataUri(120);

		expect(uri.startsWith('data:image/svg+xml,')).toBe(true);
		expect(decodeURIComponent(uri)).toContain('hsl(120 55% 70%)');
	});
});
