'use client';

import GoHomeLink from '@components/go-home-link/GoHomeLink';
import { Box, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';

/** Renders a 404 not found page. */
export default function NotFound(): ReactElement {
	const pathname = usePathname();

	return (
		<Stack
			direction='column'
			spacing={2}
			sx={{
				alignItems: 'center',
				background: 'none',
				backgroundImage: 'none',
				flexGrow: 1,
				justifyContent: 'center',
				minHeight: '60vh',
				position: 'relative',
				width: '100vw',
				zIndex: 100,
			}}
		>
			<Typography
				aria-label='Page not found'
				component='h1'
				sx={{
					color: 'error.main',
					fontSize: 'clamp(1.5rem, 3rem, 3rem)',
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				404
			</Typography>

			<Typography
				component='h1'
				sx={{
					fontSize: 'clamp(1.5rem, 2rem, 2rem)',
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Hey! Where do you think you are going?!
			</Typography>

			<Typography
				component='h2'
				sx={{
					fontSize: 'clamp(1rem, 1.5rem, 1.5rem)',
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				<Box
					component='span'
					sx={{
						color: '#25fd00',
					}}
				>
					{pathname}
				</Box>
				?! What is that?!
			</Typography>

			<GoHomeLink>Go back home!</GoHomeLink>
		</Stack>
	);
}
