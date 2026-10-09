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
	it.each(Object.entries(REDIRECTS))('redirects %s to %s on the same host', (source, destination) => {
		const response = proxy(request(source, { headers: { accept: 'text/markdown' } }));

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe(`https://alexjsully.me${destination}`);
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

	it.each(Object.entries(REWRITES))('serves %s as %s, whatever the Accept header', (source, destination) => {
		const response = proxy(request(source, { headers: { accept: 'text/markdown' } }));

		expect(response.headers.get('x-middleware-rewrite')).toBe(`https://alexjsully.me${destination}`);
	});

	it('rewrites a Markdown request for the home page to /index.md', () => {
		const response = proxy(request('/', { headers: { accept: 'text/markdown' } }));

		expect(response.headers.get('x-middleware-rewrite')).toBe('https://alexjsully.me/index.md');
		expect(response.headers.get('vary')).toBe('Accept');
	});

	it.each(['GET', 'HEAD'])('negotiates %s requests', (method) => {
		const response = proxy(request('/', { method, headers: { accept: 'text/markdown' } }));

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

	it.each<[string, Parameters<typeof request>[1] & object, string]>([
		['an RSC navigation', { headers: { accept: 'text/markdown', rsc: '1' } }, '/'],
		['a router prefetch', { headers: { accept: 'text/markdown', 'next-router-prefetch': '1' } }, '/'],
		['a router state request', { headers: { accept: 'text/markdown', 'next-router-state-tree': '[]' } }, '/'],
		['an _rsc query', { headers: { accept: 'text/markdown' } }, '/?_rsc=abc'],
		['a POST', { method: 'POST', headers: { accept: 'application/pdf' } }, '/'],
	])('leaves %s untouched', (_label, init, path) => {
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
