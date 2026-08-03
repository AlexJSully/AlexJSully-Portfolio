'use client';

import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement, memo, useEffect } from 'react';

interface ErrorProps {
	/** The error that occurred. */
	error: Error;
}

/**
 * Renders the fallback UI for an error thrown inside a route segment.
 *
 * Logs to the browser console rather than to Sentry; the root layout is still intact here, so the
 * page keeps rendering and the reader gets a link home. Shows `error.message`, or "Unknown error."
 * when the thrown value carries none.
 */
function Error({ error }: Readonly<ErrorProps>): ReactElement {
	const pathname = usePathname();

	useEffect(() => {
		console.error(error);
	}, [error]);

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
				aria-label='Go home'
				href='/'
				onClick={() => {
					if (pathname === '/' && typeof window !== 'undefined') {
						window.location.reload();
					}
				}}
				prefetch
				style={{
					cursor: 'pointer',
				}}
			>
				<Button
					aria-label='Go home button'
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
						Go Home
					</Typography>
				</Button>
			</Link>
		</Stack>
	);
}

export default memo(Error);
