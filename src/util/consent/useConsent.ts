import { type ConsentChoices, readConsent, subscribeConsent } from '@util/consent/consentStore';
import { useSyncExternalStore } from 'react';

/**
 * Snapshot used while rendering on the server and hydrating, where no cookie can be read.
 * @returns Always `undefined`, so nothing consent-dependent is rendered into the HTML
 */
function getServerSnapshot(): undefined {
	return undefined;
}

/**
 * Reads the visitor's consent choices and re-renders when they change.
 * @returns The choices; `null` while the visitor has not decided; `undefined` until the cookie can be read, during
 * server rendering and hydration
 */
export function useConsent(): Readonly<ConsentChoices> | null | undefined {
	return useSyncExternalStore<Readonly<ConsentChoices> | null | undefined>(
		subscribeConsent,
		readConsent,
		getServerSnapshot,
	);
}
