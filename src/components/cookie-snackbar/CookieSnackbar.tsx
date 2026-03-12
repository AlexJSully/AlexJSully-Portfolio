'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Alert, IconButton, Snackbar, Stack } from '@mui/material';
import { hasCookieConsent, setCookieConsent } from '@util/cookieConsent';
import { useEffect, useState } from 'react';

/** Renders the cookie snackbar. */
export default function CookieSnackbar() {
	// Track if component is mounted on client to avoid SSR/client mismatch
	const [mounted, setMounted] = useState(false);
	/** Whether the snackbar is open. */
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setCookieConsent();
		setOpen(false);
	};

	useEffect(() => {
		setMounted(true);

		// Only show snackbar if user hasn't already accepted cookies
		if (!hasCookieConsent()) {
			setOpen(true);
		}
	}, []);

	if (!mounted) return null;

	return (
		<Snackbar onClose={handleClose} open={open}>
			<Alert severity='info'>
				<Stack alignItems='center' direction='row' justifyContent='space-between' sx={{ width: '100%' }}>
					This website uses cookies to enhance the user experience.
					<IconButton aria-label='close' color='inherit' onClick={handleClose} size='small'>
						<CloseRoundedIcon fontSize='small' />
					</IconButton>
				</Stack>
			</Alert>
		</Snackbar>
	);
}
