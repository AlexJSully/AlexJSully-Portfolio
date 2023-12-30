'use client';

import StarsBackground from '@components/banner/StarsBackground';
import { Box, Typography } from '@mui/material';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRef, useState } from 'react';

/** The banner at the top of the page */
export default function Banner() {
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
					}, 400);
				}, 300);
			}, 500);
		}
	};

	/** Debounce the sneeze animation */
	const debounceSneeze = debounce(handleTriggerSneeze, 100);

	return (
		<Box
			sx={{
				height: '95vh',
				width: '100%',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				position: 'relative',
			}}
		>
			<StarsBackground />

			<Image
				alt='Alexander Sullivan head drawn and stylized'
				height={500}
				onClick={debounceSneeze}
				onMouseEnter={debounceSneeze}
				priority
				src={image}
				style={{
					borderRadius: '50%',
					maxWidth: 'max(20vw, 20vh)',
					maxHeight: 'max(20vw, 20vh)',
					position: 'relative',
					zIndex: 1,
				}}
				width={500}
			/>

			<Typography
				component='h1'
				sx={{
					fontSize: 'clamp(1.5rem, 3vw, 3rem)',
					fontWeight: 'bold',
					marginTop: '1rem',
					textAlign: 'center',
					textTransform: 'uppercase',
					zIndex: 1,
				}}
			>
				{'Alexander Joo-Hyun Sullivan'.split('').map((char, index) => (
					<Box
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						component='span'
						sx={{
							cursor: 'default',
							textShadow: '1px 2px 3px #666',
							transition: 'all 5s ease',
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
					marginTop: '2.5rem',
					fontSize: 'clamp(1.5rem, 3vw, 3rem)',
					textAlign: 'center',
					textShadow: '1px 2px 3px #000',
				}}
			>
				Full Stack Developer & Bioinformatician
			</Typography>
		</Box>
	);
}
