'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import socials from '@data/socials';
import { GitHubIcon } from '@images/icons';
import { Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

/** Renders the footer. */
export default function Footer() {
	return (
		<Stack
			alignItems='center'
			direction='column'
			justifyContent='center'
			spacing={2}
			sx={{
				margin: '1rem auto',
				maxWidth: '90vw',
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

			<Stack direction='row' spacing={2}>
				<Button
					onClick={() => {
						logAnalyticsEvent(`footer-email`, {
							name: 'footer-email',
							type: 'click',
						});
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
						logAnalyticsEvent(`footer-resume`, {
							name: 'footer-resume',
							type: 'click',
						});
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
						rel='noopener noreferrer'
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
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

			<Grid
				alignItems='center'
				container
				direction='row'
				justifyContent='center'
				spacing={1}
				sx={{
					maxWidth: 'min(480px, 90vw)',
					margin: 'auto',
				}}
			>
				{socials.map((social) => (
					<Grid
						key={`${social.name}-grid-item`}
						item
						lg={2}
						md={3}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						xs={4}
					>
						<Link
							key={`${social.name}-link`}
							href={social.url}
							rel='noopener noreferrer'
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
							target='_blank'
						>
							<Tooltip arrow describeChild title={social.name}>
								<IconButton
									aria-label={social.name}
									color='inherit'
									onClick={() => {
										logAnalyticsEvent(`footer-${social.name.toLowerCase()}`, {
											name: `footer-${social.name.toLowerCase()}`,
											type: 'click',
										});
									}}
									size='large'
									sx={{
										color: '#fff',
										transition: 'all .2s ease-in-out',
										filter: 'drop-shadow(0px 4px 4px rgba(250, 250, 250, 0.2))',
										'&:hover': {
											backgroundColor: '#2c3443',
											color: social.color ?? 'primary.main',
											transform: 'scale(1.1)',
											filter: `drop-shadow(0px 4px 4px ${social.color ?? 'primary.main'})`,
										},
									}}
								>
									{social.icon({})}
								</IconButton>
							</Tooltip>
						</Link>
					</Grid>
				))}
			</Grid>

			<Typography
				sx={{
					textAlign: 'center',
				}}
			>
				Handcrafted by <br /> Alexander Joo-Hyun Sullivan
			</Typography>

			<Typography
				sx={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				Open-source on{' '}
				<Link
					href='https://github.com/AlexJSully/AlexJSully-Portfolio'
					onClick={() => {
						logAnalyticsEvent(`footer-open-source`, {
							name: 'footer-open-source',
							type: 'click',
						});
					}}
					rel='noopener noreferrer'
					style={{
						color: 'inherit',
						textDecoration: 'none',
						marginLeft: '0.25rem',
					}}
					target='_blank'
				>
					<Button
						sx={{
							alignItems: 'center',
							color: '#fff',
							display: 'inline-flex',
							fontWeight: 600,
							transition: 'all .2s ease-in-out',
							svg: {
								transition: 'all .2s ease-in-out',
							},
							'&:hover': {
								backgroundColor: '#2c3443',
								svg: {
									transform: 'scale(1.1)',
								},
							},
						}}
					>
						<GitHubIcon
							sx={{
								marginRight: '0.25rem',
							}}
						/>
						GitHub
					</Button>
				</Link>
			</Typography>
		</Stack>
	);
}
