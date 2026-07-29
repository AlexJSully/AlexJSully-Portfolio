'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import { DELAYS, MAX_STARS, THRESHOLDS } from '@constants/index';
import { Box, Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import { ReactElement, useEffect, useRef, useState } from 'react';

/**
 * Renders a fixed starry background whose stars twinkle and occasionally shoot.
 *
 * Returns `null` until the first client render, since star placement depends on `window`.
 */
export default function StarsBackground(): ReactElement | null {
	// The randomness throughout is cosmetic: it keeps the field from looking tiled.

	const [stars, setStars] = useState<ReactElement[] | null>(null);
	const [fade, setFade] = useState(false);
	const [starsTriggered, setStarsTriggered] = useState(false);

	// Held so the pending timeout can be cleared on unmount.
	const forceAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const starStyles = {
		background: `#ffffff50`,
		borderRadius: '50%',
		opacity: 0.5,
		position: 'absolute',
		transition: 'transform 1s',
	};

	const handleStarAnimation = (e: React.MouseEvent<HTMLElement> | { target: HTMLElement }): void => {
		const target = e.target as HTMLElement;
		const shootingStarSpeed = Math.random() * 4 + 1;

		target.style.animation = `shootAway ${shootingStarSpeed}s forwards`;
		target.style.background = '#fff90050';
		target.style.transform = `scale(${Math.random() * 2 + 1})`;

		// Marks the star spent once its animation finishes, so it is not picked again.
		setTimeout(() => {
			if (target) {
				target.setAttribute('data-star-used', 'true');
			}
		}, shootingStarSpeed * 1000);
	};

	const handleForceStarAnimation = () => {
		// Stars that have not been shot yet.
		const allStars = Array.from(document.querySelectorAll('[data-testid="star"]')).filter(
			(star) => star.getAttribute('data-star-used') !== 'true',
		);

		// Needs a pool larger than the threshold to keep picking from without repeating.
		if (!isEmpty(allStars) && allStars.length > THRESHOLDS.MIN_STARS_FOR_ANIMATION) {
			const randomStar = allStars[Math.floor(Math.random() * allStars.length)] as HTMLElement;

			if (randomStar) {
				handleStarAnimation({ target: randomStar });
			}

			const randomTime = Math.random() * 5 + 1.5;

			// Clearing first prevents an orphaned timeout leaking on every recursion.
			if (forceAnimationTimeoutRef.current) {
				clearTimeout(forceAnimationTimeoutRef.current);
			}

			forceAnimationTimeoutRef.current = setTimeout(() => {
				handleForceStarAnimation();
			}, randomTime * 1000);
		} else {
			// Regenerates the field once the usable pool is exhausted.
			createStars(false);
		}
	};

	const createStars = (triggerAnimation = true) => {
		setFade(false);

		const starsArray: ReactElement[] = [];

		const screenWidth = typeof window !== 'undefined' && window?.innerWidth ? window?.innerWidth : 400;
		// Capped because star count scales with width, and an unbounded field drops frames.
		const maxStars = Math.min(screenWidth, MAX_STARS);

		const numberOfStars = Math.floor(Math.random() * (maxStars / 2)) + 10;

		for (let i = 0; i < numberOfStars; i += 1) {
			const starSize = `${Math.random() * 5 + 1}px`;

			const style = {
				...starStyles,
				animation: `twinkle ${Math.random() * 5}s ease-in-out infinite`,
				width: starSize,
				height: starSize,
				top: `${Math.random() * 100}vh`,
				left: `${Math.random() * 100}vw`,
			};

			starsArray.push(
				<Box
					key={`star-${i}`}
					component='div'
					data-testid='star'
					onMouseEnter={(e) => {
						if (!starsTriggered) {
							setStarsTriggered(true);
							logAnalyticsEvent('stars-triggered', {
								name: 'stars-triggered',
								type: 'hover',
							});
						}

						handleStarAnimation(e);
					}}
					sx={style}
				/>,
			);
		}

		setStars(starsArray);
		setFade(true);

		if (triggerAnimation) {
			setTimeout(() => {
				handleForceStarAnimation();
			}, DELAYS.STAR_ANIMATION_INITIAL);
		}
	};

	useEffect(() => {
		// window is only available after mount.
		createStars();

		// Cleanup timeout on unmount to prevent memory leaks
		return () => {
			if (forceAnimationTimeoutRef.current) {
				clearTimeout(forceAnimationTimeoutRef.current);
			}
		};
	}, []);

	return (
		stars && (
			<Fade in={fade} timeout={50}>
				<Box
					key='sky'
					aria-label='Starry background'
					component='div'
					id='sky'
					role='img'
					sx={{
						left: 0,
						position: 'fixed',
						top: 0,
						height: '100vh',
						width: '100vw',
						overflow: 'hidden',
					}}
				>
					{stars}
				</Box>
			</Fade>
		)
	);
}
