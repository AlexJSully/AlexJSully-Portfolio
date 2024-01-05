'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRef, useState } from 'react';

/** The banner at the top of the page */
export default function Banner() {
	/** Material-UI theme */
	const theme = useTheme();
	/** Whether or not the screen is small */
	const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	/** The sneeze images to be rendered */
	const imageList = {
		default: '/images/drawn/profile_pic_drawn.webp',
		sneeze_1: '/images/drawn/profile_pic_drawn_2.webp',
		sneeze_2: '/images/drawn/profile_pic_drawn_3.webp',
		sneeze_3: '/images/drawn/profile_pic_drawn_4.webp',
	};

	/** The image to be rendered */
	const [image, setImage] = useState(imageList['default']);

	/** The number of times the profile pic has been hovered */
	let hoverProfilePic = 0;
	/** Whether or not the profile pic is sneezing */
	const sneezing = useRef(false);

	/** Handle the sneeze animation */
	const handleTriggerSneeze = () => {
		hoverProfilePic += 1;

		if (hoverProfilePic % 5 === 0 && !sneezing.current) {
			// Prevent multiple sneezes at once
			sneezing.current = true;

			setImage(imageList[`sneeze_1`]);

			setTimeout(() => {
				setImage(imageList[`sneeze_2`]);

				setTimeout(() => {
					setImage(imageList[`sneeze_3`]);

					setTimeout(() => {
						setImage(imageList[`default`]);

						sneezing.current = false;
					}, 1000);
				}, 300);
			}, 500);

			logAnalyticsEvent('trigger_sneeze', {
				name: 'trigger_sneeze',
				type: 'hover',
			});
		}
	};

	/** Debounce the sneeze animation */
	const debounceSneeze = debounce(handleTriggerSneeze, 100);

	return (
		<Box
			component='div'
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				minHeight: '60vh',
				justifyContent: 'center',
				margin: '2rem auto 3rem',
				position: 'relative',
				width: 'fit-content',
			}}
		>
			<Image
				alt='Alexander Sullivan head drawn and stylized'
				height={500}
				onClick={debounceSneeze}
				onMouseEnter={debounceSneeze}
				priority
				src={image}
				style={{
					borderRadius: '50%',
					marginTop: '2rem',
					maxHeight: 'min(40vw, 40vh, 300px)',
					maxWidth: 'min(40vw, 40vh, 300px)',
					position: 'relative',
					zIndex: 1,
				}}
				width={500}
			/>

			<Typography
				component='h1'
				sx={{
					fontSize: 'clamp(1.5rem, 2.5rem, 2.5rem)',
					fontWeight: 'bold',
					marginTop: '1rem',
					textAlign: 'center',
					textTransform: 'uppercase',
					zIndex: 1,
				}}
			>
				{`Alexander${!smallScreen ? ' Joo-Hyun ' : ' '}Sullivan`.split('').map((char, index) => (
					<Box
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						component='span'
						sx={{
							cursor: 'default',
							textShadow: '1px 2px 3px #666',
							transition: 'all 1s ease',
							'&:hover': {
								color: 'rgb(43, 255, 0)',
								transition: 'all 0.5s ease',
							},
						}}
					>
						{char}
					</Box>
				))}
			</Typography>

			<Typography
				sx={{
					fontSize: 'clamp(1.5rem, 2rem, 3rem)',
					marginTop: '1.5rem',
					textAlign: 'center',
					textShadow: '1px 2px 3px #000',
				}}
			>
				Full Stack Developer & Bioinformatician
			</Typography>
		</Box>
	);
}
