'use client';

import { ROUTES } from '@constants/routes';
import { Box, type SxProps, type Theme } from '@mui/material';
import { openPanel } from '@util/panelState';
import type { ReactElement, ReactNode } from 'react';

interface PanelLinkProps {
	/** The panel's section ID, as in `SECTION_IDS`. */
	panel: string;
	/** The link text. */
	children: ReactNode;
	/** Link styles. */
	sx?: SxProps<Theme>;
	/** Set to `dialog` when the panel is a dialog, so assistive technology announces that one opens. */
	'aria-haspopup'?: 'dialog';
}

/**
 * Renders a link that opens a panel, such as the policy dialog, without changing the URL. Its `href` points at the
 * panel's fragment on the home page, so it still works before the page hydrates and in a new tab.
 * It opens something on this page rather than going anywhere, so it carries no link icon.
 */
export default function PanelLink({
	panel,
	children,
	sx,
	'aria-haspopup': ariaHasPopup,
}: Readonly<PanelLinkProps>): ReactElement {
	const href = `${ROUTES.home}#${panel}`;

	return (
		<Box
			aria-haspopup={ariaHasPopup}
			component='a'
			href={href}
			onClick={(event) => {
				// A modified click opens the href in a new tab or window, so leave it to the browser.
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
					return;
				}
				event.preventDefault();
				openPanel(panel);
			}}
			sx={sx}
		>
			{children}
		</Box>
	);
}
