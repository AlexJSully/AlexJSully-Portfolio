import { ANIMATIONS, DELAYS, THRESHOLDS } from '@constants/index';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Avatar from './Avatar';

// This repository's wrapper around the Firebase SDK, so a sneeze does not send live analytics.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

/** Returns the avatar by its role and accessible name. */
function getAvatar(): HTMLElement {
	return screen.getByRole('img', { name: 'Profile Picture for Alexander Sullivan' });
}

/** Advances the fake clock inside `act`, so the state updates its timers make are flushed. */
function advance(ms: number): void {
	act(() => {
		jest.advanceTimersByTime(ms);
	});
}

/** Hovers the avatar the given number of times, letting the debounce settle after each hover so every one counts. */
function hover(times: number): void {
	for (let i = 0; i < times; i += 1) {
		fireEvent.mouseEnter(getAvatar());
		advance(DELAYS.AVATAR_SNEEZE_DEBOUNCE);
	}
}

describe('Avatar', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
	});

	it('renders the drawn profile picture by default', () => {
		render(<Avatar />);

		// next/image rewrites the src through its loader, so assert on the underlying image path
		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn.webp'));
	});

	it('steps through the sneeze frames and back once hovered enough times', () => {
		render(<Avatar />);

		hover(THRESHOLDS.SNEEZE_TRIGGER_INTERVAL - 1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn.webp'));

		hover(1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_2.webp'));

		advance(ANIMATIONS.SNEEZE_STAGE_1 - 1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_2.webp'));

		advance(1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_3.webp'));

		advance(ANIMATIONS.SNEEZE_STAGE_2 - 1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_3.webp'));

		advance(1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_4.webp'));

		advance(ANIMATIONS.SNEEZE_STAGE_3 - 1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn_4.webp'));

		advance(1);

		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('profile_pic_drawn.webp'));
	});

	it('logs a sneeze to analytics on the hover that triggers it', () => {
		render(<Avatar />);

		hover(THRESHOLDS.SNEEZE_TRIGGER_INTERVAL - 1);

		expect(mockLogAnalyticsEvent).not.toHaveBeenCalled();

		hover(1);

		expect(mockLogAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('trigger_sneeze', {
			name: 'trigger_sneeze',
			type: 'hover',
		});
	});

	it('turns the page into the aaaahhhh easter egg once it has sneezed enough times', () => {
		const sneezeDuration = ANIMATIONS.SNEEZE_STAGE_1 + ANIMATIONS.SNEEZE_STAGE_2 + ANIMATIONS.SNEEZE_STAGE_3;
		render(<Avatar />);

		for (let sneeze = 1; sneeze < THRESHOLDS.AAAAHHHH_TRIGGER_COUNT; sneeze += 1) {
			hover(THRESHOLDS.SNEEZE_TRIGGER_INTERVAL);
			advance(sneezeDuration);
		}

		expect(document.title).not.toBe("Alexander Sullivan's AAAAHHHHH");

		hover(THRESHOLDS.SNEEZE_TRIGGER_INTERVAL);

		expect(document.title).toBe("Alexander Sullivan's AAAAHHHHH");
		expect(getAvatar()).toHaveAttribute('src', expect.stringContaining('aaaahhhh.webp'));
		expect(mockLogAnalyticsEvent).toHaveBeenLastCalledWith('trigger_aaaahhhh', {
			name: 'trigger_aaaahhhh',
			type: 'hover',
		});
	});
});
