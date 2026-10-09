import type { ConsentChoices } from '@util/consent/consentStore';

/** IndexedDB databases the Firebase SDKs create in the browser. */
const FIREBASE_DATABASES = ['firebase-installations-database', 'firebase-heartbeat-database'];

/** `localStorage` keys Firebase Performance Monitoring writes its remote settings to. */
const FIREBASE_LOCAL_STORAGE_KEYS = ['@firebase/performance/config', '@firebase/performance/configexpire'];

/** The cookie Google Analytics sets to distinguish visitors. */
const ANALYTICS_COOKIE = '_ga';

/** Prefix of the per-property session cookies Google Analytics sets, `_ga_<measurement id>`. */
const ANALYTICS_SESSION_COOKIE_PREFIX = '_ga_';

/**
 * Expires every Google Analytics cookie on this host and on its parent domain, where Analytics writes them by default.
 */
function expireAnalyticsCookies(): void {
	const host = window.location.hostname;
	const domains = ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`];

	for (const pair of document.cookie.split(';')) {
		const name = pair.trim().split('=')[0];
		// Exact names, so an unrelated cookie such as `_garden` is left alone.
		if (name === ANALYTICS_COOKIE || name.startsWith(ANALYTICS_SESSION_COOKIE_PREFIX)) {
			domains.forEach((domain) => {
				document.cookie = `${name}=; max-age=0; path=/${domain}`;
			});
		}
	}
}

/** Removes the Firebase Performance Monitoring settings from `localStorage`. */
function removeFirebaseLocalStorage(): void {
	try {
		FIREBASE_LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
	} catch {
		// Reading `localStorage` throws where the browser blocks site storage, and then there is nothing to remove.
	}
}

/**
 * Removes whatever the site stored on the device for each optional purpose the visitor has not granted.
 *
 * Runs on every page load as well as when consent changes, because storage can predate the consent banner, and is
 * idempotent: clearing storage that is already gone does nothing. YouTube's storage lives on YouTube's own domains and
 * cannot be cleared from this site.
 * @param choices The visitor's current choices; `null` while undecided, which counts as nothing granted
 * @param signal Aborted once these choices are out of date, so no removal still pending deletes storage a newer
 * choice allows
 * @returns A promise settling once the service worker and cache removals have finished; IndexedDB deletions are
 * started but not awaited, and run again on the next load if they have not completed
 */
export async function clearUnconsentedStorage(
	choices: Readonly<ConsentChoices> | null,
	signal?: AbortSignal,
): Promise<void> {
	if (signal?.aborted) {
		return;
	}

	const removals: Promise<unknown>[] = [];

	if (!choices?.analytics) {
		expireAnalyticsCookies();
		removeFirebaseLocalStorage();
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
						signal?.aborted
							? []
							: Promise.all(registrations.map((registration) => registration.unregister())),
					),
			);
		}
		if (typeof caches !== 'undefined') {
			removals.push(
				caches
					.keys()
					.then((names) => (signal?.aborted ? [] : Promise.all(names.map((name) => caches.delete(name))))),
			);
		}
	}

	await Promise.allSettled(removals);
}
