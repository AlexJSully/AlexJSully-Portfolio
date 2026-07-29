import * as Sentry from '@sentry/nextjs';

/**
 * Loads the Sentry configuration matching the active Next.js runtime.
 *
 * Next.js calls this once per server process before any request is handled. The two configs
 * are imported dynamically so the Node build never pulls in edge-only code, and vice versa.
 */
export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('../sentry.server.config');
	}
	if (process.env.NEXT_RUNTIME === 'edge') {
		await import('../sentry.edge.config');
	}
}

/** Next.js server error hook; forwards each request error to Sentry. */
export const onRequestError = Sentry.captureRequestError;
