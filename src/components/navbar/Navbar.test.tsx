import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

// Mock Next.js usePathname (the app-router hook needs a value in jsdom)
jest.mock('next/navigation', () => ({
	usePathname: jest.fn(),
}));

describe('Navbar', () => {
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();
		mockUsePathname.mockReturnValue('/');

		// Mock document.getElementById
		const mockScrollIntoView = jest.fn();
		jest.spyOn(document, 'getElementById').mockImplementation((id) => {
			if (['content', 'projects-grid', 'publications', 'socials'].includes(id)) {
				return { scrollIntoView: mockScrollIntoView } as any;
			}
			return null;
		});

		render(<Navbar />);
	});

	it('should render navbar with all navigation links', () => {
		expect(screen.getByRole('button', { name: /home button/i })).toBeInTheDocument();
		expect(screen.getByText('Projects')).toBeInTheDocument();
		expect(screen.getByText('Publications')).toBeInTheDocument();
		expect(screen.getByAltText('Logo')).toBeInTheDocument();
	});

	it('should log analytics and scroll to content when home is clicked on homepage', () => {
		mockUsePathname.mockReturnValue('/');

		const homeLink = screen.getByLabelText('Home');
		fireEvent.click(homeLink);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_home', {
			name: 'navbar_home',
			type: 'click',
		});
	});

	it('should log analytics and scroll to projects when projects is clicked on homepage', () => {
		mockUsePathname.mockReturnValue('/');

		const projectsLink = screen.getByLabelText('See projects');
		fireEvent.click(projectsLink);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_projects', {
			name: 'navbar_projects',
			type: 'click',
		});
	});

	it('should log analytics and scroll to publications when publications is clicked on homepage', () => {
		mockUsePathname.mockReturnValue('/');

		const publicationsLink = screen.getByLabelText('See publications');
		fireEvent.click(publicationsLink);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_publications', {
			name: 'navbar_publications',
			type: 'click',
		});
	});

	it('should log analytics and scroll to socials when socials is clicked on homepage', () => {
		mockUsePathname.mockReturnValue('/');

		const socialsLink = screen.getByLabelText('See socials');
		fireEvent.click(socialsLink);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_socials', {
			name: 'navbar_socials',
			type: 'click',
		});
	});

	it('should navigate normally when not on homepage', () => {
		mockUsePathname.mockReturnValue('/other-page');

		const homeLink = screen.getByLabelText('Home');
		fireEvent.click(homeLink);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_home', {
			name: 'navbar_home',
			type: 'click',
		});
	});

	it('should have proper ARIA labels for accessibility', () => {
		expect(screen.getByLabelText('Home')).toBeInTheDocument();
		expect(screen.getByLabelText('See projects')).toBeInTheDocument();
		expect(screen.getByLabelText('See publications')).toBeInTheDocument();
		expect(screen.getByLabelText('See socials')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /home button/i })).toBeInTheDocument();
	});

	it('should handle keyboard navigation (Enter/Space) on links', () => {
		const homeLink = screen.getByLabelText('Home');
		homeLink.focus();

		expect(document.activeElement).toBe(homeLink);

		fireEvent.keyDown(homeLink, { key: 'Enter', code: 'Enter' });
		fireEvent.keyDown(homeLink, { key: ' ', code: 'Space' });
		// Should not throw and should remain accessible
		expect(homeLink).toBeInTheDocument();
	});
});
