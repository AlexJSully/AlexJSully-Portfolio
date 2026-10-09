/** @jest-environment node */
import { REDIRECTS, REWRITES } from '@constants/routes';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { config, proxy } from './proxy';

/**
 * Builds a request to the production origin.
 * @param path Request path
 * @param init Method and headers
 * @returns The request
 */
function request(path: string, init: { method?: string; headers?: Record<string, string> } = {}): NextRequest {
	return new NextRequest(new URL(path, 'https://alexjsully.me'), init);
}

describe('proxy', () => {
	it.each(Object.entries(REDIRECTS).map(([source, destination]) => ({ source, destination })))(
		'redirects $source to $destination on the same host',
		({ source, destination }) => {
			const response = proxy(request(source, { headers: { accept: 'text/markdown' } }));

			expect(response.status).toBe(307);
			expect(response.headers.get('location')).toBe(`https://alexjsully.me${destination}`);
		},
	);

	it.each([
		{ path: '/about', location: 'https://alexjsully.me/' },
		{ path: '/contact', location: 'https://alexjsully.me/#contact' },
	])('redirects $path to $location', ({ path, location }) => {
		expect(proxy(request(path)).headers.get('location')).toBe(location);
	});

	it.each(['/privacy', '/policy', '/cookie', '/cookies', '/privacy-policy', '/cookie-policy'])(
		'opens the policy dialog from %s',
		(path) => {
			expect(proxy(request(path)).headers.get('location')).toBe('https://alexjsully.me/#privacy');
		},
	);

	it('redirects before negotiating, so even an unacceptable Accept header follows the redirect', () => {
		expect(proxy(request('/about', { headers: { accept: 'application/pdf' } })).status).toBe(307);
	});

	it.each([{ accept: 'text/markdown' }, { accept: 'text/html' }, { accept: 'application/pdf' }])(
		'serves /llm.txt as /llms.txt when Accept is $accept',
		({ accept }) => {
			const response = proxy(request('/llm.txt', { headers: { accept } }));

			expect(response.headers.get('x-middleware-rewrite')).toBe('https://alexjsully.me/llms.txt');
		},
	);

	it('rewrites a Markdown request for the home page to /index.md', () => {
		const response = proxy(request('/', { headers: { accept: 'text/markdown' } }));

		expect(response.headers.get('x-middleware-rewrite')).toBe('https://alexjsully.me/index.md');
		expect(response.headers.get('vary')).toBe('Accept');
	});

	it('negotiates HEAD requests', () => {
		const response = proxy(request('/', { method: 'HEAD', headers: { accept: 'text/markdown' } }));

		expect(response.headers.get('x-middleware-rewrite')).toBe('https://alexjsully.me/index.md');
	});

	it('answers a Markdown request for an unknown path with a Markdown 404', async () => {
		const response = proxy(request('/no-such-page', { headers: { accept: 'text/markdown' } }));

		expect(response.status).toBe(404);
		expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
		expect(response.headers.get('vary')).toBe('Accept');
		expect(await response.text()).toContain('`/no-such-page`');
	});

	it('answers a client accepting neither HTML nor Markdown with 406', () => {
		const response = proxy(request('/', { headers: { accept: 'application/pdf' } }));

		expect(response.status).toBe(406);
		expect(response.headers.get('vary')).toBe('Accept');
	});

	it('passes an HTML request through with Vary: Accept', () => {
		const response = proxy(request('/', { headers: { accept: 'text/html' } }));

		expect(response.headers.get('x-middleware-next')).toBe('1');
		expect(response.headers.get('x-middleware-rewrite')).toBeNull();
		expect(response.headers.get('vary')).toBe('Accept');
	});

	it.each<{ label: string; init: Parameters<typeof request>[1] & object; path: string }>([
		{ label: 'an RSC navigation', init: { headers: { accept: 'text/markdown', rsc: '1' } }, path: '/' },
		{
			label: 'a router prefetch',
			init: { headers: { accept: 'text/markdown', 'next-router-prefetch': '1' } },
			path: '/',
		},
		{
			label: 'a router state request',
			init: { headers: { accept: 'text/markdown', 'next-router-state-tree': '[]' } },
			path: '/',
		},
		{ label: 'an _rsc query', init: { headers: { accept: 'text/markdown' } }, path: '/?_rsc=abc' },
		{ label: 'a POST', init: { method: 'POST', headers: { accept: 'application/pdf' } }, path: '/' },
	])('leaves $label untouched', ({ init, path }) => {
		const response = proxy(request(path, init));

		expect(response.headers.get('x-middleware-next')).toBe('1');
		expect(response.headers.get('vary')).toBeNull();
	});

	describe('matcher', () => {
		/**
		 * Applies the matcher the way Next.js does.
		 * @param path Request path
		 * @returns Whether the proxy runs for that path
		 */
		const matches = (path: string) => unstable_doesMiddlewareMatch({ config, url: `https://alexjsully.me${path}` });

		it.each(['/', '/no-such-page', '/nested/path'])('runs on page path %s', (path) => {
			expect(matches(path)).toBe(true);
		});

		it.each([...Object.keys(REDIRECTS), ...Object.keys(REWRITES)])('runs on table source %s', (path) => {
			expect(matches(path)).toBe(true);
		});

		it.each(['/_next/static/chunk.js', '/api/anything', '/llms.txt', '/index.md', '/sw.js', '/resume/Resume.pdf'])(
			'skips %s',
			(path) => {
				expect(matches(path)).toBe(false);
			},
		);
	});
});
