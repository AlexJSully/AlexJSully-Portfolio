'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import publications from '@data/publications';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';

/** Renders a list of featured publications with their details. */
export default function Publications() {
	/** Styling for the publication metadata. */
	const metaStyling = {
		fontSize: 'clamp(0.5rem, 0.75rem, 0.75rem)',
	};

	return (
		publications && (
			<Stack
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

				{publications.map((publication) => (
					<Link
						key={`${publication.doi}-link`}
						href={`https://doi.org/${publication.doi}`}
						onClick={() => {
							logAnalyticsEvent(`publication-${publication.doi}`, {
								name: `publication-${publication.doi}`,
								type: 'click',
							});
						}}
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
					>
						<Stack
							key={publication.doi}
							direction='column'
							spacing={2}
							sx={{
								backgroundColor: '#1e2227',
								borderRadius: '1rem',
								padding: '1rem',
							}}
						>
							<Typography key={`research-card-${publication?.title}-title`} component='h2' variant='h5'>
								{publication?.title}
							</Typography>

							<Typography key={`research-card-${publication?.title}-authors`} style={metaStyling}>
								{publication?.authors.join(', ')}
							</Typography>

							<Typography key={`research-card-${publication?.title}-metaData`} style={metaStyling}>
								{[publication.doi, publication.journal, publication.date].join(' | ')}
							</Typography>

							<Typography
								key={`research-card-${publication?.title}-abstract`}
								component='p'
								variant='body1'
							>
								{`${publication?.abstract.substring(0, 550)}...`}
							</Typography>
						</Stack>
					</Link>
				))}
			</Stack>
		)
	);
}
