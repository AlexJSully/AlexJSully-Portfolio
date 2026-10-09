import { act, renderHook } from '@testing-library/react';
import { ACCEPT_ALL, saveConsent } from '@util/consent/consentStore';
import { renderToString } from 'react-dom/server';
import { useConsent } from './useConsent';

/** Prints the hook's value so server rendering can be inspected. */
function ConsentProbe() {
	return <span>{String(useConsent())}</span>;
}

describe('useConsent', () => {
	it('is undefined while rendering on the server', () => {
		expect(renderToString(<ConsentProbe />)).toContain('undefined');
	});

	it('is null in the browser while the visitor has not decided', () => {
		const { result } = renderHook(() => useConsent());

		expect(result.current).toBeNull();
	});

	it('re-renders with the new choices when they are saved', () => {
		const { result } = renderHook(() => useConsent());

		act(() => {
			saveConsent(ACCEPT_ALL);
		});

		expect(result.current).toEqual(ACCEPT_ALL);
	});
});
