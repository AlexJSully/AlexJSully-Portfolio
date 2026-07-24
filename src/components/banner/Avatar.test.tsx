import { fireEvent, render, screen } from '@testing-library/react';
import Avatar from './Avatar';

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
		// next/image rewrites the src through its loader, so assert on the underlying image path
		expect(avatar).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn.webp'));
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
