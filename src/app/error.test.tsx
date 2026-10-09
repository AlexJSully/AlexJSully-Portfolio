import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import ErrorPage from './error';

jest.mock('next/navigation', () => ({
	...jest.requireActual('next/navigation'),
	usePathname: jest.fn(),
}));

/** The console error jsdom raises for `window.location.reload()`, a navigation it does not implement. */
const reloadReport = expect.objectContaining({ message: expect.stringContaining('Not implemented: navigation') });

/** Whether a console error call is jsdom's report of a reload. */
function isReloadReport([first]: unknown[]): boolean {
	return (
		typeof first === 'object' &&
		first !== null &&
		String(Reflect.get(first, 'message')).includes('Not implemented: navigation')
	);
}

describe('Error', () => {
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
	const segmentError = new Error('route segment failed');
	const blankError = new Error('');
	let consoleError: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		jest.clearAllMocks();

		// The console is the subject's output: it logs the error there, and jsdom makes `window.location`
		// non-configurable, so jsdom's console report is how a reload shows.
		const originalError = console.error;
		consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (args[0] !== segmentError && args[0] !== blankError && !isReloadReport(args)) {
				originalError(...args);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('shows the error message', () => {
		render(<ErrorPage error={segmentError} />);

		expect(screen.getByRole('heading', { level: 2, name: 'Error: route segment failed' })).toBeInTheDocument();
	});

	it('shows "Unknown error." for an error with an empty message', () => {
		render(<ErrorPage error={blankError} />);

		expect(screen.getByRole('heading', { level: 2, name: 'Error: Unknown error.' })).toBeInTheDocument();
	});

	it('logs the error to the console', () => {
		render(<ErrorPage error={segmentError} />);

		expect(consoleError).toHaveBeenCalledWith(segmentError);
	});

	it('reloads the page when Go home is clicked on the home page', () => {
		mockUsePathname.mockReturnValue('/');
		render(<ErrorPage error={segmentError} />);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).toHaveBeenCalledWith(reloadReport);
	});

	it('does not reload when Go home is clicked on any other path', () => {
		mockUsePathname.mockReturnValue('/some-path');
		render(<ErrorPage error={segmentError} />);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).not.toHaveBeenCalledWith(reloadReport);
	});
});
