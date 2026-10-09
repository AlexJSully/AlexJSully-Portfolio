import { DELAYS } from '@constants/index';
import { debounceConsoleLogLogo } from '@helpers/ascii';
import { act, render, screen } from '@testing-library/react';
import Home from './page';

/** Whether a console log call is the ASCII logo the home page prints. */
function isLogo([message]: unknown[]): boolean {
	return typeof message === 'string' && message.includes('Welcome to my portfolio!');
}

describe('Home', () => {
	let consoleLog: jest.SpiedFunction<typeof console.log>;

	/** The console log calls carrying the ASCII logo. */
	const logoLogs = (): unknown[][] => consoleLog.mock.calls.filter(isLogo);

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();

		// The console is the subject's output: the home page prints its ASCII logo there.
		const originalLog = console.log;
		consoleLog = jest.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
			if (!isLogo(args)) {
				originalLog(...args);
			}
		});

		render(<Home />);
	});

	afterEach(() => {
		// The debounce is shared across renders, so a call still pending would print during a later test.
		debounceConsoleLogLogo.cancel();
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('renders the landing banner, the projects grid, and the publications list', () => {
		expect(screen.getByRole('heading', { level: 1, name: 'Name' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Featured Projects' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Featured Publications' })).toBeInTheDocument();
	});

	it('logs the ASCII logo once, after the debounce delay', () => {
		act(() => {
			jest.advanceTimersByTime(DELAYS.CONSOLE_LOGO_DEBOUNCE - 1);
		});

		expect(logoLogs()).toHaveLength(0);

		act(() => {
			jest.advanceTimersByTime(1);
		});

		expect(logoLogs()).toHaveLength(1);
	});
});
