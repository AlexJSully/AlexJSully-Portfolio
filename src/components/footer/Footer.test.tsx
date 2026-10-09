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

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-email', expect.any(Object));
	});

	it('logs analytics when resume button is clicked', () => {
		fireEvent.click(screen.getByLabelText('Resume'));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-resume', expect.any(Object));
	});

	it('logs analytics when GitHub button is clicked', () => {
		fireEvent.click(screen.getByLabelText('GitHub repository button'));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('footer-open-source', expect.any(Object));
	});

	it('renders all social links and logs analytics on click', () => {
		const socialButtons = screen.getAllByRole('button', { name: /link|github/i });
		socialButtons.forEach((btn) => {
			fireEvent.click(btn);
		});

		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
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

	it('has accessible labels for all main actions', () => {
		expect(screen.getByLabelText('Email me')).toBeInTheDocument();
		expect(screen.getByLabelText('Resume')).toBeInTheDocument();
		expect(screen.getByLabelText('GitHub repository')).toBeInTheDocument();
	});
});
