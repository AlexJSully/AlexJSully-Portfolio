'use client';

import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

interface ErrorProps {
	/** The error that occurred. */
	error: Error & { digest?: string };
}

/** Renders an error page. */
export default function Error({ error }: ErrorProps): ReactElement {
	/** The current pathname */
	const pathname = usePathname();

	useEffect(() => {
		// Log the error to the console
		console.error(error);
	}, [error]);

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
					fontSize: 'clamp(1.5rem, 2.5rem, 2.5rem)',
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Oops! Something went wrong.
			</Typography>

			<Typography
				component='h2'
				sx={{
					fontSize: 'clamp(1rem, 1.5rem, 1.5rem)',
					fontWeight: 'bold',
					textAlign: 'center',
				}}
			>
				Error: {error.message || 'Unknown error.'}
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
						{' '}
						Go Home
					</Typography>
				</Button>
			</Link>
		</Stack>
	);
}
