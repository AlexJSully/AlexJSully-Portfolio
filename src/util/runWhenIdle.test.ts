import { runWhenIdle } from './runWhenIdle';

describe('runWhenIdle', () => {
	afterEach(() => {
		Reflect.deleteProperty(window, 'requestIdleCallback');
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
});
