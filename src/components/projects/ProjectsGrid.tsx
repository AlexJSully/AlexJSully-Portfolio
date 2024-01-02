'use client';

import projects from '@data/projects';
import { Button, Card, CardMedia, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { ReactElement, useState } from 'react';

export default function ProjectsGrid(): ReactElement {
	const [viewMore, setViewMore] = useState(false);

	return (
		projects && (
			<Stack
				alignItems='center'
				direction='column'
				justifyContent='center'
				spacing={2}
				sx={{
					margin: 'auto',
				}}
			>
				<Typography
					sx={{
						fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
					}}
					variant='h2'
				>
					{viewMore ? 'All' : 'Featured'} Projects
				</Typography>

				<Grid
					alignItems='center'
					container
					direction='row'
					justifyContent='center'
					spacing={2}
					sx={{
						margin: 'auto',
						maxWidth: {
							sm: '75%',
							xs: '90%',
						},
						zIndex: 1,
					}}
				>
					{projects.map((project) => (
						<Grid
							key={project.id}
							item
							lg={4}
							sm={6}
							sx={{
								margin: 'auto',
								justifyContent: 'center',
								alignItems: 'center',
								display: viewMore || project.showcase ? 'flex' : 'none',
								transition: 'all 1s ease-in-out',
								flexDirection: 'column',
							}}
							xl={3}
							xs={12}
						>
							<Link href={project.url}>
								<Card
									sx={{
										borderRadius: '16px',
										width: '100%',
										height: '100%',
										aspectRatio: '4/3',
										backgroundColor: project.color,
										position: 'relative',
									}}
								>
									<CardMedia
										component='img'
										image={`/images/projects/${project.id}/thumbnail.${
											project.thumbnailFileType ?? 'webp'
										}`}
										sx={{
											height: '100%',
											width: '100%',
											objectFit: 'cover',
										}}
									/>
								</Card>
							</Link>

							<Link
								href={project.url}
								style={{
									textDecoration: 'none',
									color: 'inherit',
								}}
							>
								<Typography
									sx={{
										fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
										marginTop: '1rem',
										marginBottom: '1rem',
									}}
								>
									{project.name}
								</Typography>
							</Link>
						</Grid>
					))}
				</Grid>

				<Button onClick={() => setViewMore(!viewMore)} variant='contained'>
					{viewMore ? 'Show Less Projects' : 'View More Projects'}
				</Button>
			</Stack>
		)
	);
}
