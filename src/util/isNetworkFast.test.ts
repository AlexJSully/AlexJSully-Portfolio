import { isNetworkFast } from './isNetworkFast';

describe('isNetworkFast', () => {
	it('should return true if navigator.connection is not available', () => {
		const originalNavigator = global.navigator;
		// @ts-ignore
		delete global.navigator.connection;
		expect(isNetworkFast()).toBe(true);
		global.navigator = originalNavigator;
	});

	it('should return false if saveData is enabled', () => {
		// @ts-ignore
		global.navigator.connection = { saveData: true };
		expect(isNetworkFast()).toBe(false);
	});

	it('should return false for slow network types', () => {
		// @ts-ignore
		global.navigator.connection = {
			saveData: false,
			effectiveType: '2g',
			downlink: 10,
			rtt: 10,
		};
		expect(isNetworkFast()).toBe(false);
	});

	it('should return false for slow downlink', () => {
		// @ts-ignore
		global.navigator.connection = {
			saveData: false,
			effectiveType: '4g',
			downlink: 1,
			rtt: 10,
		};
		expect(isNetworkFast()).toBe(false);
	});

	it('should return false for high RTT', () => {
		// @ts-ignore
		global.navigator.connection = {
			saveData: false,
			effectiveType: '4g',
			downlink: 10,
			rtt: 200,
		};
		expect(isNetworkFast()).toBe(false);
	});

	it('should return true for fast network', () => {
		// @ts-ignore
		global.navigator.connection = {
			saveData: false,
			effectiveType: '4g',
			downlink: 10,
			rtt: 10,
		};
		expect(isNetworkFast()).toBe(true);
	});
});
