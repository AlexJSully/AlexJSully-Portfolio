import { fireEvent, render, screen } from '@testing-library/react';
import Publications from './Publications';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('Publications', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<Publications />);
	});

	it('renders the Publications section and featured publications', () => {
		expect(screen.getByLabelText('Publications')).toBeInTheDocument();
		expect(screen.getByText('Featured Publications')).toBeInTheDocument();

		const publicationTitles = screen.getAllByRole('heading', { level: 2 });
		expect(publicationTitles.length).toBeGreaterThan(0);
	});

	it('logs analytics when a publication link is clicked', () => {
		const links = screen.getAllByRole('link', { name: /view .+ on .+/i });

		fireEvent.click(links[0]);

		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
	});

	it('has accessible links for all publications', () => {
		const links = screen.getAllByRole('link', { name: /view .+ on .+/i });

		expect(links.length).toBeGreaterThan(0);

		links.forEach((link) => {
			expect(link).toHaveAttribute('href');
			expect(link).toHaveAttribute('aria-label');
		});
	});
});
