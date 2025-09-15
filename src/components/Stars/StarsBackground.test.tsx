import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StarsBackground from './StarsBackground';

// Mock the firebase analytics
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('StarsBackground', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Mock window dimensions
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1024,
		});
	});

	it('should render stars background with proper accessibility attributes', async () => {
		render(<StarsBackground />);

		await waitFor(() => {
			const background = screen.getByRole('img', { name: /starry background/i });
			expect(background).toBeInTheDocument();
			expect(background).toHaveAttribute('id', 'sky');
		});
	});

	it('should create stars on mount', async () => {
		render(<StarsBackground />);

		await waitFor(() => {
			const stars = screen.getAllByTestId('star');
			expect(stars.length).toBeGreaterThan(0);
		});
	});
});
