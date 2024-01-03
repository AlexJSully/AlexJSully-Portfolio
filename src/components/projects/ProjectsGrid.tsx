'use client';

import projects from '@data/projects';
import { Button, Card, CardMedia, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { ReactElement, useState } from 'react';

/** Creates a grid of projects. */
export default function ProjectsGrid(): ReactElement {
	/** Whether to view all projects [true] or only featured projects [false, default] */
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
								alignItems: 'center',
								display: viewMore || project.showcase ? 'flex' : 'none',
								flexDirection: 'column',
								justifyContent: 'center',
								margin: 'auto',
								transition: 'all 1s ease-in-out',
							}}
							xl={3}
							xs={12}
						>
							<Link
								href={project.url}
								style={{
									display: 'flex',
									height: '100%',
								}}
							>
								<Card
									sx={{
										aspectRatio: '4/3',
										backgroundColor: project.color,
										border: `1px solid ${project.color}`,
										borderRadius: '16px',
										height: '100%',
										transition: 'all 0.5s ease',
										width: '100%',
										'&:hover': {
											transform: 'scale(1.05)',
											border: '1px solid #00EAB7',
										},
									}}
								>
									<CardMedia
										component='img'
										image={`/images/projects/${project.id}/thumbnail.${
											project.thumbnailFileType ?? 'webp'
										}`}
										sx={{
											height: '100%',
											objectFit: 'cover',
											width: '100%',
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
