'use client';

import PillButton, { accentFillSx } from '@components/pill-button/PillButton';
import { Box, Stack, Switch, type SxProps, type Theme, Typography } from '@mui/material';
import { colors } from '@styles/tokens';
import {
	type ConsentChoices,
	ESSENTIAL_ONLY,
	PURPOSE_CODES,
	readConsent,
	saveConsent,
} from '@util/consent/consentStore';
import { type ReactElement, type ReactNode, useId, useState } from 'react';

/** The words a visitor sees for one optional purpose. */
interface PurposeCopy {
	/** Short name of the purpose. */
	label: string;
	/** What allowing it does, naming the vendors involved. */
	description: string;
}

/** The copy for every optional purpose; keyed by purpose, so a purpose without a switch fails to compile. */
const PURPOSE_COPY: Readonly<Record<keyof ConsentChoices, PurposeCopy>> = {
	analytics: {
		label: 'Analytics',
		description:
			'Google Firebase and Vercel Speed Insights measure visits and page speed. Never used for advertising.',
	},
	media: {
		label: 'Embedded videos',
		description: 'YouTube project previews, which set YouTube’s own cookies.',
	},
	offline: {
		label: 'Offline access',
		description: 'Saves pages on this device so the site loads faster and works offline.',
	},
	linkIcons: {
		label: 'Link icons',
		description: 'Shows each linked site’s own icon, fetched through DuckDuckGo without cookies.',
	},
};

/** The optional purposes, in the order the stored cookie lists them. */
const PURPOSE_KEYS = Object.keys(PURPOSE_CODES) as (keyof ConsentChoices)[];

interface ConsentControlsProps {
	/** Called after the choices are saved. */
	onSaved?: () => void;
	/** Further buttons shown in the same row as "Save choices". */
	actions?: ReactNode;
}

/** The site's accent on a checked switch; the track uses the lighter accent, which stays visible on the surface. */
const switchSx: SxProps<Theme> = {
	flexShrink: 0,
	marginTop: -0.75,
	'& .MuiSwitch-switchBase.Mui-checked': { color: colors.link },
	'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.accentHover, opacity: 1 },
};

interface ControlRowProps {
	/** Short name of the purpose. */
	label: string;
	/** What the purpose does. */
	description: string;
	/** Prefix for the label, description, and control IDs. */
	idPrefix: string;
	/** Whether the row has an input its label should toggle when clicked. */
	labelsInput?: boolean;
	/** The control shown at the row's end. */
	children: ReactNode;
}

/** Renders one purpose: its label and description, with its control aligned to the label's first line. */
function ControlRow({ label, description, idPrefix, labelsInput, children }: Readonly<ControlRowProps>): ReactElement {
	return (
		<Box component='li' sx={{ alignItems: 'flex-start', display: 'flex', gap: 2, justifyContent: 'space-between' }}>
			{/* A real <label>, so clicking the name or the description toggles the switch. */}
			<Box
				component={labelsInput ? 'label' : 'div'}
				htmlFor={labelsInput ? `${idPrefix}-input` : undefined}
				sx={{ cursor: labelsInput ? 'pointer' : 'default' }}
			>
				{/* A heavier, larger name over a smaller muted description, so each purpose reads as a title and its detail. */}
				<Typography id={`${idPrefix}-label`} sx={{ fontSize: '1.0625rem', fontWeight: 600 }}>
					{label}
				</Typography>
				<Typography
					color='text.secondary'
					id={`${idPrefix}-description`}
					sx={{ fontSize: '0.8125rem', letterSpacing: 0, lineHeight: 1.5, marginTop: 0.25 }}
					variant='body2'
				>
					{description}
				</Typography>
			</Box>

			{children}
		</Box>
	);
}

/**
 * Renders a switch per optional purpose, after an always-on row for essential processing, and saves the choices.
 *
 * Shared by the consent banner's Customize view and the policy dialog, so both edit the same stored choice.
 */
export default function ConsentControls({ actions, onSaved }: Readonly<ConsentControlsProps>): ReactElement {
	const idPrefix = useId();
	/** The choices being edited, starting from what is stored. */
	const [draft, setDraft] = useState<ConsentChoices>(() => ({ ...(readConsent() ?? ESSENTIAL_ONLY) }));
	/** Whether the current draft has been saved, shown as a status message. */
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		saveConsent(draft);
		setSaved(true);
		onSaved?.();
	};

	return (
		<Stack spacing={2}>
			<Stack component='ul' spacing={2} sx={{ listStyle: 'none', margin: 0, padding: 0 }}>
				<ControlRow
					description='Hosting logs, error reports, and the cookie remembering this choice.'
					idPrefix={`${idPrefix}-essential`}
					label='Essential'
				>
					<Typography color='text.secondary' sx={{ flexShrink: 0, paddingTop: 0.25 }} variant='body2'>
						Always on
					</Typography>
				</ControlRow>

				{PURPOSE_KEYS.map((key) => (
					<ControlRow
						description={PURPOSE_COPY[key].description}
						idPrefix={`${idPrefix}-${key}`}
						key={key}
						label={PURPOSE_COPY[key].label}
						labelsInput
					>
						<Switch
							checked={draft[key]}
							onChange={(event) => {
								const { checked } = event.target;
								setSaved(false);
								setDraft((current) => ({ ...current, [key]: checked }));
							}}
							slotProps={{
								input: {
									'aria-describedby': `${idPrefix}-${key}-description`,
									// The name is the label alone; the <label> also wraps the description, which describes it instead.
									'aria-labelledby': `${idPrefix}-${key}-label`,
									id: `${idPrefix}-${key}-input`,
								},
							}}
							sx={switchSx}
						/>
					</ControlRow>
				))}
			</Stack>

			{/* "Save choices" sits at the start edge and any extra action at the end edge, even after wrapping onto its own line. */}
			<Stack
				direction='row'
				sx={{
					alignItems: 'center',
					columnGap: 2,
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					rowGap: 1,
				}}
			>
				<Stack direction='row' sx={{ alignItems: 'center' }}>
					<PillButton onClick={handleSave} size='small' sx={accentFillSx}>
						Save choices
					</PillButton>

					{/* Spaced only while it has text, so the empty status takes no room from the action beside it. */}
					<Typography
						color='text.secondary'
						role='status'
						sx={{ '&:not(:empty)': { marginInlineStart: 2 } }}
						variant='body2'
					>
						{saved ? 'Choices saved.' : ''}
					</Typography>
				</Stack>

				{actions ? <Box sx={{ marginInlineStart: 'auto' }}>{actions}</Box> : null}
			</Stack>
		</Stack>
	);
}
