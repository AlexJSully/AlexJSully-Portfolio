'use client';

import PanelLink from '@components/panel-link/PanelLink';
import PillButton, { accentFillSx } from '@components/pill-button/PillButton';
import { logAnalyticsEvent } from '@configs/firebase';
import { SECTION_IDS } from '@constants/routes';
import { POLICY_TITLE } from '@data/policy';
import profile from '@data/profile';
import socials from '@data/socials';
import { GitHubIcon } from '@images/icons';
import { Button, Grid, IconButton, Stack, type SxProps, type Theme, Tooltip, Typography } from '@mui/material';
import { colors, focusRing } from '@styles/tokens';
import Link from 'next/link';

/** Small muted text style shared by the footer's policy and cookie-settings links. */
const quietLinkSx: SxProps<Theme> = {
	// Positioned so it paints above the fixed starfield, which otherwise intercepts the click, as MUI buttons already do.
	position: 'relative',
	color: colors.textMuted,
	fontSize: '0.875rem',
	// Vertical padding gives the small text a taller tap target without moving it.
	paddingBlock: 1.5,
	textDecoration: 'none',
	'&:hover': {
		color: colors.text,
		textDecoration: 'underline',
	},
	'&:focus-visible': focusRing,
};

/** Renders the footer. */
export default function Footer() {
	return (
		<Stack
			aria-label='Footer'
			direction='column'
			id={SECTION_IDS.contact}
			spacing={2}
			sx={{
				alignItems: 'center',
				justifyContent: 'center',
				margin: '1rem auto',
				maxWidth: '90vw',
			}}
		>
			<Typography
				aria-label='Interested in working together?'
				sx={{
					fontSize: 'clamp(1rem, 2rem, 2rem)',
					textAlign: 'center',
				}}
				variant='h2'
			>
				Interested in working together?
			</Typography>

			<Stack direction='row' spacing={2}>
				<Link
					aria-label='Email me mailto'
					href={`mailto:${profile.email}`}
					prefetch
					style={{
						textDecoration: 'none',
						color: 'inherit',
					}}
				>
					<PillButton
						aria-label='Email me'
						onClick={() => {
							logAnalyticsEvent(`footer-email`, {
								name: 'footer-email',
								type: 'click',
							});
						}}
						sx={accentFillSx}
					>
						Email me
					</PillButton>
				</Link>

				<Link
					aria-label='Resume download'
					href={profile.resumePath}
					prefetch
					rel='noopener noreferrer'
					style={{
						textDecoration: 'none',
						color: 'inherit',
					}}
					target='_blank'
				>
					<PillButton
						aria-label='Resume'
						color='secondary'
						onClick={() => {
							logAnalyticsEvent(`footer-resume`, {
								name: 'footer-resume',
								type: 'click',
							});
						}}
					>
						Resume
					</PillButton>
				</Link>
			</Stack>

			<Grid
				className='socials'
				container
				direction='row'
				id='socials'
				spacing={1}
				sx={{
					alignItems: 'center',
					justifyContent: 'center',
					margin: 'auto',
					maxWidth: 'min(480px, 90vw)',
				}}
			>
				{socials.map((social) => (
					<Grid
						key={`${social.name}-grid-item`}
						sx={{
							alignItems: 'center',
							display: 'flex',
							justifyContent: 'center',
						}}
						size={{
							lg: 2,
							md: 3,
							xs: 4,
						}}
					>
						<Link
							key={`${social.name}-link`}
							aria-label={`${social.name} link`}
							href={social.url}
							prefetch
							rel='noopener noreferrer'
							style={{
								color: 'inherit',
								textDecoration: 'none',
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
										filter: 'drop-shadow(0px 4px 4px rgba(250, 250, 250, 0.2))',
										transition: 'all .2s ease-in-out',
										'&:hover': {
											backgroundColor: '#2c3443',
											color: social.color ?? 'primary.main',
											filter: `drop-shadow(0px 4px 4px ${social.color ?? 'primary.main'})`,
											transform: 'scale(1.1)',
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
					aria-label='GitHub repository'
					href={profile.sourceRepository}
					onClick={() => {
						logAnalyticsEvent(`footer-open-source`, {
							name: 'footer-open-source',
							type: 'click',
						});
					}}
					prefetch
					rel='noopener noreferrer'
					style={{
						color: 'inherit',
						marginLeft: '0.25rem',
						textDecoration: 'none',
					}}
					target='_blank'
				>
					<Button
						aria-label='GitHub repository button'
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

			<Stack
				direction='row'
				sx={{ alignItems: 'center', columnGap: 3, flexWrap: 'wrap', justifyContent: 'center', rowGap: 1 }}
			>
				<PanelLink aria-haspopup='dialog' panel={SECTION_IDS.policy} sx={quietLinkSx}>
					{POLICY_TITLE}
				</PanelLink>

				<PanelLink panel={SECTION_IDS.cookieSettings} sx={quietLinkSx}>
					Cookie settings
				</PanelLink>
			</Stack>
		</Stack>
	);
}
