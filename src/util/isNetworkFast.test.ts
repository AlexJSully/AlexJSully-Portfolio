import { isNetworkFast } from './isNetworkFast';

interface MockConnection {
	saveData?: boolean;
	effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
	downlink?: number;
	rtt?: number;
}

interface MockNavigator extends Partial<Navigator> {
	connection?: MockConnection;
}

describe('isNetworkFast', () => {
	let originalNavigator: Navigator;

	beforeEach(() => {
		originalNavigator = global.navigator;
	});

	afterEach(() => {
		global.navigator = originalNavigator;
	});

	it('should return true if navigator.connection is not available', () => {
		const mockNavigator = { ...originalNavigator } as MockNavigator;
		delete mockNavigator.connection;
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(true);
	});

	it('should return false if saveData is enabled', () => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: { saveData: true },
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(false);
	});

	it('should return false for slow network types', () => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: {
				saveData: false,
				effectiveType: '2g',
				downlink: 10,
				rtt: 10,
			},
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(false);
	});

	it.each([
		['a low downlink estimate', { downlink: 1.4, rtt: 50 }],
		['a high round-trip estimate', { downlink: 10, rtt: 150 }],
	])('autoplays on a 4g connection despite %s, which browsers round too coarsely to trust', (_label, estimates) => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: { saveData: false, effectiveType: '4g', ...estimates },
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(true);
	});

	it('should return true for fast network', () => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: {
				saveData: false,
				effectiveType: '4g',
				downlink: 10,
				rtt: 10,
			},
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(true);
	});
});
