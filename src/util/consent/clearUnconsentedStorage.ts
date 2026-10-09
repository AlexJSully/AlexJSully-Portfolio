import type { ConsentChoices } from '@util/consent/consentStore';

/** IndexedDB databases the Firebase SDKs create in the browser. */
const FIREBASE_DATABASES = ['firebase-installations-database', 'firebase-heartbeat-database'];

/** Prefix of the cookies Google Analytics sets, `_ga` and `_ga_<measurement id>`. */
const ANALYTICS_COOKIE_PREFIX = '_ga';

/**
 * Expires every Google Analytics cookie on this host and on its parent domain, where Analytics writes them by default.
 */
function expireAnalyticsCookies(): void {
	const host = window.location.hostname;
	const domains = ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`];

	for (const pair of document.cookie.split(';')) {
		const name = pair.trim().split('=')[0];
		if (name.startsWith(ANALYTICS_COOKIE_PREFIX)) {
			domains.forEach((domain) => {
				document.cookie = `${name}=; max-age=0; path=/${domain}`;
			});
		}
	}
}

/**
 * Removes whatever the site stored on the device for each optional purpose the visitor has not granted.
 *
 * Runs on every page load as well as when consent changes, because storage can predate the consent banner, and is
 * idempotent: clearing storage that is already gone does nothing. YouTube's storage lives on YouTube's own domains and
 * cannot be cleared from this site.
 * @param choices The visitor's current choices; `null` while undecided, which counts as nothing granted
 * @returns A promise settling once the service worker and cache removals have finished; IndexedDB deletions are
 * started but not awaited, and run again on the next load if they have not completed
 */
export async function clearUnconsentedStorage(choices: Readonly<ConsentChoices> | null): Promise<void> {
	const removals: Promise<unknown>[] = [];

	if (!choices?.analytics) {
		expireAnalyticsCookies();
		if (typeof indexedDB !== 'undefined') {
			FIREBASE_DATABASES.forEach((name) => indexedDB.deleteDatabase(name));
		}
	}

	if (!choices?.offline) {
		if ('serviceWorker' in navigator) {
			removals.push(
				navigator.serviceWorker
					.getRegistrations()
					.then((registrations) =>
						Promise.all(registrations.map((registration) => registration.unregister())),
					),
			);
		}
		if (typeof caches !== 'undefined') {
			removals.push(caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name)))));
		}
	}

	await Promise.allSettled(removals);
}
