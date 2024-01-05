'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import { HomeRounded as HomeRoundedIcon } from '@mui/icons-material';
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

	/** All text and logo to be rendered in the navbar header */
	const navbarHeaderText: any = {
		'/': {
			text: 'Alexander Sullivan',
			logo: '/images/drawn/profile_pic_drawn.webp',
		},
		'/portfolio/mpx': {
			text: 'Masterpiece X',
			logo: '/images/icons/mpx.svg',
		},
	};

	/** The text and logo to be rendered in the navbar header */
	const navbarHeaderUse: any = navbarHeaderText[pathname] ? navbarHeaderText[pathname] : navbarHeaderText['/'];

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
						zIndex: 10,
						transition: 'all 0.5s ease-in-out',
					}}
				>
					{/* Home button */}
					<Link
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
					<Typography>
						<Image
							alt='Logo'
							height={24}
							src={navbarHeaderUse.logo}
							style={{
								borderRadius: '50%',
								filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
								marginRight: '1rem',
								verticalAlign: 'middle',
							}}
							width={24}
						/>
						{navbarHeaderUse.text}
					</Typography>
				</Toolbar>
			</Fade>
		</AppBar>
	);
}
