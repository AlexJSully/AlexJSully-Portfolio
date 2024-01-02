import Banner from '@components/banner/Banner';
import StarsBackground from '@components/banner/StarsBackground';
import ProjectsGrid from '@components/projects/ProjectsGrid';
import { Box } from '@mui/material';

export default function Home() {
	return (
		<Box
			// Center the content
			sx={{
				display: 'flex',
				flexGrow: 1,
				minHeight: '100%',
				minWidth: '100%',
				flexDirection: 'column',
			}}
		>
			<StarsBackground />

			<Banner />

			<ProjectsGrid />
		</Box>
	);
}
