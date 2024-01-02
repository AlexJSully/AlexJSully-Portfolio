import { Box, CircularProgress } from '@mui/material';

/** Renders a loading spinner. */
export default function Loading() {
	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				height: '100%',
				justifyContent: 'center',
				position: 'absolute',
				width: '100%',
			}}
		>
			<CircularProgress />
		</Box>
	);
}
