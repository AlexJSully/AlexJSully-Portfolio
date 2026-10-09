/**
 * What the Sentry SDK attaches to an error report, shared by the browser, server, and edge configs: no user fields,
 * cookies, or request bodies, all of which the SDK collects by default.
 */
export const SENTRY_DATA_COLLECTION = { userInfo: false, cookies: false, httpBodies: [] };

/**
 * Default browser integrations left out: performance tracing, which writes to `sessionStorage` and duplicates Firebase
 * Performance and Speed Insights, and session counting. Without them Sentry stores nothing on the visitor's device.
 */
const EXCLUDED_INTEGRATIONS = new Set(['BrowserTracing', 'BrowserSession']);

/** The first {@link startErrorReporting} call's work, shared by every later call. */
let starting: Promise<void> | null = null;

/**
 * Loads the Sentry browser SDK and starts reporting errors, including `console.error` calls, from this page.
 *
 * The SDK is fetched here rather than imported by the module, so a visitor who never allows Analytics never downloads
 * it. Called only once the visitor has allowed Analytics: on load from `src/instrumentation-client.ts` for a choice
 * already stored, and from `src/components/consent/services/ConsentedServices.tsx` for one made during the visit.
 * Safe to call more than once: later calls share the first call's work, and a failed load, such as one a content
 * blocker stops, is retried by the next call.
 * @returns A promise settling once Sentry is running, or once loading has failed
 */
export function startErrorReporting(): Promise<void> {
	starting ??= (async () => {
		const Sentry = await import('@sentry/nextjs');

		Sentry.init({
			dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
			dataCollection: SENTRY_DATA_COLLECTION,
			integrations: (defaults) => [
				...defaults.filter((integration) => !EXCLUDED_INTEGRATIONS.has(integration.name)),
				Sentry.captureConsoleIntegration({ levels: ['error'] }),
			],
		});
	})().catch(() => {
		starting = null;
	});

	return starting;
}

/**
 * Reports an error to Sentry once {@link startErrorReporting} has been called, and does nothing otherwise, so a
 * visitor who has not allowed Analytics sends nothing and downloads nothing.
 * @param error The error to report
 * @returns A promise settling once the report is handed to the SDK, or at once when reporting never started
 */
export async function captureError(error: unknown): Promise<void> {
	if (starting === null) {
		return;
	}

	await starting;
	try {
		const Sentry = await import('@sentry/nextjs');
		Sentry.captureException(error);
	} catch {
		// The SDK failed to load, as when a content blocker stops it, so there is no client to report through.
	}
}
