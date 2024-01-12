import { Box, CircularProgress } from '@mui/material';
import { ReactElement } from 'react';

/** Renders a loading spinner. */
export default function Loading(): ReactElement {
	return (
		<Box
			component='div'
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
			<CircularProgress aria-label='Loading' />
		</Box>
	);
}
