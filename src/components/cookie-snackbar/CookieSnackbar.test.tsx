import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CookieSnackbar from './CookieSnackbar';

Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
});

describe('CookieSnackbar', () => {
	beforeEach(() => {
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

	it('should only set cookie when user explicitly clicks close button', async () => {
		render(<CookieSnackbar />);

		await waitFor(() => {
			expect(screen.getByText(/This website uses cookies to enhance the user experience/)).toBeInTheDocument();
		});

		expect(document.cookie).not.toContain('cookie-consent=true');

		const closeButton = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeButton);

		expect(document.cookie).toContain('cookie-consent=true');
	});
});
