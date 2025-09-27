// Move mocks and variable declarations above import
var mockInitializeApp = jest.fn();
var mockGetAnalytics = jest.fn();
var mockLogEvent = jest.fn();
var mockGetPerformance = jest.fn();
jest.mock('firebase/app', () => ({
	initializeApp: mockInitializeApp,
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
