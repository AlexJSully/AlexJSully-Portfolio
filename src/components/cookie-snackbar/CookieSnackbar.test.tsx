import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import CookieSnackbar from './CookieSnackbar';

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
});

describe('CookieSnackbar', () => {
	beforeEach(() => {
		// Clear cookies before each test
		document.cookie = '';
	});

	it('should render the snackbar when no cookie consent is set', async () => {
		render(<CookieSnackbar />);

		await waitFor(() => {
			expect(screen.getByText(/This website uses cookies to enhance the user experience/)).toBeInTheDocument();
		});
	});

	it('should not render the snackbar when cookie consent is already set', () => {
		document.cookie = 'cookie-consent=true';

		render(<CookieSnackbar />);

		expect(screen.queryByText(/This website uses cookies to enhance the user experience/)).not.toBeInTheDocument();
	});

	it('should close the snackbar and set cookie when close button is clicked', async () => {
		render(<CookieSnackbar />);

		await waitFor(() => {
			expect(screen.getByText(/This website uses cookies to enhance the user experience/)).toBeInTheDocument();
		});

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(document.cookie).toContain('cookie-consent=true');
	});

	it('should have proper accessibility attributes', async () => {
		render(<CookieSnackbar />);

		await waitFor(() => {
			const closeButton = screen.getByRole('button', { name: /close/i });
			expect(closeButton).toHaveAttribute('aria-label', 'close');
		});
	});

	it('should auto-set cookie after 1 second if not already set', async () => {
		jest.useFakeTimers();
		render(<CookieSnackbar />);
		expect(document.cookie).not.toContain('cookie-consent=true');
		await act(async () => {
			jest.advanceTimersByTime(1000);
		});
		expect(document.cookie).toContain('cookie-consent=true');
		jest.useRealTimers();
	});

	it('should not double-set cookie on repeated mounts', async () => {
		jest.useFakeTimers();
		render(<CookieSnackbar />);
		await act(async () => {
			jest.advanceTimersByTime(1000);
		});
		expect(document.cookie.match(/cookie-consent=true/g)?.length || 0).toBe(1);
		// Unmount and re-mount
		document.cookie = '';
		render(<CookieSnackbar />);
		await act(async () => {
			jest.advanceTimersByTime(1000);
		});
		expect(document.cookie.match(/cookie-consent=true/g)?.length || 0).toBe(1);
		jest.useRealTimers();
	});
});
