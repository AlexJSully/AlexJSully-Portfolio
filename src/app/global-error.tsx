'use client';

import PillButton, { accentFillSx } from '@components/pill-button/PillButton';
import { captureError } from '@configs/sentry';
import { Stack, Typography } from '@mui/material';
import NextError from 'next/error';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement, memo, useEffect } from 'react';

interface GlobalErrorProps {
	/** The error that occurred. */
	error: Error;
}

/**
 * Renders the fallback page for an error thrown by the root layout.
 *
 * Next.js mounts this in place of the whole document, so it supplies its own `<html>` and `<body>`
 * rather than inheriting the layout's. Reports the error to Sentry, which is the only record of it:
 * a root layout failure leaves no working page to surface it from. The report is sent only when the
 * visitor has allowed Analytics, through `captureError` in `src/configs/sentry.ts`.
 */
function GlobalError({ error }: GlobalErrorProps): ReactElement {
	const pathname = usePathname();

	useEffect(() => {
		void captureError(error);
	}, [error]);

	return (
		<html lang='en'>
			<body>
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
						<NextError statusCode={undefined as any} />
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
						<PillButton aria-label='Go home button' sx={accentFillSx}>
							Go Home
						</PillButton>
					</Link>
				</Stack>
			</body>
		</html>
	);
}

export default memo(GlobalError);
