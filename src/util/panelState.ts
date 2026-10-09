import { clearLocationHash, useLocationHash } from '@util/locationHash';
import { useSyncExternalStore } from 'react';

/** IDs of the panels opened by a link click rather than by a URL fragment. */
const requested = new Set<string>();

/** Listeners notified when a panel is opened or closed. */
const listeners = new Set<() => void>();

/**
 * Subscribes to panels opening and closing.
 * @param listener Called after each change
 * @returns A function that removes the subscription
 */
function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

/**
 * Opens a panel without changing the URL.
 * @param id The panel's section ID, as in `SECTION_IDS`
 */
export function openPanel(id: string): void {
	requested.add(id);
	listeners.forEach((listener) => listener());
}

/**
 * Closes a panel, removing its URL fragment if a redirect or a shared link opened it that way.
 * @param id The panel's section ID, as in `SECTION_IDS`
 */
export function closePanel(id: string): void {
	requested.delete(id);
	listeners.forEach((listener) => listener());
	if (window.location.hash === `#${id}`) {
		clearLocationHash();
	}
}

/**
 * Reports whether a panel is open: requested by {@link openPanel}, or named by the URL fragment, which is how a redirect
 * such as `/privacy` opens it.
 * @param id The panel's section ID, as in `SECTION_IDS`
 * @returns `true` while the panel is open
 */
export function usePanelOpen(id: string): boolean {
	const hash = useLocationHash();
	const isRequested = useSyncExternalStore(
		subscribe,
		() => requested.has(id),
		() => false,
	);

	return isRequested || hash === `#${id}`;
}
