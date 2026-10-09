import { REDIRECTS, REWRITES, ROUTES } from '@constants/routes';
import { markdownResponse } from '@util/markdown/markdownResponse';
import { buildNotFoundMarkdown } from '@util/markdown/notFoundMarkdown';
import { negotiateContentType } from '@util/negotiateContentType';
import { type NextRequest, NextResponse } from 'next/server';

/** Paths that render an HTML page, and so have a Markdown representation at {@link ROUTES.markdownHome}. */
const PAGE_PATHS = new Set<string>([ROUTES.home]);

/** Request headers the Next.js router sends on client navigations and prefetches, which must reach the app untouched. */
const ROUTER_HEADERS = ['rsc', 'next-router-prefetch', 'next-router-state-tree'];

/**
 * Reports whether a request comes from the Next.js client router rather than from a document load.
 * @param request Incoming request
 * @returns `true` for router navigations and prefetches
 */
function isRouterRequest(request: NextRequest): boolean {
	return ROUTER_HEADERS.some((header) => request.headers.has(header)) || request.nextUrl.searchParams.has('_rsc');
}

/**
 * Routes each page request: the redirect and rewrite tables in `@constants/routes` first, then negotiation between the
 * HTML and Markdown representations from the `Accept` header.
 *
 * Agents that prefer `text/markdown` receive the home page as Markdown, or a Markdown 404 for any other path.
 * Clients that accept neither type receive 406. Every Markdown and 406 response carries `Vary: Accept` so caches
 * keep the representations apart. HTML pass-throughs append it too, but the Next.js app page render calls
 * `setHeader('Vary', ...)`, which replaces it as well as any `Vary` set in `next.config.js`, so the HTML response does
 * not list `Accept`. On Vercel this proxy runs before the edge cache and Markdown is a rewrite to a different path, so
 * that cache never serves one representation for the other.
 * @see https://acceptmarkdown.com/
 * @param request Incoming request
 * @returns A redirect, a rewrite, a direct response, or a pass-through to the app
 */
export function proxy(request: NextRequest): Response {
	const { pathname } = request.nextUrl;

	const redirect = REDIRECTS[pathname];
	if (redirect !== undefined) {
		// Next.js rewrites a same-host Location to a relative one, so the response never echoes the Host header.
		return NextResponse.redirect(new URL(redirect, request.url), 307);
	}

	const rewrite = REWRITES[pathname];
	if (rewrite !== undefined) {
		return NextResponse.rewrite(new URL(rewrite, request.url));
	}

	if ((request.method !== 'GET' && request.method !== 'HEAD') || isRouterRequest(request)) {
		return NextResponse.next();
	}

	const representation = negotiateContentType(request.headers.get('accept'));

	if (representation === 'not-acceptable') {
		return new Response('406 Not Acceptable. Available representations: text/html, text/markdown.\n', {
			status: 406,
			headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept' },
		});
	}

	if (representation === 'markdown') {
		if (PAGE_PATHS.has(pathname)) {
			return NextResponse.rewrite(new URL(ROUTES.markdownHome, request.url), { headers: { Vary: 'Accept' } });
		}

		return markdownResponse(buildNotFoundMarkdown(pathname), 404);
	}

	const response = NextResponse.next();
	response.headers.append('Vary', 'Accept');

	return response;
}

/**
 * Runs the proxy on page paths and on each {@link REWRITES} source, never on build assets, API routes, or other paths
 * with a file extension. Next.js requires a static literal here, so `proxy.test.ts` checks it covers every rewrite.
 */
export const config = {
	matcher: ['/((?!_next/|api/|.*\\..*).*)', '/llm.txt'],
};
