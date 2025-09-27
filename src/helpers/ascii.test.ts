import { consoleLogLogo, debounceConsoleLogLogo } from './ascii';

describe('ascii', () => {
	describe('debounceConsoleLogLogo', () => {
		let originalConsoleLog: jest.SpyInstance;

		beforeEach(() => {
			jest.useFakeTimers();
			originalConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
		});

		afterEach(() => {
			jest.useRealTimers();
			originalConsoleLog.mockRestore();
		});

		it('should debounce consoleLogLogo calls', () => {
			debounceConsoleLogLogo();
			debounceConsoleLogLogo();
			debounceConsoleLogLogo();
			expect(console.log).not.toHaveBeenCalled();
			jest.advanceTimersByTime(1000);
			expect(console.log).toHaveBeenCalledTimes(1);
		});

		it('should only log once for rapid multiple calls', () => {
			for (let i = 0; i < 10; i++) {
				debounceConsoleLogLogo();
			}
			jest.advanceTimersByTime(1000);
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
			originalConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
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
