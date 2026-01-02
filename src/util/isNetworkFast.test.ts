import { NETWORK } from '../constants/index';
import { isNetworkFast } from './isNetworkFast';

// Define proper TypeScript interface for navigator.connection
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

	it('should return false for slow downlink', () => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: {
				saveData: false,
				effectiveType: '4g',
				downlink: NETWORK.SLOW_DOWNLINK_THRESHOLD - 0.1,
				rtt: 10,
			},
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(false);
	});

	it('should return false for high RTT', () => {
		const mockNavigator: MockNavigator = {
			...originalNavigator,
			connection: {
				saveData: false,
				effectiveType: '4g',
				downlink: 10,
				rtt: NETWORK.FAST_RTT_THRESHOLD + 50,
			},
		};
		Object.defineProperty(global, 'navigator', {
			value: mockNavigator,
			writable: true,
		});
		expect(isNetworkFast()).toBe(false);
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
