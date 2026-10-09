/**
 * Runs a callback once the browser is idle, so work that can wait stays off the critical path. Safari has no
 * `requestIdleCallback`, so it falls back to the next macrotask there.
 * @param callback The work to run
 * @returns A function that cancels the callback if it has not run yet
 */
export function runWhenIdle(callback: () => void): () => void {
	if (typeof window.requestIdleCallback === 'function') {
		const handle = window.requestIdleCallback(callback);
		return () => window.cancelIdleCallback(handle);
	}

	const handle = window.setTimeout(callback, 1);
	return () => window.clearTimeout(handle);
}
