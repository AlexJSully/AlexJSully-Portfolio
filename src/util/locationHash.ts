import { useSyncExternalStore } from 'react';

/**
 * Subscribes to fragment changes of the current URL.
 * @param listener Called after each change
 * @returns A function that removes the subscription
 */
function subscribe(listener: () => void): () => void {
	window.addEventListener('hashchange', listener);
	return () => {
		window.removeEventListener('hashchange', listener);
	};
}

/**
 * Reads the fragment of the current URL.
 * @returns The fragment including its `#`, or an empty string
 */
function getSnapshot(): string {
	return window.location.hash;
}

/**
 * Snapshot used while rendering on the server, where the fragment is never sent.
 * @returns Always an empty string
 */
function getServerSnapshot(): string {
	return '';
}

/**
 * Reads the fragment of the current URL and re-renders when it changes, including through a plain `<a href="#id">`.
 * @returns The fragment including its `#`, or an empty string
 */
export function useLocationHash(): string {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Removes the fragment from the current URL without adding a history entry, so Back does not restore it, and notifies
 * {@link useLocationHash} subscribers, which `history.replaceState` alone would not. The entry's state is kept, since
 * the Next.js router stores its own data there.
 */
export function clearLocationHash(): void {
	window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
	window.dispatchEvent(new HashChangeEvent('hashchange'));
}
