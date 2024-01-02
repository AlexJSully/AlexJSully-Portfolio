'use client';

import StarsBackground from '@components/Stars/StarsBackground';
import Banner from '@components/banner/Banner';
import Footer from '@components/footer/Footer';
import ProjectsGrid from '@components/projects/ProjectsGrid';
import Publications from '@components/publications/Publications';
import { init } from '@configs/firebase';
import { Box } from '@mui/material';
import { useEffect } from 'react';

/** Renders the home page. */
export default function Home() {
	useEffect(() => {
		init();
	}, []);

	return (
		<Box
			// Center the content
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				minHeight: '100%',
				minWidth: '100%',
			}}
		>
			<StarsBackground />

			<Banner />

			<ProjectsGrid />

			<Publications />

			<Footer />
		</Box>
	);
}
