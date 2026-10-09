'use client';

import ServiceWorkerRegister from '@components/ServiceWorkerRegister';
import { init } from '@configs/firebase';
import { startErrorReporting } from '@configs/sentry';
import { clearUnconsentedStorage } from '@util/consent/clearUnconsentedStorage';
import { useConsent } from '@util/consent/useConsent';
import { runWhenIdle } from '@util/runWhenIdle';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type ReactElement, useEffect, useRef } from 'react';

/**
 * Starts each optional service only once the visitor allows its purpose, and clears what any refused purpose stored.
 *
 * Analytics starts Firebase and Sentry's browser error reporting, and renders Vercel Speed Insights; Offline access
 * registers the service worker. Clearing runs on every load, not only on a change, because storage can predate the
 * consent banner. Firebase cannot be stopped once started, so withdrawing Analytics reloads the page after clearing.
 */
export default function ConsentedServices(): ReactElement | null {
	const consent = useConsent();
	/** Whether Firebase started during this page's lifetime. */
	const analyticsStarted = useRef(false);

	useEffect(() => {
		if (consent === undefined) {
			return;
		}

		if (consent?.analytics) {
			void init();
			void startErrorReporting();
			analyticsStarted.current = true;
		}

		// Clearing can wait for the browser to be idle; it only removes storage for refused purposes, and withdrawing
		// Analytics reloads the page below to stop anything still using it. A newer choice cancels it, so clearing queued
		// for an earlier choice never removes storage the visitor has since allowed.
		const outdated = new AbortController();
		const cancelIdle = runWhenIdle(() => {
			void clearUnconsentedStorage(consent, outdated.signal).then(() => {
				if (!outdated.signal.aborted && analyticsStarted.current && !consent?.analytics) {
					window.location.reload();
				}
			});
		});

		return () => {
			cancelIdle();
			outdated.abort();
		};
	}, [consent]);

	if (!consent) {
		return null;
	}

	return (
		<>
			{consent.analytics ? <SpeedInsights /> : null}
			{consent.offline ? <ServiceWorkerRegister /> : null}
		</>
	);
}
