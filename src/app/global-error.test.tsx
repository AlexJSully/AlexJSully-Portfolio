import { render, screen, waitFor } from '@testing-library/react';
import GlobalError from './global-error';

// This repository's wrapper around the Sentry SDK, so rendering does not send a live error report.
jest.mock('@configs/sentry', () => ({ captureError: jest.fn() }));

jest.mock('next/navigation', () => ({
	...jest.requireActual('next/navigation'),
	usePathname: jest.fn(() => '/'),
}));

describe('GlobalError', () => {
	const mockCaptureError = jest.requireMock('@configs/sentry').captureError;

	beforeEach(() => {
		jest.clearAllMocks();
		// Rendering a whole document inside the test container makes React warn that <html> cannot sit in a <div>.
		jest.spyOn(console, 'error').mockImplementation(() => {});
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
