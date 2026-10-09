import { act, render } from '@testing-library/react';
import ServiceWorkerRegister from './ServiceWorkerRegister';

// navigator.serviceWorker is a browser API jsdom omits.
const register = jest.fn();

/** The error every failed registration in these tests rejects with. */
const failure = new Error('registration failed');

/** Silences `console[method]` calls whose first argument starts with `prefix`, passing every other call through. */
function silenceConsole(method: 'error' | 'log' | 'warn', prefix: string): jest.SpyInstance {
	const original = console[method];

	return jest.spyOn(console, method).mockImplementation((...args: unknown[]) => {
		if (typeof args[0] === 'string' && args[0].startsWith(prefix)) {
			return;
		}

		original.call(console, ...args);
	});
}

/** Advances the fake clock inside an async `act`, so the registration promises settle before it returns. */
async function advance(ms: number): Promise<void> {
	await act(async () => {
		jest.advanceTimersByTime(ms);
	});
}

describe('ServiceWorkerRegister', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		register.mockResolvedValue({ scope: '/' });
		Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { register } });
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
		Reflect.deleteProperty(navigator, 'serviceWorker');
		jest.restoreAllMocks();
	});

	it("registers '/sw.js' on mount and logs the registration's scope", async () => {
		const log = silenceConsole('log', 'Service Worker registered');

		render(<ServiceWorkerRegister />);
		await advance(0);

		expect(register).toHaveBeenCalledTimes(1);
		expect(register).toHaveBeenCalledWith('/sw.js');
		expect(log).toHaveBeenCalledWith('Service Worker registered with scope:', '/');
	});

	it('retries a failed registration after 1000 ms, then 2000 ms, then 3000 ms', async () => {
		silenceConsole('warn', 'Service Worker registration failed, retrying');
		silenceConsole('error', 'Service Worker registration failed after all retries');
		register.mockRejectedValue(failure);

		render(<ServiceWorkerRegister />);
		await advance(0);

		expect(register).toHaveBeenCalledTimes(1);

		for (const [retry, delayMs] of [1000, 2000, 3000].entries()) {
			await advance(delayMs - 1);

			expect(register).toHaveBeenCalledTimes(retry + 1);

			await advance(1);

			expect(register).toHaveBeenCalledTimes(retry + 2);
		}
	});

	it('logs an error once every retry has failed', async () => {
		silenceConsole('warn', 'Service Worker registration failed, retrying');
		const error = silenceConsole('error', 'Service Worker registration failed after all retries');
		register.mockRejectedValue(failure);

		render(<ServiceWorkerRegister />);
		await advance(0);
		await advance(1000);
		await advance(2000);

		expect(error).not.toHaveBeenCalled();

		await advance(3000);

		expect(error).toHaveBeenCalledTimes(1);
		expect(error).toHaveBeenCalledWith('Service Worker registration failed after all retries:', failure);
	});

	it('clears a pending retry when unmounted', async () => {
		silenceConsole('warn', 'Service Worker registration failed, retrying');
		register.mockRejectedValue(failure);

		const { unmount } = render(<ServiceWorkerRegister />);
		await advance(0);
		unmount();
		await advance(1000);

		expect(register).toHaveBeenCalledTimes(1);
	});

	it('does not retry a registration that fails after unmounting', async () => {
		const warn = silenceConsole('warn', 'Service Worker registration failed, retrying');
		let rejectRegistration: (_reason: Error) => void = () => {};
		register.mockReturnValue(
			new Promise((_resolve, reject) => {
				rejectRegistration = reject;
			}),
		);

		const { unmount } = render(<ServiceWorkerRegister />);
		unmount();
		rejectRegistration(failure);
		// Settles the rejection first, so a retry it schedules would fall inside the next advance.
		await advance(0);
		await advance(1000);

		expect(register).toHaveBeenCalledTimes(1);
		expect(warn).not.toHaveBeenCalled();
	});

	it('renders nothing and registers nothing where the browser has no service worker support', () => {
		Reflect.deleteProperty(navigator, 'serviceWorker');

		const { container } = render(<ServiceWorkerRegister />);

		expect(container).toBeEmptyDOMElement();
		expect(register).not.toHaveBeenCalled();
	});
});
