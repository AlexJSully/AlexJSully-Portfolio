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
		const mockNavigator: MockNavigator = {};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(true);
	});

	it('returns true when navigator.connection is present but undefined', () => {
		const mockNavigator: MockNavigator = { connection: undefined };
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

	it.each(['slow-2g', '2g', '3g'] as const)('should return false for slow network types (%s)', (effectiveType) => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: {
				saveData: false,
				effectiveType,
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
		{ label: 'a low downlink estimate', estimates: { downlink: 1.4, rtt: 50 } },
		{ label: 'a high round-trip estimate', estimates: { downlink: 10, rtt: 150 } },
	])('autoplays on a 4g connection despite $label, which browsers round too coarsely to trust', ({ estimates }) => {
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
