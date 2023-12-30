import Banner from '@components/banner/Banner';
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
			}}
		>
			<Banner />
		</Box>
	);
}
