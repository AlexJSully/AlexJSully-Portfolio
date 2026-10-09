import { DELAYS } from '@constants/index';
import { consoleLogLogo, debounceConsoleLogLogo } from './ascii';

/**
 * Records `console.log`, silencing the logo and passing every other message through to the real console.
 * @returns The spy
 */
function spyOnLogoLog(): jest.SpyInstance {
	const log = console.log;

	return jest.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
		if (typeof args[0] === 'string' && args[0].includes('Welcome to my portfolio!')) {
			return;
		}

		log(...args);
	});
}

describe('ascii', () => {
	describe('debounceConsoleLogLogo', () => {
		let originalConsoleLog: jest.SpyInstance;

		beforeEach(() => {
			jest.useFakeTimers();
			// The console is the subject's only output, so the test reads the logo there.
			originalConsoleLog = spyOnLogoLog();
		});

		afterEach(() => {
			debounceConsoleLogLogo.cancel();
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
			originalConsoleLog.mockRestore();
		});

		it('logs once, a full delay after the last of several rapid calls', () => {
			for (let i = 0; i < 10; i++) {
				debounceConsoleLogLogo();
			}

			jest.advanceTimersByTime(DELAYS.CONSOLE_LOGO_DEBOUNCE - 1);
			expect(console.log).not.toHaveBeenCalled();

			jest.advanceTimersByTime(1);
			expect(console.log).toHaveBeenCalledTimes(1);
		});

		it('restarts the wait when called again inside the window', () => {
			const halfWindow = DELAYS.CONSOLE_LOGO_DEBOUNCE / 2;

			debounceConsoleLogLogo();
			jest.advanceTimersByTime(halfWindow);
			debounceConsoleLogLogo();

			jest.advanceTimersByTime(halfWindow);
			expect(console.log).not.toHaveBeenCalled();

			jest.advanceTimersByTime(halfWindow);
			expect(console.log).toHaveBeenCalledTimes(1);
		});

		it('should log again if called after debounce period', () => {
			debounceConsoleLogLogo();
			jest.advanceTimersByTime(1000);
			debounceConsoleLogLogo();
			jest.advanceTimersByTime(1000);
			expect(console.log).toHaveBeenCalledTimes(2);
		});
	});

	describe('consoleLogLogo', () => {
		let originalConsoleLog: jest.SpyInstance;

		beforeEach(() => {
			// The console is the subject's only output, so the test reads the logo there.
			originalConsoleLog = spyOnLogoLog();
		});

		afterEach(() => {
			originalConsoleLog.mockRestore();
		});

		it('should log the ASCII logo to console', () => {
			consoleLogLogo();

			expect(console.log).toHaveBeenCalledTimes(1);
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('#+.'));
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('######'));
		});
	});
});
