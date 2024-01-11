'use client';

import Banner from '@components/banner/Banner';
import ProjectsGrid from '@components/projects/ProjectsGrid';
import Publications from '@components/publications/Publications';
import { init } from '@configs/firebase';
import { debounceConsoleLogLogo } from '@helper/ascii';
import { Box } from '@mui/material';
import { useEffect } from 'react';

/** Renders the home page. */
export default function Home() {
	useEffect(() => {
		init();

		debounceConsoleLogLogo();
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
			<Banner />

			<ProjectsGrid />

			<Publications />
		</Box>
	);
}
