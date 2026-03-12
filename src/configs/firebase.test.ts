// Move mocks and variable declarations above import
const mockInitializeApp = jest.fn();
const mockGetAnalytics = jest.fn();
const mockLogEvent = jest.fn();
const mockGetPerformance = jest.fn();
const mockGetApps = jest.fn();
const mockGetApp = jest.fn();
jest.mock('firebase/app', () => ({
	initializeApp: mockInitializeApp,
	getApps: mockGetApps,
	getApp: mockGetApp,
}));
jest.mock('firebase/analytics', () => ({
	getAnalytics: mockGetAnalytics,
	logEvent: mockLogEvent,
}));
jest.mock('firebase/performance', () => ({
	getPerformance: mockGetPerformance,
}));

const { init, logAnalyticsEvent, __resetAnalyticsForTest } = require('../configs/firebase');

describe('firebase config', () => {
	const mockApp = {};
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetApps.mockReturnValue([]); // Return empty array by default (not initialized)
		mockGetApp.mockReturnValue(mockApp);
		mockInitializeApp.mockReturnValue(mockApp);
		mockGetAnalytics.mockReturnValue('analytics');
		mockGetPerformance.mockReturnValue('perf');
	});

	// Must be the first test to ensure clean state
	it('logAnalyticsEvent does nothing if analytics is not initialized', () => {
		mockLogEvent.mockClear();
		logAnalyticsEvent('test_event');
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('init initializes firebase, analytics, and performance', () => {
		init();
		expect(mockGetApps).toHaveBeenCalled();
		expect(mockInitializeApp).toHaveBeenCalled();
		expect(mockGetAnalytics).toHaveBeenCalledWith(mockApp);
		expect(mockGetPerformance).toHaveBeenCalledWith(mockApp);
	});

	it('logAnalyticsEvent logs event if analytics is initialized', () => {
		// First, initialize
		init();
		mockLogEvent.mockClear();
		logAnalyticsEvent('test_event', { foo: 'bar' });
		expect(mockLogEvent).toHaveBeenCalledWith('analytics', 'test_event', { foo: 'bar' });
	});

	it('logAnalyticsEvent does not log if eventName is falsy', () => {
		init();
		mockLogEvent.mockClear();
		logAnalyticsEvent(undefined);
		expect(mockLogEvent).not.toHaveBeenCalled();
	});
});
