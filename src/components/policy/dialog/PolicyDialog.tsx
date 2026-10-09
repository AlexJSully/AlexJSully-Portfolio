'use client';

import PolicyContent from '@components/policy/content/PolicyContent';
import { SECTION_IDS } from '@constants/routes';
import policy from '@data/policy';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { colors, focusRing } from '@styles/tokens';
import { closePanel, usePanelOpen } from '@util/panelState';
import { type ReactElement, useId } from 'react';

/** The last-updated date as a long date, formatted once, in UTC so every visitor sees the same text. */
const LAST_UPDATED_TEXT = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long', timeZone: 'UTC' }).format(
	new Date(`${policy.lastUpdated}T00:00:00Z`),
);

/** Renders the privacy and cookie policy in a dialog, opened by a `PanelLink` or by the `#privacy` fragment a redirect sets. */
export default function PolicyDialog(): ReactElement {
	const theme = useTheme();
	// The dialog only renders in the browser, so the query is read on the first render rather than after it.
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
	const titleId = useId();
	const open = usePanelOpen(SECTION_IDS.policy);
	const close = () => closePanel(SECTION_IDS.policy);

	return (
		<Dialog
			aria-labelledby={titleId}
			fullScreen={fullScreen}
			maxWidth='md'
			onClose={close}
			open={open}
			scroll='paper'
			slotProps={{
				backdrop: { sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(19, 21, 24, 0.7)' } },
				paper: {
					sx: fullScreen
						? { border: 0, borderRadius: 0 }
						: // 800px keeps lines near 90 characters, a comfortable reading length, with the text filling the dialog.
							{ border: `1px solid ${colors.border}`, borderRadius: '16px', maxWidth: 800 },
				},
			}}
		>
			{/* The heading and the close button are siblings, so the button's label never joins the dialog's name. */}
			<DialogTitle
				component='div'
				sx={{ alignItems: 'center', display: 'flex', gap: 2, justifyContent: 'space-between' }}
			>
				<Typography
					component='h2'
					id={titleId}
					sx={{
						fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
						fontWeight: 300,
						lineHeight: 1.2,
						textWrap: 'balance',
					}}
				>
					{policy.title}
				</Typography>

				<IconButton
					aria-label='Close privacy and cookie policy'
					color='inherit'
					edge='end'
					onClick={close}
					sx={{ '&:focus-visible': focusRing }}
				>
					<CloseRoundedIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent
				dividers
				sx={{ display: 'flex', flexDirection: 'column', gap: 3, overscrollBehavior: 'contain' }}
			>
				<Typography color='text.secondary' variant='body2'>
					Last updated <time dateTime={policy.lastUpdated}>{LAST_UPDATED_TEXT}</time>
				</Typography>

				<PolicyContent />
			</DialogContent>
		</Dialog>
	);
}
