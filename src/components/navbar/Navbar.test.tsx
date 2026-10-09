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

/** Renders the navbar beside the page sections its links scroll to. */
function renderWithTargets() {
	render(
		<>
			<Navbar />
			<div id='content' />
			<div id='projects-grid' />
			<div id='publications' />
			<div id='socials' />
		</>,
	);
}

describe('Navbar', () => {
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;
	const originalScrollIntoView = Element.prototype.scrollIntoView;
	const scrollIntoView = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		// scrollIntoView is a browser API jsdom omits
		Element.prototype.scrollIntoView = scrollIntoView;
	});

	afterEach(() => {
		Element.prototype.scrollIntoView = originalScrollIntoView;
	});

	it('renders the navigation links with their accessible names', () => {
		mockUsePathname.mockReturnValue('/');
		renderWithTargets();

		expect(screen.getByRole('button', { name: /home button/i })).toBeInTheDocument();
		expect(screen.getByText('Projects')).toBeInTheDocument();
		expect(screen.getByText('Publications')).toBeInTheDocument();
		expect(screen.getByAltText('Logo')).toBeInTheDocument();
	});

	it.each([
		{ label: 'Home', event: 'navbar_home', targetId: 'content' },
		{ label: 'See projects', event: 'navbar_projects', targetId: 'projects-grid' },
		{ label: 'See publications', event: 'navbar_publications', targetId: 'publications' },
		{ label: 'See socials', event: 'navbar_socials', targetId: 'socials' },
	])(
		'logs $event and scrolls to #$targetId when "$label" is clicked on the homepage',
		({ label, event, targetId }) => {
			mockUsePathname.mockReturnValue('/');
			renderWithTargets();

			fireEvent.click(screen.getByRole('link', { name: label }));

			expect(mockLogAnalyticsEvent).toHaveBeenCalledWith(event, { name: event, type: 'click' });
			expect(scrollIntoView).toHaveBeenCalledTimes(1);
			expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
			expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById(targetId));
		},
	);

	it('logs the click without scrolling when not on the homepage', () => {
		mockUsePathname.mockReturnValue('/other-page');
		renderWithTargets();

		fireEvent.click(screen.getByRole('link', { name: 'Home' }));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('navbar_home', {
			name: 'navbar_home',
			type: 'click',
		});
		expect(scrollIntoView).not.toHaveBeenCalled();
	});
});
