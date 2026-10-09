import { DELAYS, MAX_STARS } from '@constants/index';
import { act, fireEvent, render, screen } from '@testing-library/react';
import StarsBackground from './StarsBackground';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('StarsBackground', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
		// Math.random is the non-deterministic input behind every star's count, size, and placement.
		jest.spyOn(Math, 'random').mockReturnValue(0.5);
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('logs analytics once on the first star hover, however many stars are hovered', () => {
		const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;
		render(<StarsBackground />);
		const stars = screen.getAllByTestId('star');

		fireEvent.mouseEnter(stars[0]);
		fireEvent.mouseEnter(stars[1]);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('stars-triggered', {
			name: 'stars-triggered',
			type: 'hover',
		});
	});

	it.each([
		{ width: 100, expectedStars: 35 },
		{ width: MAX_STARS + 400, expectedStars: 160 },
	])('renders $expectedStars stars at a window width of $width', ({ width, expectedStars }) => {
		jest.replaceProperty(window, 'innerWidth', width);

		render(<StarsBackground />);

		expect(screen.getAllByTestId('star')).toHaveLength(expectedStars);
	});

	it('renders its stars inside an image named as the starry background', () => {
		render(<StarsBackground />);

		const background = screen.getByRole('img', { name: /starry background/i });

		expect(background).toContainElement(screen.getAllByTestId('star')[0]);
		// imageAAAAHHHH in @helpers/aaaahhhh finds the background by this id.
		expect(background).toHaveAttribute('id', 'sky');
	});

	it('regenerates a fresh field and resumes shooting once every star is spent', () => {
		jest.replaceProperty(window, 'innerWidth', 100);
		render(<StarsBackground />);
		const shooting = (): HTMLElement[] =>
			screen.getAllByTestId('star').filter((star) => star.style.animation.startsWith('shootAway'));

		screen.getAllByTestId('star').forEach((star) => fireEvent.mouseEnter(star));
		// With Math.random at 0.5, each shot lasts 3 s before marking its star spent, and the forced shot first scheduled
		// at 1 s next runs at 5 s, finding every star spent.
		act(() => {
			jest.advanceTimersByTime(5000);
		});

		expect(shooting()).toHaveLength(0);

		act(() => {
			jest.advanceTimersByTime(DELAYS.STAR_ANIMATION_INITIAL);
		});

		expect(shooting()).toHaveLength(1);
	});

	it('leaves no pending timers when unmounted before the initial star animation', () => {
		const { unmount } = render(<StarsBackground />);

		unmount();

		expect(jest.getTimerCount()).toBe(0);
	});
});
