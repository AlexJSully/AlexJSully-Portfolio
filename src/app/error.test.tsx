import { render, screen } from '@testing-library/react';
import ErrorPage from './error';

describe('Error', () => {
	const segmentError = new Error('route segment failed');
	const blankError = new Error('');
	let consoleError: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		jest.clearAllMocks();

		// The console is the subject's output: it logs the error there.
		const originalError = console.error;
		consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (args[0] !== segmentError && args[0] !== blankError) {
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

	it('links back to the home page', () => {
		render(<ErrorPage error={segmentError} />);

		expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
	});
});
