'use client';

import { useEffect, useRef } from 'react';

/** Maximum number of retry attempts for service worker registration */
const MAX_SW_RETRIES = 3;
/** Delay in milliseconds between retry attempts (linear backoff) */
const INITIAL_RETRY_DELAY = 1000;

export default function ServiceWorkerRegister() {
	/** Ref to track pending retry timeouts for cleanup on unmount */
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		/**
		 * Register the service worker with linear backoff retry logic
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

						// Schedule retry with linear backoff
						retryTimeoutRef.current = setTimeout(() => {
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

		// Cleanup: clear any pending retry timeout on unmount
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

	return null;
}
