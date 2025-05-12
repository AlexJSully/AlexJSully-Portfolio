'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import { Box, Fade } from '@mui/material';
import { isEmpty } from 'lodash';
import { ReactElement, useEffect, useState } from 'react';

/** Create a starry background with shooting stars */
export default function StarsBackground(): ReactElement {
	// There is a lot of random math in here
	// but it's all just to make the stars look random

	/** The stars to be rendered */
	const [stars, setStars] = useState<any>(null);
	const [fade, setFade] = useState(false);

	/** Whether or not the stars have been triggered [true] or not [false] */
	const [starsTriggered, setStarsTriggered] = useState(false);

	/** The styles for the stars */
	const starStyles = {
		background: `#ffffff50`,
		borderRadius: '50%',
		opacity: 0.5,
		position: 'absolute',
		transition: 'transform 1s',
	};

	/** Handle the shooting star animation */
	const handleStarAnimation = (e: any) => {
		/** The star DOM element */
		const target = e.target as HTMLElement;
		/** The speed of the shooting star */
		const shootingStarSpeed = Math.random() * 4 + 1;

		// Set the animation
		target.style.animation = `shootAway ${shootingStarSpeed}s forwards`;
		target.style.background = '#fff90050';
		target.style.transform = `scale(${Math.random() * 2 + 1})`;

		// Remove the star after the animation is done
		setTimeout(() => {
			if (target) {
				// Change the data attribute so it indicates that the star has been used
				target.setAttribute('data-star-used', 'true');
			}
		}, shootingStarSpeed * 1000);
	};

	/** Handle the forced shooting star animation */
	const handleForceStarAnimation = () => {
		/** All of the stars */
		const allStars = Array.from(document.querySelectorAll('[data-testid="star"]')).filter(
			(star) => star.getAttribute('data-star-used') !== 'true',
		);

		// Only proceed if there are stars
		if (!isEmpty(allStars) && allStars.length > 15) {
			/** Pick a random star */
			const randomStar = allStars[Math.floor(Math.random() * allStars.length)] as HTMLElement;

			if (randomStar) {
				// Trigger the animation
				handleStarAnimation({ target: randomStar });
			}

			/** The random time to wait before triggering the next star */
			const randomTime = Math.random() * 5 + 1.5;

			// Recursively call this function
			setTimeout(() => {
				handleForceStarAnimation();
			}, randomTime * 1000);
		} else {
			// If there are no stars, create some
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			createStars(false);
		}
	};

	/** Create the stars */
	const createStars = (
		/** Whether or not to forcefully trigger the shooting star animation */
		triggerAnimation = true,
	) => {
		setFade(false);

		/** The array of stars */
		const starsArray: any = [];
		/** The max number of stars to create */
		const maxStars = typeof window !== 'undefined' && window?.innerWidth ? window?.innerWidth : 400;
		/** The number of stars to create */
		const numberOfStars = Math.floor(Math.random() * (maxStars / 2)) + 10;

		// Create the stars based on the number of stars
		for (let i = 0; i < numberOfStars; i += 1) {
			/** The size of the star */
			const starSize = `${Math.random() * 5 + 1}px`;

			/** Each star will have some randomness of it to make it unique */
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
					key={i}
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

		// Start the shooting star animation forcefully
		if (triggerAnimation) {
			setTimeout(() => {
				handleForceStarAnimation();
			}, 1000);
		}
	};

	useEffect(() => {
		// We want to use useEffect here so that we can use the window object
		createStars();

		// eslint-disable-next-line react-hooks/exhaustive-deps
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
