'use client';

import LinkIcon from '@components/link-icon/LinkIcon';
import { logAnalyticsEvent } from '@configs/firebase';
import publications from '@data/publications';
import { Box, Stack, Typography } from '@mui/material';
import { colors, focusRing } from '@styles/tokens';
import Link from 'next/link';

/** Renders a list of featured publications with their details. */
export default function Publications() {
	const metaStyling = {
		fontSize: 'clamp(0.5rem, 0.75rem, 0.75rem)',
	};

	return (
		publications && (
			<Stack
				aria-label='Publications'
				className='publications'
				direction='column'
				id='publications'
				spacing={2}
				sx={{
					margin: 'auto',
					maxWidth: {
						xs: '95%',
						sm: '80%',
						md: 'min(1080px, 80%)',
					},
					marginTop: '3rem',
					marginBottom: '2rem',
					zIndex: 1,
				}}
			>
				<Typography
					sx={{
						fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
						textAlign: 'center',
					}}
					variant='h2'
				>
					Featured Publications
				</Typography>

				{publications.map((publication) => {
					const href = `https://doi.org/${publication.doi}`;
					const logClick = () => {
						logAnalyticsEvent(`publication-${publication.doi}`, {
							name: `publication-${publication.doi}`,
							type: 'click',
						});
					};

					return (
						<Stack
							key={publication.doi}
							component='article'
							direction='column'
							spacing={2}
							sx={{
								backgroundColor: '#1e2227',
								borderRadius: '1rem',
								padding: '1rem',
								position: 'relative',
							}}
						>
							{/*
							 * The title link stretches over the whole card, so clicking anywhere opens the paper. Links
							 * cannot nest, so the card is not itself a link, and the DOI link sits above the stretched one.
							 */}
							<Typography
								component='h2'
								sx={{
									'& a::after': {
										borderRadius: '1rem',
										content: '""',
										inset: 0,
										position: 'absolute',
									},
									'& a:focus-visible': { outline: 'none' },
									'& a:focus-visible::after': focusRing,
								}}
								variant='h5'
							>
								<Link
									aria-label={`View ${publication.title} on ${publication.journal}`}
									href={href}
									onClick={logClick}
									prefetch
									rel='noopener noreferrer'
									style={{
										textDecoration: 'none',
										color: 'inherit',
									}}
									target='_blank'
								>
									{publication.title}
								</Link>
							</Typography>

							<Typography style={metaStyling}>{publication.authors.join(', ')}</Typography>

							<Typography style={metaStyling} sx={{ position: 'relative', zIndex: 1 }}>
								<Box
									component='a'
									href={href}
									onClick={logClick}
									rel='noopener noreferrer'
									sx={{ color: colors.link, '&:focus-visible': focusRing }}
									target='_blank'
								>
									<LinkIcon href={href} />
									{publication.doi}
								</Box>
								{` | ${publication.journal} | ${publication.date}`}
							</Typography>

							<Typography component='p' variant='body1'>
								{`${publication.abstract.substring(0, 550)}...`}
							</Typography>
						</Stack>
					);
				})}
			</Stack>
		)
	);
}
