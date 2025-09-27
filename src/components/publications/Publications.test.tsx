import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Publications from './Publications';

// Mock the firebase analytics
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

// Mock Next.js Link component, filtering out Next.js-specific props like 'prefetch'
jest.mock('next/link', () => {
	return ({ children, href, onClick, prefetch, as, replace, scroll, shallow, passHref, locale, ...props }: any) => {
		// Only pass valid <a> props
		return (
			<a href={href} onClick={onClick} {...props}>
				{children}
			</a>
		);
	};
});

describe('Publications', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<Publications />);
	});

	it('renders the Publications section and featured publications', () => {
		expect(screen.getByLabelText('Publications')).toBeInTheDocument();
		expect(screen.getByText('Featured Publications')).toBeInTheDocument();

		// At least one publication title should be present
		// (Assumes at least one publication in the mock data)
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
