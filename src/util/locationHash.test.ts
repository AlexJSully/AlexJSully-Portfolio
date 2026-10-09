import { act, renderHook } from '@testing-library/react';
import { clearLocationHash, useLocationHash } from './locationHash';

describe('locationHash', () => {
	afterEach(() => {
		window.history.replaceState(null, '', '/');
	});

	it('reads the current fragment', () => {
		window.history.replaceState(null, '', '/#privacy');

		const { result } = renderHook(() => useLocationHash());

		expect(result.current).toBe('#privacy');
	});

	it('re-renders when the fragment changes', () => {
		const { result } = renderHook(() => useLocationHash());

		act(() => {
			window.history.replaceState(null, '', '/#contact');
			window.dispatchEvent(new HashChangeEvent('hashchange'));
		});

		expect(result.current).toBe('#contact');
	});

	it('clears the fragment and notifies subscribers', () => {
		window.history.replaceState(null, '', '/?q=1#privacy');
		const { result } = renderHook(() => useLocationHash());

		act(() => {
			clearLocationHash();
		});

		expect(result.current).toBe('');
		expect(window.location.search).toBe('?q=1');
	});
});
