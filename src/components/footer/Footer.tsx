'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import {
	GitHub as GitHubIcon,
	Instagram as InstagramIcon,
	LinkedIn as LinkedInIcon,
	Twitter as TwitterIcon,
} from '@mui/icons-material';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useMemo } from 'react';

/** Renders the footer. */
export default function Footer() {
	/** Social media links. */
	const socials = useMemo(
		() => [
			{
				name: 'Twitter',
				icon: <TwitterIcon />,
				url: 'https://twitter.com/AlexJSully',
				newTab: true,
			},
			{
				name: 'Instagram',
				icon: <InstagramIcon />,
				url: 'https://www.instagram.com/alex.j.sullly/',
				newTab: true,
			},
			{
				name: 'GitHub',
				icon: <GitHubIcon />,
				url: 'https://github.com/AlexJSully',
				newTab: true,
			},
			{
				name: 'LinkedIn',
				icon: <LinkedInIcon />,
				url: 'https://www.linkedin.com/in/alexanderjsullivan/',
				newTab: true,
			},
		],
		[],
	);

	return (
		<Stack
			alignItems='center'
			direction='column'
			justifyContent='center'
			spacing={2}
			sx={{
				margin: '1rem auto',
			}}
		>
			<Typography
				sx={{
					fontSize: 'clamp(1rem, 2rem, 2rem)',
					textAlign: 'center',
				}}
				variant='h2'
			>
				Interested in working together?
			</Typography>

			<Stack
				direction={{
					sm: 'row',
					xs: 'column',
				}}
				spacing={2}
			>
				<Button
					onClick={() => {
						logAnalyticsEvent(`footer-email`);
					}}
					sx={{
						backgroundColor: '#001ca8',
						borderRadius: '32px',
						border: '3px solid #001ca8',
						fontSize: '0.5rem',
						lineHeight: '2rem',
						transition: 'all 1s ease',
						'&:hover': {
							backgroundColor: '#0041b9',
							borderRadius: '5%',
							border: '3px solid #0041b9',
							transition: 'all 0.25s ease',
						},
					}}
					variant='contained'
				>
					<Link
						href='mailto:alexjsully.connect@outlook.com'
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
					>
						<Typography
							sx={{
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							Email me
						</Typography>
					</Link>
				</Button>

				<Button
					color='secondary'
					onClick={() => {
						logAnalyticsEvent(`footer-resume`);
					}}
					sx={{
						borderRadius: '32px',
						fontSize: '0.5rem',
						lineHeight: '2rem',
						transition: 'all 1s ease',
						'&:hover': {
							borderRadius: '5%',
							transition: 'all 0.25s ease',
						},
					}}
					variant='contained'
				>
					<Link
						href='/resume/Resume.pdf'
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
						rel='noopener noreferrer'
						target='_blank'
					>
						<Typography
							sx={{
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							Resume
						</Typography>
					</Link>
				</Button>
			</Stack>

			<Stack direction='row'>
				{socials.map((social) => (
					<Link
						key={`${social.name}-link`}
						href={social.url}
						rel='noopener noreferrer'
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
						target={social.newTab ? '_blank' : '_self'}
					>
						<IconButton
							aria-label={social.name}
							color='inherit'
							onClick={() => {
								logAnalyticsEvent(`footer-${social.name.toLowerCase()}`);
							}}
							size='large'
							sx={{
								'&:hover': {
									color: 'primary.main',
								},
							}}
						>
							{social.icon}
						</IconButton>
					</Link>
				))}
			</Stack>

			<Typography
				sx={{
					textAlign: 'center',
				}}
			>
				Handcrafted by <br /> Alexander Joo-Hyun Sullivan
			</Typography>
		</Stack>
	);
}
