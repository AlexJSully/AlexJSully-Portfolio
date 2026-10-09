import profile from '@data/profile';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { closePanel, usePanelOpen } from '@util/panelState';
import Footer from './Footer';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('Footer', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<Footer />);
	});

	afterEach(() => {
		act(() => {
			closePanel('privacy');
			closePanel('cookie-settings');
		});
	});

	it('logs analytics when email button is clicked', () => {
		fireEvent.click(screen.getByLabelText('Email me'));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-email', { name: 'footer-email', type: 'click' });
	});

	it('logs analytics when resume button is clicked', () => {
		fireEvent.click(screen.getByLabelText('Resume'));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-resume', { name: 'footer-resume', type: 'click' });
	});

	it('logs analytics when GitHub button is clicked', () => {
		expect(screen.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute(
			'href',
			profile.sourceRepository,
		);

		fireEvent.click(screen.getByLabelText('GitHub repository button'));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-open-source', {
			name: 'footer-open-source',
			type: 'click',
		});
	});

	it.each([
		{ social: 'LinkedIn', event: 'footer-linkedin' },
		{ social: 'GitHub', event: 'footer-github' },
		{ social: 'X', event: 'footer-x' },
		{ social: 'Bluesky', event: 'footer-bluesky' },
		{ social: 'Twitch', event: 'footer-twitch' },
		{ social: 'Masterpiece X', event: 'footer-masterpiece x' },
	])('logs "$event" when the $social social button is clicked', ({ social, event }) => {
		fireEvent.click(screen.getByRole('button', { name: social }));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith(event, { name: event, type: 'click' });
	});

	it('is the #contact target that /contact redirects to', () => {
		expect(screen.getByLabelText('Footer')).toHaveAttribute('id', 'contact');
	});

	it('links the email and resume buttons to the profile', () => {
		expect(screen.getByLabelText('Email me mailto')).toHaveAttribute('href', `mailto:${profile.email}`);
		expect(screen.getByLabelText('Resume download')).toHaveAttribute('href', profile.resumePath);
	});

	it('links to the privacy and cookie policy dialog, opening it without changing the URL', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));
		const link = screen.getByRole('link', { name: 'Privacy & cookie policy' });
		expect(link).toHaveAttribute('href', '/#privacy');

		fireEvent.click(link);

		expect(result.current).toBe(true);
		expect(window.location.hash).toBe('');
	});

	it('reopens the consent settings from "Cookie settings"', () => {
		const { result } = renderHook(() => usePanelOpen('cookie-settings'));
		const link = screen.getByRole('link', { name: 'Cookie settings' });
		expect(link).toHaveAttribute('href', '/#cookie-settings');

		fireEvent.click(link);

		expect(result.current).toBe(true);
	});
});
