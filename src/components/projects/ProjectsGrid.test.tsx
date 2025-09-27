import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsGrid from './ProjectsGrid';

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

describe('ProjectsGrid', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<ProjectsGrid />);
	});

	it('renders the ProjectsGrid title', () => {
		const title = screen.getByRole('heading', { name: /Projects/i });

		expect(title).toBeInTheDocument();
	});

	it('renders at least one project card', () => {
		const projectCards = screen.getAllByTestId(/project-.*-grid/);

		expect(projectCards.length).toBeGreaterThan(0);
	});

	it('logs analytics on project hover and click', () => {
		const projectCards = screen.getAllByTestId(/project-.*-grid/);

		fireEvent.mouseEnter(projectCards[0]);
		fireEvent.mouseLeave(projectCards[0]);

		const projectLinks = screen.getAllByRole('link', { name: /Project:/i });

		fireEvent.click(projectLinks[0]);

		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
	});

	it('toggles view more/less projects', () => {
		const toggleButton = screen.getByRole('button', { name: /view more projects/i });

		expect(toggleButton).toBeInTheDocument();

		fireEvent.click(toggleButton);

		expect(screen.getByRole('button', { name: /show less projects/i })).toBeInTheDocument();
	});

	it('has accessible links and thumbnails for all projects', () => {
		const projectLinks = screen.getAllByRole('link', { name: /Project:/i });

		expect(projectLinks.length).toBeGreaterThan(0);

		const thumbnails = screen.getAllByRole('img', { name: /thumbnail image for/i });

		expect(thumbnails.length).toBeGreaterThan(0);
	});
});
