'use client';

import { HomeRounded as HomeRoundedIcon } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* eslint-disable no-nested-ternary */

export default function Navbar() {
	const pathname = usePathname();

	/** Material-UI theme */
	const theme = useTheme();
	/** Whether or not the screen is small */
	const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<AppBar
			sx={{
				backgroundColor: '#131518',
			}}
		>
			<Toolbar
				sx={{
					zIndex: 10,
					fontSize: '1.25rem',
					// Each item is 1rem tall, so 2rem is the height of the navbar
					height: '2rem',
					justifyContent: 'space-between',
				}}
			>
				{/* Home button */}
				<Link
					href='/'
					onClick={(e) => {
						if (pathname === '/') {
							e.preventDefault();
							document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
						}
					}}
				>
					<Tooltip arrow describeChild title='Home'>
						<IconButton
							sx={{
								color: 'white',
							}}
						>
							<HomeRoundedIcon />
						</IconButton>
					</Tooltip>
				</Link>

				{/* Projects */}
				<Link
					href='/#projects-grid'
					onClick={(e) => {
						if (pathname === '/') {
							e.preventDefault();
							document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' });
						}
					}}
					style={{
						textDecoration: 'none',
						color: 'inherit',
					}}
				>
					<Typography>Projects</Typography>
				</Link>

				{/* Publications */}
				{!smallScreen && (
					<Link
						href='/#publications'
						onClick={(e) => {
							if (pathname === '/') {
								e.preventDefault();
								document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' });
							}
						}}
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
					>
						<Typography>Publications</Typography>
					</Link>
				)}

				{/* Title */}
				<Typography>
					<Image
						alt='Logo'
						height={24}
						src='/images/drawn/profile_pic_drawn.webp'
						style={{
							filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
							marginRight: '1rem',
							borderRadius: '50%',
							// Inline with the text
							verticalAlign: 'middle',
						}}
						width={24}
					/>
					Alexander Sullivan
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
