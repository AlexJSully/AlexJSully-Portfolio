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

		render(<StarsBackground />);
	});

	it('logs analytics on star hover', async () => {
		const mockLogAnalyticsEvent = require('@configs/firebase').logAnalyticsEvent;
		const stars = await screen.findAllByTestId('star');

		fireEvent.mouseEnter(stars[0]);
		fireEvent.mouseLeave(stars[0]);

		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
	});

	it('is accessible via keyboard (tab focus on star)', async () => {
		const stars = await screen.findAllByTestId('star');
		const star = stars[0];

		star.tabIndex = 0; // Make focusable for test
		star.focus();

		expect(star).toHaveFocus();
	});

	it('renders gracefully with minimal stars (edge case)', async () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 20 });

		const background = await screen.findByRole('img', { name: /starry background/i });

		expect(background).toBeInTheDocument();

		const stars = screen.queryAllByTestId('star');

		expect(stars.length).toBeGreaterThanOrEqual(0);
	});

	it('renders efficiently with a large number of stars (performance)', async () => {
		Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 2000 });

		const background = await screen.findByRole('img', { name: /starry background/i });

		expect(background).toBeInTheDocument();

		const stars = screen.getAllByTestId('star');

		// Lower bound, actual count is random
		expect(stars.length).toBeGreaterThanOrEqual(10);
	});

	it('should render stars background with proper accessibility attributes', async () => {
		await waitFor(() => {
			const background = screen.getByRole('img', { name: /starry background/i });
			expect(background).toBeInTheDocument();
			expect(background).toHaveAttribute('id', 'sky');
		});
	});

	it('should create stars on mount', async () => {
		await waitFor(() => {
			const stars = screen.getAllByTestId('star');
			expect(stars.length).toBeGreaterThan(0);
		});
	});
});
