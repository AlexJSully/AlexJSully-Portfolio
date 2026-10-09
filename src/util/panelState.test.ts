import { act, renderHook } from '@testing-library/react';
import { closePanel, openPanel, usePanelOpen } from './panelState';

describe('panelState', () => {
	afterEach(() => {
		act(() => {
			closePanel('privacy');
		});
		window.history.replaceState(null, '', '/');
	});

	it('starts closed', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));

		expect(result.current).toBe(false);
	});

	it('opens on request without changing the URL', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));

		act(() => {
			openPanel('privacy');
		});

		expect(result.current).toBe(true);
		expect(window.location.hash).toBe('');
	});

	it('opens from a matching URL fragment, as a redirect sets it', () => {
		window.history.replaceState(null, '', '/#privacy');

		const { result } = renderHook(() => usePanelOpen('privacy'));

		expect(result.current).toBe(true);
	});

	it('leaves other panels closed', () => {
		const { result } = renderHook(() => usePanelOpen('cookie-settings'));

		act(() => {
			openPanel('privacy');
		});

		expect(result.current).toBe(false);
	});

	it('closes and removes its fragment from the URL', () => {
		window.history.replaceState(null, '', '/#privacy');
		const { result } = renderHook(() => usePanelOpen('privacy'));

		act(() => {
			closePanel('privacy');
		});

		expect(result.current).toBe(false);
		expect(window.location.hash).toBe('');
	});

	it('closes a panel opened on request', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));

		act(() => {
			openPanel('privacy');
		});
		act(() => {
			closePanel('privacy');
		});

		expect(result.current).toBe(false);
	});

	it("leaves another panel's fragment in the URL when closing", () => {
		window.history.replaceState(null, '', '/#privacy');

		act(() => {
			closePanel('cookie-settings');
		});

		expect(window.location.hash).toBe('#privacy');
	});
});
