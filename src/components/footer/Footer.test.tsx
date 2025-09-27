import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Footer from './Footer';

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

describe('Footer', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<Footer />);
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

		// At least one social analytics event should be logged
		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
	});

	it('has accessible labels for all main actions', () => {
		expect(screen.getByLabelText('Email me')).toBeInTheDocument();
		expect(screen.getByLabelText('Resume')).toBeInTheDocument();
		expect(screen.getByLabelText('GitHub repository')).toBeInTheDocument();
	});
});
