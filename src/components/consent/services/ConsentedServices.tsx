'use client';

import ServiceWorkerRegister from '@components/ServiceWorkerRegister';
import { init } from '@configs/firebase';
import { clearUnconsentedStorage } from '@util/consent/clearUnconsentedStorage';
import { useConsent } from '@util/consent/useConsent';
import { runWhenIdle } from '@util/runWhenIdle';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type ReactElement, useEffect, useRef } from 'react';

/**
 * Starts each optional service only once the visitor allows its purpose, and clears what any refused purpose stored.
 *
 * Analytics starts Firebase and renders Vercel Speed Insights; Offline access registers the service worker. Clearing
 * runs on every load, not only on a change, because storage can predate the consent banner. Firebase cannot be stopped
 * once started, so withdrawing Analytics reloads the page after clearing.
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
			analyticsStarted.current = true;
		}

		// Clearing can wait for the browser to be idle; it only removes storage nothing is using.
		runWhenIdle(() => {
			void clearUnconsentedStorage(consent).then(() => {
				if (analyticsStarted.current && !consent?.analytics) {
					window.location.reload();
				}
			});
		});
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
