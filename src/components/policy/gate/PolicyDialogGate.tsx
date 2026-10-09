'use client';

import { SECTION_IDS } from '@constants/routes';
import { usePanelOpen } from '@util/panelState';
import { runWhenIdle } from '@util/runWhenIdle';
import dynamic from 'next/dynamic';
import { type ReactElement, useEffect, useState } from 'react';

/**
 * Loads the dialog's code, which carries the whole policy and MUI's dialog and table, kept out of every page's first
 * download.
 * @returns The dialog module
 */
const loadPolicyDialog = () => import('@components/policy/dialog/PolicyDialog');

/** The policy dialog, loaded on demand and never server-rendered. */
const PolicyDialog = dynamic(loadPolicyDialog, { ssr: false });

/**
 * Mounts the policy dialog the first time it is opened, and keeps it mounted afterwards so its close transition plays.
 * The dialog's code is fetched once the page is idle, so a later open shows it without waiting.
 */
export default function PolicyDialogGate(): ReactElement | null {
	const open = usePanelOpen(SECTION_IDS.policy);
	/** Whether the dialog has been opened at least once. */
	const [mounted, setMounted] = useState(false);

	// Derived state set during render, so the first open mounts the dialog in the same pass.
	if (open && !mounted) {
		setMounted(true);
	}

	useEffect(
		() =>
			runWhenIdle(() => {
				// A failed preload is not an error: the dialog loads again when it is first opened.
				loadPolicyDialog().catch(() => {});
			}),
		[],
	);

	return mounted ? <PolicyDialog /> : null;
}
