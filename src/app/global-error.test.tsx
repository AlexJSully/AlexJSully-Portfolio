import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import GlobalError from './global-error';

// This repository's wrapper around the Sentry SDK, so rendering does not send a live error report.
jest.mock('@configs/sentry', () => ({ captureError: jest.fn() }));

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

/** Whether a console error call is React's warning that the rendered `<html>` sits inside the test container. */
function isHtmlNestingWarning([format, element]: unknown[]): boolean {
	return typeof format === 'string' && format.includes('cannot be a child of') && element === '<html>';
}

describe('GlobalError', () => {
	const mockCaptureError = jest.requireMock('@configs/sentry').captureError;
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
	let consoleError: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		jest.clearAllMocks();

		// Rendering a whole document inside the test container makes React warn that <html> cannot sit in a <div>, and
		// jsdom makes `window.location` non-configurable, so its console report is how a reload shows.
		const originalError = console.error;
		consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (!isHtmlNestingWarning(args) && !isReloadReport(args)) {
				originalError(...args);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('hands the error to the consent-gated Sentry wrapper', async () => {
		const error = new Error('root layout failed');

		render(<GlobalError error={error} />);

		await waitFor(() => {
			expect(mockCaptureError).toHaveBeenCalledWith(error);
		});
	});

	it('links back to the home page', () => {
		render(<GlobalError error={new Error('root layout failed')} />);

		expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
	});

	it('reloads the page when Go home is clicked on the home page', () => {
		mockUsePathname.mockReturnValue('/');
		render(<GlobalError error={new Error('root layout failed')} />);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).toHaveBeenCalledWith(reloadReport);
	});

	it('does not reload when Go home is clicked on any other path', () => {
		mockUsePathname.mockReturnValue('/some-path');
		render(<GlobalError error={new Error('root layout failed')} />);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).not.toHaveBeenCalledWith(reloadReport);
	});
});
