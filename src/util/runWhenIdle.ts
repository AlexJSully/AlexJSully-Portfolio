/**
 * Runs a callback once the browser is idle, so work that can wait stays off the critical path. Safari has no
 * `requestIdleCallback`, so it falls back to the next macrotask there.
 * @param callback The work to run
 */
export function runWhenIdle(callback: () => void): void {
	if (typeof window.requestIdleCallback === 'function') {
		window.requestIdleCallback(callback);
	} else {
		window.setTimeout(callback, 1);
	}
}
