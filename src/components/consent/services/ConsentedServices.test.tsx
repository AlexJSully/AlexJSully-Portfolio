import { act, render, screen, waitFor } from '@testing-library/react';
import { ACCEPT_ALL, ESSENTIAL_ONLY, saveConsent } from '@util/consent/consentStore';
import ConsentedServices from './ConsentedServices';

// This repository's wrappers around the Firebase and Sentry SDKs, so rendering does not start live analytics.
jest.mock('@configs/firebase', () => ({ init: jest.fn() }));
jest.mock('@configs/sentry', () => ({ startErrorReporting: jest.fn() }));

// A third-party SDK that reports to Vercel over the network.
jest.mock('@vercel/speed-insights/next', () => ({
	SpeedInsights: () => <div data-testid='speed-insights' />,
}));

// navigator.serviceWorker is a browser API jsdom omits.
const register = jest.fn().mockResolvedValue({ scope: '/' });
const unregister = jest.fn().mockResolvedValue(true);

describe('ConsentedServices', () => {
	const mockInit = jest.requireMock('@configs/firebase').init;
	const mockStartErrorReporting = jest.requireMock('@configs/sentry').startErrorReporting;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'log').mockImplementation(() => {});
		Object.defineProperty(navigator, 'serviceWorker', {
			configurable: true,
			value: { getRegistrations: jest.fn().mockResolvedValue([{ unregister }]), register },
		});
	});

	afterEach(() => {
		Reflect.deleteProperty(navigator, 'serviceWorker');
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('starts nothing for an undecided visitor, and removes a service worker registered earlier', async () => {
		render(<ConsentedServices />);

		await waitFor(() => {
			expect(unregister).toHaveBeenCalled();
		});
		expect(mockInit).not.toHaveBeenCalled();
		expect(mockStartErrorReporting).not.toHaveBeenCalled();
		expect(register).not.toHaveBeenCalled();
		expect(screen.queryByTestId('speed-insights')).not.toBeInTheDocument();
	});

	it('cancels clearing queued for an earlier choice, so it never removes what the visitor has since allowed', async () => {
		jest.useFakeTimers();
		render(<ConsentedServices />);

		// Chosen before the browser runs the clearing queued while the visitor was undecided.
		act(() => {
			saveConsent(ACCEPT_ALL);
		});
		// Runs every idle callback still queued, then lets the service worker and cache promises settle.
		await act(async () => {
			jest.runOnlyPendingTimers();
		});

		expect(register).toHaveBeenCalledWith('/sw.js');
		expect(unregister).not.toHaveBeenCalled();
	});

	it('starts Firebase, Sentry error reporting, and Speed Insights once Analytics is allowed', () => {
		saveConsent({ analytics: true, media: false, offline: false, linkIcons: false });

		render(<ConsentedServices />);

		expect(mockInit).toHaveBeenCalledTimes(1);
		expect(mockStartErrorReporting).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('speed-insights')).toBeInTheDocument();
		expect(register).not.toHaveBeenCalled();
	});

	it('registers the service worker once Offline access is allowed', async () => {
		saveConsent({ analytics: false, media: false, offline: true, linkIcons: false });

		render(<ConsentedServices />);

		await waitFor(() => {
			expect(register).toHaveBeenCalledWith('/sw.js');
		});
		expect(mockInit).not.toHaveBeenCalled();
		expect(mockStartErrorReporting).not.toHaveBeenCalled();
	});

	it('reloads the page when Analytics is withdrawn, since Firebase cannot be stopped', async () => {
		// jsdom reports a reload it cannot perform as a "Not implemented: navigation" error.
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		saveConsent({ analytics: true, media: false, offline: false, linkIcons: false });
		render(<ConsentedServices />);

		act(() => {
			saveConsent(ESSENTIAL_ONLY);
		});

		await waitFor(() => {
			expect(consoleError).toHaveBeenCalledWith(
				expect.objectContaining({ message: expect.stringContaining('navigation') }),
			);
		});
	});

	it('does not reload when only Offline access is withdrawn', async () => {
		const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
		saveConsent({ analytics: false, media: false, offline: true, linkIcons: false });
		render(<ConsentedServices />);

		act(() => {
			saveConsent(ESSENTIAL_ONLY);
		});

		await waitFor(() => {
			expect(unregister).toHaveBeenCalled();
		});
		expect(consoleError).not.toHaveBeenCalled();
	});

	it('unregisters the service worker when Offline access is withdrawn', async () => {
		saveConsent({ analytics: false, media: false, offline: true, linkIcons: false });
		render(<ConsentedServices />);

		act(() => {
			saveConsent(ESSENTIAL_ONLY);
		});

		await waitFor(() => {
			expect(unregister).toHaveBeenCalled();
		});
	});
});
