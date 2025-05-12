'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { AppBar, Fade, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* eslint-disable no-nested-ternary */

/** General navbar for the site. */
export default function Navbar() {
	/** The current pathname */
	const pathname = usePathname();

	/** Material-UI theme */
	const theme = useTheme();
	/** Whether or not the screen is small */
	const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<AppBar
			sx={{
				backgroundColor: '#131518',
				transition: 'all 0.5s ease-in-out',
			}}
		>
			<Fade in timeout={500}>
				<Toolbar
					sx={{
						fontSize: '1.25rem',
						height: '2rem',
						justifyContent: 'space-between',
						transition: 'all 0.5s ease-in-out',
						zIndex: 10,
					}}
				>
					{/* Home button */}
					<Link
						aria-label='Home'
						href='/'
						onClick={(e) => {
							logAnalyticsEvent('navbar_home', {
								name: 'navbar_home',
								type: 'click',
							});

							if (pathname === '/') {
								e.preventDefault();
								document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
							}
						}}
					>
						<Tooltip arrow describeChild title='Home'>
							<IconButton
								aria-label='Home button'
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
						aria-label='See projects'
						href='/#projects-grid'
						onClick={(e) => {
							logAnalyticsEvent('navbar_projects', {
								name: 'navbar_projects',
								type: 'click',
							});

							if (pathname === '/') {
								e.preventDefault();
								document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' });
							}
						}}
						style={{
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<Tooltip arrow describeChild title='View projects'>
							<Typography>Projects</Typography>
						</Tooltip>
					</Link>

					{/* Publications */}
					{!smallScreen && (
						<Link
							aria-label='See publications'
							href='/#publications'
							onClick={(e) => {
								logAnalyticsEvent('navbar_publications', {
									name: 'navbar_publications',
									type: 'click',
								});

								if (pathname === '/') {
									e.preventDefault();
									document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' });
								}
							}}
							style={{
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							<Tooltip arrow describeChild title='View publications'>
								<Typography>Publications</Typography>
							</Tooltip>
						</Link>
					)}

					{/* Title */}

					<Link
						aria-label='See socials'
						href='/#socials'
						onClick={(e) => {
							logAnalyticsEvent('navbar_socials', {
								name: 'navbar_socials',
								type: 'click',
							});

							if (pathname === '/') {
								e.preventDefault();
								document.getElementById('socials')?.scrollIntoView({ behavior: 'smooth' });
							}
						}}
						style={{
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<Typography>
							<Image
								alt='Logo'
								height={24}
								src='/images/drawn/profile_pic_drawn.webp'
								style={{
									borderRadius: '50%',
									filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
									marginRight: '1rem',
									verticalAlign: 'middle',
								}}
								width={24}
							/>
						</Typography>
					</Link>
				</Toolbar>
			</Fade>
		</AppBar>
	);
}
