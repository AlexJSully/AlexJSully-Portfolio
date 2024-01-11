'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';

/** Renders an error page. */
export default function NotFound(): ReactElement {
	/** The current pathname */
	const pathname = usePathname();

	return (
		<Stack
			alignItems='center'
			direction='column'
			justifyContent='center'
			spacing={2}
			sx={{
				background: 'none',
				backgroundImage: 'none',
				flexGrow: 1,
				minHeight: '60vh',
				position: 'relative',
				width: '100vw',
				zIndex: 100,
			}}
		>
			<Typography
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

			<Link
				href='/'
				onClick={() => {
					if (pathname === '/' && typeof window !== 'undefined') {
						// Reload the page
						window.location.reload();
					}
				}}
				prefetch
				style={{
					cursor: 'pointer',
				}}
			>
				<Button
					sx={{
						backgroundColor: '#001ca8',
						border: '3px solid #001ca8',
						borderRadius: '32px',
						fontSize: '0.5rem',
						lineHeight: '2rem',
						transition: 'all 1s ease',
						'&:hover': {
							backgroundColor: '#0041b9',
							border: '3px solid #0041b9',
							borderRadius: '5%',
							transition: 'all 0.25s ease',
						},
					}}
					variant='contained'
				>
					<Typography
						sx={{
							color: 'inherit',
							textDecoration: 'none',
							textTransform: 'none',
						}}
					>
						Go back home!
					</Typography>
				</Button>
			</Link>
		</Stack>
	);
}
