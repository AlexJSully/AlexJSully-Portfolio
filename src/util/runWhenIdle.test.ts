import { runWhenIdle } from './runWhenIdle';

describe('runWhenIdle', () => {
	afterEach(() => {
		Reflect.deleteProperty(window, 'requestIdleCallback');
		Reflect.deleteProperty(window, 'cancelIdleCallback');
		jest.useRealTimers();
	});

	it('schedules the callback with requestIdleCallback where the browser has it', () => {
		// requestIdleCallback is a browser API jsdom omits.
		const requestIdleCallback = jest.fn();
		Object.defineProperty(window, 'requestIdleCallback', { configurable: true, value: requestIdleCallback });
		const callback = jest.fn();

		runWhenIdle(callback);

		expect(requestIdleCallback).toHaveBeenCalledWith(callback);
	});

	it('falls back to a timeout where requestIdleCallback is missing', () => {
		jest.useFakeTimers();
		const callback = jest.fn();

		runWhenIdle(callback);
		expect(callback).not.toHaveBeenCalled();
		jest.runAllTimers();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('cancels a pending idle callback', () => {
		// requestIdleCallback and cancelIdleCallback are browser APIs jsdom omits.
		const cancelIdleCallback = jest.fn();
		Object.defineProperty(window, 'requestIdleCallback', { configurable: true, value: jest.fn(() => 7) });
		Object.defineProperty(window, 'cancelIdleCallback', { configurable: true, value: cancelIdleCallback });

		runWhenIdle(jest.fn())();

		expect(cancelIdleCallback).toHaveBeenCalledWith(7);
	});

	it('cancels a pending timeout fallback', () => {
		jest.useFakeTimers();
		const callback = jest.fn();

		runWhenIdle(callback)();
		jest.runAllTimers();

		expect(callback).not.toHaveBeenCalled();
	});
});
