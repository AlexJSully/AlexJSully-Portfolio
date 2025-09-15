import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
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

// Mock Next.js Image component to capture the original src prop
jest.mock('next/image', () => {
	const MockImage = React.forwardRef<HTMLImageElement, any>(
		({ src, alt, width, height, style, priority, ...props }, ref) => {
			return React.createElement('img', {
				ref,
				src,
				alt,
				width,
				height,
				style,
				...props,
				'data-testid': props['data-testid'] || 'mock-image',
				'data-original-src': src, // Store original src for testing
				'data-priority': priority ? 'true' : 'false', // Handle priority prop properly
			});
		},
	);
	MockImage.displayName = 'MockNextImage';
	return MockImage;
});

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
		// Test the original src prop value instead of the transformed DOM attribute
		expect(avatar).toHaveAttribute('data-original-src', '/images/drawn/profile_pic_drawn.webp');
		expect(avatar).toHaveAttribute('src', '/images/drawn/profile_pic_drawn.webp');
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
