import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Avatar from './Avatar';

// Mock the firebase analytics
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

// Mock the aaaahhhh helper
jest.mock('@helpers/aaaahhhh', () => ({
	aaaahhhh: jest.fn(),
}));

// Mock lodash debounce
jest.mock('lodash', () => ({
	debounce: jest.fn((fn) => fn),
}));

describe('Avatar', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should render the avatar image with proper attributes', () => {
		render(<Avatar />);

		const avatar = screen.getByTestId('profile_pic');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveAttribute('alt', 'Alexander Sullivan head drawn and stylized');
		expect(avatar).toHaveAttribute('aria-label', 'Profile Picture for Alexander Sullivan');
		// Next.js Image component transforms the src, so we check if it contains the encoded original path
		const src = avatar.getAttribute('src');
		expect(src).toContain('%2Fimages%2Fdrawn%2Fprofile_pic_drawn.webp');
	});

	it('should start sneeze animation on every 5th hover', async () => {
		const { logAnalyticsEvent } = jest.requireMock('@configs/firebase');
		render(<Avatar />);

		const avatar = screen.getByTestId('profile_pic');

		// Hover 4 times - no sneeze
		for (let i = 0; i < 4; i++) {
			fireEvent.mouseEnter(avatar);
		}

		// 5th hover should trigger sneeze
		fireEvent.mouseEnter(avatar);

		act(() => {
			jest.advanceTimersByTime(500);
		});

		act(() => {
			jest.advanceTimersByTime(300);
		});

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(logAnalyticsEvent).toHaveBeenCalledWith('trigger_sneeze', {
			name: 'trigger_sneeze',
			type: 'hover',
		});
	});

	it('should trigger aaaahhhh effect on 6th sneeze', async () => {
		const { logAnalyticsEvent } = jest.requireMock('@configs/firebase');
		const { aaaahhhh } = jest.requireMock('@helpers/aaaahhhh');

		render(<Avatar />);

		const avatar = screen.getByTestId('profile_pic');

		// Trigger sneezes 6 times (5 hovers each = 30 hovers total)
		for (let sneeze = 0; sneeze < 6; sneeze++) {
			for (let hover = 0; hover < 5; hover++) {
				fireEvent.mouseEnter(avatar);
			}

			if (sneeze < 5) {
				act(() => {
					jest.advanceTimersByTime(2000); // Allow sneeze animation to complete
				});
			}
		}

		expect(logAnalyticsEvent).toHaveBeenCalledWith('trigger_aaaahhhh', {
			name: 'trigger_aaaahhhh',
			type: 'hover',
		});
		expect(aaaahhhh).toHaveBeenCalled();
	});

	it('should handle click events', () => {
		render(<Avatar />);

		const avatar = screen.getByTestId('profile_pic');

		expect(() => fireEvent.click(avatar)).not.toThrow();
	});

	it('should have proper styling', () => {
		render(<Avatar />);

		const avatar = screen.getByTestId('profile_pic');

		expect(avatar).toHaveStyle({
			borderRadius: '50%',
		});
	});
});
