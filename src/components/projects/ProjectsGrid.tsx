'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import projects from '@data/projects';
import { Button, Card, CardMedia, Grid, Stack, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
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
				className='projects-grid'
				direction='column'
				id='projects-grid'
				justifyContent='center'
				spacing={2}
				sx={{
					margin: 'auto',
					maxWidth: '1920px',
					zIndex: 1,
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
					alignItems='flex-start'
					container
					direction='row'
					justifyContent='center'
					spacing={2}
					sx={{
						margin: 'auto',
						marginBottom: '2rem',
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
								height: '100%',
								justifyContent: 'flex-start',
								margin: '1rem auto auto',
								transition: 'all 1s ease-in-out',
							}}
							xl={3}
							xs={12}
						>
							<Link
								href={project.url}
								onClick={() => {
									logAnalyticsEvent(`project-${project.id}`);
								}}
								rel='noopener noreferrer'
								style={{
									display: 'flex',
									height: '100%',
								}}
								target='_blank'
							>
								<Card
									sx={{
										aspectRatio: '4/3',
										backgroundColor: `${project.color || '#000'}25`,
										border: `1px solid ${project.color || '#000'}25`,
										borderRadius: '16px',
										height: '100%',
										transition: 'all 0.5s ease',
										width: '100%',
										'&:hover': {
											backgroundColor: `${project.color || '#000'}`,
											border: `1px solid ${project.color || '#000'}`,
											transform: 'scale(1.05)',
										},
									}}
								>
									<CardMedia
										component='img'
										image={`/images/projects/${project.id}/thumbnail.webp`}
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
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								<Typography
									sx={{
										fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
										marginBottom: '1rem',
										marginTop: '1rem',
									}}
								>
									{project.name}
								</Typography>
							</Link>

							{project.urls && (
								<Grid alignItems='center' container direction='row' justifyContent='center' spacing={2}>
									{project.urls.map((url) => (
										<Grid key={`${url.text}-grid-item`} item>
											<Link
												href={url.url}
												onClick={() => {
													logAnalyticsEvent(`project-${project.id}-${url.text}`);
												}}
												rel='noopener noreferrer'
												style={{
													color: 'inherit',
													textDecoration: 'none',
												}}
												target='_blank'
											>
												<Tooltip arrow describeChild title={url.tooltip}>
													<Button
														sx={{
															alignItems: 'center',
															backgroundColor: '#24272d',
															border: `1px solid ${project.color || '#000'}25`,
															color: '#fff',
															display: 'flex',
															fontWeight: 600,
															transition: 'all .2s ease-in-out',
															'&:hover': {
																backgroundColor: '#2c3443',
																border: `1px solid ${project.color || '#000'}`,
																img: {
																	transform: 'scale(1.1)',
																	transition: 'all .2s ease-in-out',
																},
															},
														}}
														variant='contained'
													>
														<Image
															alt='Logo'
															height={24}
															src={url.icon}
															style={{
																filter: 'drop-shadow(0px 4px 4px rgba(250, 250, 250, 0.2))',
																marginRight: '0.5rem',
																transition: 'all .2s ease-in-out',
															}}
															width={24}
														/>{' '}
														{url.text}
													</Button>
												</Tooltip>
											</Link>
										</Grid>
									))}
								</Grid>
							)}
						</Grid>
					))}
				</Grid>

				<Button
					onClick={() => {
						logAnalyticsEvent(`projects-view-more-${viewMore ? 'less' : 'more'}`);
						setViewMore(!viewMore);
					}}
					variant='contained'
				>
					{viewMore ? 'Show Less Projects' : 'View More Projects'}
				</Button>
			</Stack>
		)
	);
}
