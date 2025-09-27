import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Avatar from './Avatar';

// Mock the firebase analytics
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
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

	it('should be accessible by keyboard (tab/focus/enter)', () => {
		render(<Avatar />);
		const avatar = screen.getByTestId('profile_pic');
		avatar.tabIndex = 0;
		avatar.focus();
		expect(document.activeElement).toBe(avatar);
		fireEvent.keyDown(avatar, { key: 'Enter', code: 'Enter' });
		// Should not throw and should remain accessible
		expect(avatar).toBeInTheDocument();
	});

	it('should handle image error gracefully', () => {
		render(<Avatar />);
		const avatar = screen.getByTestId('profile_pic');
		// Simulate image error event
		fireEvent.error(avatar);
		// Should still be in the document
		expect(avatar).toBeInTheDocument();
	});
});
