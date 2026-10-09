import { act, render, waitFor } from '@testing-library/react';
import { ACCEPT_ALL, ESSENTIAL_ONLY, saveConsent } from '@util/consent/consentStore';
import ConsentedServices from './ConsentedServices';

// This repository's wrappers around the Firebase and Sentry SDKs, so rendering does not start live analytics.
jest.mock('@configs/firebase', () => ({ init: jest.fn() }));
jest.mock('@configs/sentry', () => ({ startErrorReporting: jest.fn() }));

// A third-party SDK that reports to Vercel over the network; the stand-in renders nothing and records its calls.
jest.mock('@vercel/speed-insights/next', () => ({
	SpeedInsights: jest.fn(() => null),
}));

// navigator.serviceWorker is a browser API jsdom omits.
const register = jest.fn().mockResolvedValue({ scope: '/' });
const unregister = jest.fn().mockResolvedValue(true);

describe('ConsentedServices', () => {
	const mockInit = jest.requireMock('@configs/firebase').init;
	const mockStartErrorReporting = jest.requireMock('@configs/sentry').startErrorReporting;
	const mockSpeedInsights = jest.requireMock('@vercel/speed-insights/next').SpeedInsights;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		// Silences only the registration message ServiceWorkerRegister logs, passing anything else through.
		const log = console.log;
		jest.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
			if (args[0] !== 'Service Worker registered with scope:') {
				log(...args);
			}
		});
		Object.defineProperty(navigator, 'serviceWorker', {
			configurable: true,
			value: { getRegistrations: jest.fn().mockResolvedValue([{ unregister }]), register },
		});
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
		Reflect.deleteProperty(navigator, 'serviceWorker');
		jest.restoreAllMocks();
	});

	it('starts nothing for an undecided visitor, and removes a service worker registered earlier', async () => {
		render(<ConsentedServices />);

		await waitFor(() => {
			expect(unregister).toHaveBeenCalled();
		});
		expect(mockInit).not.toHaveBeenCalled();
		expect(mockStartErrorReporting).not.toHaveBeenCalled();
		expect(register).not.toHaveBeenCalled();
		expect(mockSpeedInsights).not.toHaveBeenCalled();
	});

	it('cancels clearing queued for an earlier choice, so it never removes what the visitor has since allowed', async () => {
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
		expect(mockSpeedInsights).toHaveBeenCalled();
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
		// jsdom reports a reload it cannot perform as a "Not implemented: navigation" error, silenced here alone.
		const error = console.error;
		const consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (!String(args[0]).includes('Not implemented: navigation')) {
				error(...args);
			}
		});
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

	it('unregisters the service worker, without reloading, when only Offline access is withdrawn', async () => {
		const consoleError = jest.spyOn(console, 'error');
		saveConsent({ analytics: false, media: false, offline: true, linkIcons: false });
		render(<ConsentedServices />);

		act(() => {
			saveConsent(ESSENTIAL_ONLY);
		});

		await waitFor(() => {
			expect(unregister).toHaveBeenCalled();
		});
		// Lets the clearing promise settle, which is when a reload would happen.
		await act(async () => {
			await jest.runOnlyPendingTimersAsync();
		});
		expect(consoleError).not.toHaveBeenCalled();
	});
});
