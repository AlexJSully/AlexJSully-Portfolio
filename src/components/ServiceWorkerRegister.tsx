'use client';

import { useEffect } from 'react';

/** Maximum number of retry attempts for service worker registration */
const MAX_SW_RETRIES = 3;
/** Delay in milliseconds between retry attempts (exponential backoff) */
const INITIAL_RETRY_DELAY = 1000;

export default function ServiceWorkerRegister() {
	useEffect(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		/**
		 * Register the service worker with exponential backoff retry logic
		 * @param retriesLeft Number of retry attempts remaining
		 */
		const registerWithRetry = (retriesLeft: number = MAX_SW_RETRIES): void => {
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('Service Worker registered with scope:', registration.scope);
				})
				.catch((error) => {
					if (retriesLeft > 0) {
						const delayMs = INITIAL_RETRY_DELAY * (MAX_SW_RETRIES - retriesLeft + 1);
						console.warn(
							`Service Worker registration failed, retrying in ${delayMs}ms (${retriesLeft} attempts remaining):`,
							error,
						);

						// Schedule retry with exponential backoff
						setTimeout(() => {
							registerWithRetry(retriesLeft - 1);
						}, delayMs);
					} else {
						// Final failure after all retries
						console.error('Service Worker registration failed after all retries:', error);
					}
				});
		};

		// Attempt registration
		registerWithRetry();
	}, []);

	return null;
}
