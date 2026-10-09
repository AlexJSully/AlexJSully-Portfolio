'use client';

import PanelLink from '@components/panel-link/PanelLink';
import PillButton, { accentFillSx } from '@components/pill-button/PillButton';
import { MAIN_CONTENT_ID, SECTION_IDS } from '@constants/routes';
import { POLICY_TITLE } from '@data/policy';
import { Box, Button, Stack, Typography } from '@mui/material';
import { colors, focusRing, visuallyHiddenSx } from '@styles/tokens';
import { ACCEPT_ALL, type ConsentChoices, ESSENTIAL_ONLY, saveConsent } from '@util/consent/consentStore';
import { useConsent } from '@util/consent/useConsent';
import { closePanel, usePanelOpen } from '@util/panelState';
import dynamic from 'next/dynamic';
import { type FocusEvent, type KeyboardEvent, type ReactElement, useEffect, useRef, useState } from 'react';

/**
 * Loads the per-purpose switches, needed only after "Customize" or "Cookie settings".
 * @returns The switches module
 */
const loadConsentControls = () => import('@components/consent/controls/ConsentControls');

/** The per-purpose switches, kept out of the banner's first download. */
const ConsentControls = dynamic(loadConsentControls, { ssr: false });

/** Quiet text buttons beside the pills: pill-shaped like them, sentence case, with the site's hover fill. */
const textButtonSx = {
	borderRadius: '32px',
	minHeight: 44,
	paddingInline: 2,
	textTransform: 'none',
	'&:hover': { backgroundColor: colors.hover },
	'&:focus-visible': focusRing,
};

/** The two choice pills reach a 44px touch target on phones and keep their compact height on wider screens. */
const choiceSx = {
	minHeight: { xs: 44, sm: 'auto' },
};

/**
 * Moves focus to the main content, making it focusable only for as long as it holds focus, so the page keeps no
 * permanent `tabindex` that a click could land on.
 */
function focusMainContent(): void {
	const main = document.getElementById(MAIN_CONTENT_ID);
	if (main === null) {
		return;
	}

	main.setAttribute('tabindex', '-1');
	main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
	main.focus();
}

/** Message announced once a choice is stored. */
const SAVED_MESSAGE = 'Choices saved.';

/**
 * Renders the consent banner: shown until the visitor chooses, and again, with its switches, when the footer's
 * "Cookie settings" link opens the `cookie-settings` panel.
 *
 * "Essential only" and "Accept all" share one style so neither is favoured, and a click elsewhere chooses nothing.
 * Focus returns to where it came from when the banner closes, and a status region that outlives the banner announces
 * each saved choice. While the policy dialog is open the banner is hidden and inert rather than removed, so the
 * dialog can return focus to the banner's policy link when it closes.
 */
export default function ConsentBanner(): ReactElement {
	const consent = useConsent();
	const regionRef = useRef<HTMLElement>(null);
	/** The element focus came from, which regains focus when the banner closes. */
	const returnFocusRef = useRef<HTMLElement | null>(null);
	/** Whether "Customize" was pressed. */
	const [customizing, setCustomizing] = useState(false);
	/** Text of the status region, announced to screen readers. */
	const [announcement, setAnnouncement] = useState('');
	/** Whether the "Cookie settings" link opened the banner. */
	const settingsOpen = usePanelOpen(SECTION_IDS.cookieSettings);
	const policyOpen = usePanelOpen(SECTION_IDS.policy);

	const undecided = consent === null;
	const visible = undecided || settingsOpen;
	const showControls = customizing || settingsOpen;

	useEffect(() => {
		if (showControls) {
			if (settingsOpen && returnFocusRef.current === null) {
				returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			}
			regionRef.current?.focus();
		}
	}, [showControls, settingsOpen]);

	// While the banner is up, the page reserves scroll space beneath it so a focused element is never hidden behind it.
	useEffect(() => {
		const region = regionRef.current;
		if (!visible || region === null || typeof ResizeObserver === 'undefined') {
			return undefined;
		}

		const observer = new ResizeObserver(() => {
			document.documentElement.style.scrollPaddingBottom = `${region.offsetHeight + 32}px`;
		});
		observer.observe(region);

		return () => {
			observer.disconnect();
			document.documentElement.style.scrollPaddingBottom = '';
		};
	}, [visible]);

	/**
	 * Returns focus to where it came from, or to the main content when that is unknown, gone, or the page body, which
	 * Safari leaves focused after a click on a link.
	 */
	const restoreFocus = () => {
		const target = returnFocusRef.current;
		returnFocusRef.current = null;
		if (target?.isConnected && target !== document.body) {
			target.focus();
		} else {
			focusMainContent();
		}
	};

	const close = () => {
		setCustomizing(false);
		if (settingsOpen) {
			closePanel(SECTION_IDS.cookieSettings);
		}

		restoreFocus();
	};

	const saved = () => {
		setAnnouncement(SAVED_MESSAGE);
		close();
	};

	const choose = (choices: Readonly<ConsentChoices>) => {
		saveConsent(choices);
		saved();
	};

	const rememberFocusOrigin = (event: FocusEvent<HTMLElement>) => {
		const origin = event.relatedTarget;
		if (returnFocusRef.current === null && origin instanceof HTMLElement && !regionRef.current?.contains(origin)) {
			returnFocusRef.current = origin;
		}
	};

	const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
		// Escape closes the reopened settings without changes; on a first visit there is no earlier choice to keep.
		if (event.key === 'Escape' && settingsOpen && !undecided) {
			event.stopPropagation();
			close();
		}
	};

	return (
		<>
			<Box aria-live='polite' role='status' sx={visuallyHiddenSx}>
				{announcement}
			</Box>

			{visible ? (
				<Box
					aria-label='Your privacy choices'
					component='section'
					inert={policyOpen}
					onFocus={rememberFocusOrigin}
					onKeyDown={closeOnEscape}
					ref={regionRef}
					role='region'
					sx={{
						backgroundColor: 'background.paper',
						border: `1px solid ${colors.border}`,
						borderRadius: '16px',
						bottom: 'calc(16px + env(safe-area-inset-bottom))',
						boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
						left: 16,
						maxHeight: 'calc(100dvh - 32px)',
						maxWidth: { sm: 400 },
						outline: 'none',
						overflowY: 'auto',
						overscrollBehavior: 'contain',
						padding: 2,
						position: 'fixed',
						right: { xs: 16, sm: 'auto' },
						visibility: policyOpen ? 'hidden' : 'visible',
						zIndex: 'snackbar',
					}}
					tabIndex={-1}
				>
					<Stack spacing={1.5}>
						<Typography color='text.secondary' variant='body2'>
							Optional analytics, video previews, offline access, and link icons stay off until you
							choose.{' '}
							<PanelLink
								aria-haspopup='dialog'
								panel={SECTION_IDS.policy}
								sx={{ color: colors.link, '&:focus-visible': focusRing }}
							>
								{POLICY_TITLE}
							</PanelLink>
						</Typography>

						{showControls ? (
							<ConsentControls
								actions={
									settingsOpen && !undecided ? (
										<Button color='inherit' onClick={close} sx={textButtonSx}>
											Close without changes
										</Button>
									) : null
								}
								onSaved={saved}
							/>
						) : (
							<Box
								sx={{
									alignItems: 'center',
									display: 'grid',
									gap: 1,
									// Two equal columns on phones, so both choices are the same size and easy to tap.
									gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto auto 1fr' },
								}}
							>
								<PillButton
									onClick={() => choose(ESSENTIAL_ONLY)}
									size='small'
									sx={[accentFillSx, choiceSx]}
								>
									Essential only
								</PillButton>

								<PillButton
									onClick={() => choose(ACCEPT_ALL)}
									size='small'
									sx={[accentFillSx, choiceSx]}
								>
									Accept all
								</PillButton>

								<Button
									color='inherit'
									onClick={() => setCustomizing(true)}
									// Start fetching the switches as soon as the pointer or keyboard reaches the button.
									onFocus={() => void loadConsentControls()}
									onPointerEnter={() => void loadConsentControls()}
									sx={[
										textButtonSx,
										{ gridColumn: { xs: '1 / -1', sm: 'auto' }, justifySelf: { sm: 'end' } },
									]}
								>
									Customize
								</Button>
							</Box>
						)}
					</Stack>
				</Box>
			) : null}
		</>
	);
}
