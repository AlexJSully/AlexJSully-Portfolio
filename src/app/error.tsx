'use client';

import GoHomeLink from '@components/go-home-link/GoHomeLink';
import { Stack, Typography } from '@mui/material';
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

			<GoHomeLink>Go Home</GoHomeLink>
		</Stack>
	);
}

export default memo(Error);
