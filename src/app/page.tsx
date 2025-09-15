'use client';

import Banner from '@components/banner/Banner';
import ProjectsGrid from '@components/projects/ProjectsGrid';
import Publications from '@components/publications/Publications';
import { init } from '@configs/firebase';
import { debounceConsoleLogLogo } from '@helpers/ascii';
import { Box } from '@mui/material';
import { useEffect } from 'react';

/** Renders the home page. */
export default function Home() {
	useEffect(() => {
		init();

		debounceConsoleLogLogo();

		if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(function (err) {
				console.error('Service Worker registration failed: ', err);
			});
		}
	}, []);

	return (
		<Box
			component='div'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				minHeight: '100%',
				minWidth: '100%',
			}}
		>
			<Banner aria-label='Landing banner' />

			<ProjectsGrid aria-label='Grid showing projects worked on' />

			<Publications aria-label='List of scientific publications' />
		</Box>
	);
}
