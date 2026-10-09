import { render, screen, waitFor } from '@testing-library/react';
import GlobalError from './global-error';

// This repository's wrapper around the Sentry SDK, so rendering does not send a live error report.
jest.mock('@configs/sentry', () => ({ captureError: jest.fn() }));

/** Whether a console error call is React's warning that the rendered `<html>` sits inside the test container. */
function isHtmlNestingWarning([format, element]: unknown[]): boolean {
	return typeof format === 'string' && format.includes('cannot be a child of') && element === '<html>';
}

describe('GlobalError', () => {
	const mockCaptureError = jest.requireMock('@configs/sentry').captureError;

	beforeEach(() => {
		jest.clearAllMocks();

		// Rendering a whole document inside the test container makes React warn that <html> cannot sit in a <div>.
		const originalError = console.error;
		jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (!isHtmlNestingWarning(args)) {
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
});
