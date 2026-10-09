const mockInitializeApp = jest.fn();
const mockGetApps = jest.fn();
const mockGetApp = jest.fn();
const mockInitializeAnalytics = jest.fn();
const mockSetConsent = jest.fn();
const mockLogEvent = jest.fn();
const mockGetPerformance = jest.fn();

// The Firebase SDKs reach the network; this wrapper sits directly on them.
jest.mock('firebase/app', () => ({
	getApp: mockGetApp,
	getApps: mockGetApps,
	initializeApp: mockInitializeApp,
}));
jest.mock('firebase/analytics', () => ({
	initializeAnalytics: mockInitializeAnalytics,
	logEvent: mockLogEvent,
	setConsent: mockSetConsent,
}));
jest.mock('firebase/performance', () => ({
	getPerformance: mockGetPerformance,
}));

/**
 * Loads a fresh copy of the wrapper, so each test starts with Analytics not yet running.
 * @returns The wrapper module
 */
function loadFirebase(): typeof import('./firebase') {
	let firebase = {} as typeof import('./firebase');
	jest.isolateModules(() => {
		firebase = jest.requireActual('./firebase');
	});
	return firebase;
}

describe('firebase config', () => {
	const app = {};

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetApps.mockReturnValue([]);
		mockGetApp.mockReturnValue(app);
		mockInitializeApp.mockReturnValue(app);
		mockInitializeAnalytics.mockReturnValue('analytics');
	});

	it('logs nothing before Analytics has started', () => {
		loadFirebase().logAnalyticsEvent('test_event');

		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('loads the SDK and starts the app, Analytics, and Performance Monitoring', async () => {
		await loadFirebase().init();

		expect(mockInitializeApp).toHaveBeenCalledTimes(1);
		expect(mockInitializeAnalytics).toHaveBeenCalledWith(app, expect.any(Object));
		expect(mockGetPerformance).toHaveBeenCalledWith(app);
	});

	it('denies every advertising signal before Analytics starts', async () => {
		await loadFirebase().init();

		expect(mockSetConsent).toHaveBeenCalledWith({
			analytics_storage: 'granted',
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
		});
		expect(mockSetConsent.mock.invocationCallOrder[0]).toBeLessThan(
			mockInitializeAnalytics.mock.invocationCallOrder[0],
		);
	});

	it('switches off Google signals and ad-personalization signals in the tag config', async () => {
		await loadFirebase().init();

		expect(mockInitializeAnalytics).toHaveBeenCalledWith(app, {
			config: { allow_google_signals: false, allow_ad_personalization_signals: false },
		});
	});

	it('shares one start between repeated calls', async () => {
		const firebase = loadFirebase();

		await Promise.all([firebase.init(), firebase.init()]);

		expect(mockInitializeApp).toHaveBeenCalledTimes(1);
		expect(mockInitializeAnalytics).toHaveBeenCalledTimes(1);
	});

	it('reuses an app that is already initialized', async () => {
		mockGetApps.mockReturnValue([app]);

		await loadFirebase().init();

		expect(mockInitializeApp).not.toHaveBeenCalled();
		expect(mockInitializeAnalytics).toHaveBeenCalledWith(app, expect.any(Object));
	});

	it('logs events once Analytics is running, and ignores an empty name', async () => {
		const firebase = loadFirebase();
		await firebase.init();

		firebase.logAnalyticsEvent('test_event', { foo: 'bar' });
		firebase.logAnalyticsEvent('');

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		expect(mockLogEvent).toHaveBeenCalledWith('analytics', 'test_event', { foo: 'bar' });
	});

	it('retries on the next call after a failed start', async () => {
		mockInitializeAnalytics.mockImplementationOnce(() => {
			throw new Error('blocked');
		});
		const firebase = loadFirebase();

		await firebase.init();
		await firebase.init();

		expect(mockInitializeAnalytics).toHaveBeenCalledTimes(2);
	});
});
