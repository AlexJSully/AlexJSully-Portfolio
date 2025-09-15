import { consoleLogLogo } from './ascii';

describe('ascii', () => {
	let originalConsoleLog: jest.SpyInstance;

	beforeEach(() => {
		originalConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		originalConsoleLog.mockRestore();
	});

	describe('consoleLogLogo', () => {
		it('should log the ASCII logo to console', () => {
			consoleLogLogo();

			expect(console.log).toHaveBeenCalledTimes(1);
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('#+.'));
			expect(console.log).toHaveBeenCalledWith(expect.stringContaining('######'));
		});
	});
});
