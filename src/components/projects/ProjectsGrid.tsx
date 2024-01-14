'use client';

import { logAnalyticsEvent } from '@configs/firebase';
import projects from '@data/projects';
import { Button, Card, CardMedia, Grid, Stack, Tooltip, Typography } from '@mui/material';
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
				sx={{
					margin: 'auto',
					maxWidth: '1920px',
					zIndex: 1,
				}}
			>
				<Typography
					className='projects-grid-title'
					id='projects-grid-title'
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
								padding: '10px',
								transition: 'all 0.5s ease-in-out',
							}}
							xl={3}
							xs={12}
						>
							<Link
								aria-label={`Project: ${project.name}`}
								href={project.url}
								onClick={() => {
									logAnalyticsEvent(`project-${project.id}`, {
										name: `project-${project.id}`,
										type: 'click',
									});
								}}
								prefetch
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
										alt={`${project.name} Thumbnail`}
										component='img'
										image={`/images/projects/${project.id}/thumbnail.webp`}
										loading='lazy'
										sx={{
											height: '100%',
											objectFit: 'cover',
											width: '100%',
										}}
									/>
								</Card>
							</Link>

							<Link
								aria-label={`Project name: ${project.name}`}
								href={project.url}
								prefetch
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
												aria-label={`Project:  ${project.name} - ${url.text}`}
												href={url.url}
												onClick={() => {
													logAnalyticsEvent(`project-${project.id}-${url.text}`, {
														name: `project-${project.id}-${url.text}`,
														type: 'click',
													});
												}}
												prefetch
												rel='noopener noreferrer'
												style={{
													color: 'inherit',
													textDecoration: 'none',
												}}
												target='_blank'
											>
												<Tooltip arrow describeChild title={url.tooltip}>
													<Button
														aria-label={`Project button: ${project.name} - ${url.text}`}
														sx={{
															alignItems: 'center',
															backgroundColor: '#24272d',
															border: `1px solid ${project.color || '#000'}25`,
															color: '#fff',
															display: 'flex',
															fontWeight: 600,
															transition: 'all .2s ease-in-out',
															svg: {
																marginRight: '0.5rem',
															},
															'&:hover': {
																backgroundColor: '#2c3443',
																border: `1px solid ${project.color || '#000'}`,
																svg: {
																	transform: 'scale(1.1)',
																	transition: 'all .2s ease-in-out',
																},
															},
														}}
														variant='contained'
													>
														{url.icon({})} {url.text}
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
					aria-label={`${viewMore ? 'Show Less' : 'View More'} Projects`}
					onClick={() => {
						logAnalyticsEvent(`projects-view-more-${viewMore ? 'less' : 'more'}`, {
							name: `projects-view-more-${viewMore ? 'less' : 'more'}`,
							type: 'click',
						});
						setViewMore(!viewMore);

						/** Scrolls to the projects grid. */
						const scrollToProjectsGrid = () => {
							/** The projects grid. */
							const projectsGrid = document.getElementById('projects-grid');
							/** The projects grid title. */
							const projectsGridTitle = document.getElementById('projects-grid-title');

							if (!projectsGrid || !projectsGridTitle) return;

							// If the projects grid title is not in view, scroll to it.
							const { top, bottom } = projectsGridTitle.getBoundingClientRect();
							const isTitleInView = top >= 0 && bottom <= window.innerHeight;

							if (!isTitleInView) {
								projectsGrid.scrollIntoView({ behavior: 'smooth' });
							}
						};

						scrollToProjectsGrid();
					}}
					variant='contained'
				>
					{viewMore ? 'Show Less Projects' : 'View More Projects'}
				</Button>
			</Stack>
		)
	);
}
