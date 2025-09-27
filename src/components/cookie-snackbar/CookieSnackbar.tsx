'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Alert, IconButton, Snackbar, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

/** Renders the cookie snackbar. */
export default function CookieSnackbar() {
	// Track if component is mounted on client to avoid SSR/client mismatch
	const [mounted, setMounted] = useState(false);
	/** Whether the snackbar is open. */
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		document.cookie = 'cookie-consent=true; max-age=31536000; path=/';
		setOpen(false);
	};

	useEffect(() => {
		setMounted(true);

		// If the cookie 'cookie-consent' is set to true, don't show the snackbar
		if (document.cookie.includes('cookie-consent=true')) {
			setOpen(false);
		} else {
			setOpen(true);
			setTimeout(() => {
				document.cookie = 'cookie-consent=true; max-age=31536000; path=/';
			}, 1000);
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
