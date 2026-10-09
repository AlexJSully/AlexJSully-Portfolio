'use client';

import ConsentControls from '@components/consent/controls/ConsentControls';
import LinkIcon from '@components/link-icon/LinkIcon';
import policy, { INLINE_LINK, LINK_CELL, type PolicyBlock } from '@data/policy';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, type Theme, Typography } from '@mui/material';
import { colors, focusRing } from '@styles/tokens';
import { normaliseHostname } from '@util/linkIcon';
import type { ReactElement, ReactNode } from 'react';

/**
 * Table layout: a normal table from the `sm` breakpoint up, and on phones a stack of rows in which each cell shows its
 * column name beside its value, so nothing scrolls sideways.
 */
const stackedTableSx = (theme: Theme) => ({
	minWidth: 560,
	// The section's own divider follows the table, so the last row's rule would draw a second line beneath it.
	'& tbody tr:last-of-type td': { borderBottom: 0 },
	[theme.breakpoints.down('sm')]: {
		minWidth: 0,
		'& thead': { display: 'none' },
		'& tbody, & tr': { display: 'block' },
		'& tr': { borderBottom: `1px solid ${colors.border}`, paddingBlock: 1 },
		'& tbody tr:last-of-type': { borderBottom: 0 },
		'& td': {
			border: 0,
			columnGap: 2,
			display: 'grid',
			gridTemplateColumns: '7rem 1fr',
			paddingBlock: 0.5,
			paddingInline: 0,
		},
		'& td::before': { color: 'text.secondary', content: 'attr(data-label)' },
	},
});

/**
 * Renders one table cell, turning a lone URL into a link labelled with its site's host name, so a long path never
 * sets the column's width.
 * @param cell Cell text
 * @returns The cell content
 */
function renderCell(cell: string): ReactElement | string {
	if (!LINK_CELL.test(cell)) {
		return cell;
	}

	const label = cell.startsWith('https:') ? normaliseHostname(new URL(cell).hostname) : cell;

	return <Box sx={{ whiteSpace: 'nowrap' }}>{renderLink(cell, label)}</Box>;
}

/**
 * Renders a link. A web link opens in a new tab, so the policy stays open behind it; a `mailto:` link opens the email
 * app in place, since a new tab would be left empty.
 * @param href Link target
 * @param label Link text
 * @returns The link
 */
function renderLink(href: string, label: string): ReactElement {
	const newTab = href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {};

	return (
		<Box component='a' href={href} key={href} sx={{ color: colors.link, '&:focus-visible': focusRing }} {...newTab}>
			<LinkIcon href={href} />
			{label}
		</Box>
	);
}

/**
 * Renders paragraph or list text, turning each `[label](url)` into a link.
 * @param text The text
 * @returns The text with its links
 */
function renderInline(text: string): ReactNode[] {
	// Splitting on a pattern with two capture groups yields text, label, URL, text, label, URL, ..., text.
	const parts = text.split(INLINE_LINK);
	const nodes: ReactNode[] = [];
	for (let index = 0; index < parts.length; index += 3) {
		nodes.push(parts[index]);
		if (index + 2 < parts.length) {
			nodes.push(renderLink(parts[index + 2], parts[index + 1]));
		}
	}
	return nodes;
}

/**
 * Renders one policy block.
 * @param block The block
 * @param heading The heading of the section holding it, which names its table for assistive technology
 * @returns The rendered block
 */
function renderBlock(block: PolicyBlock, heading: string): ReactElement {
	switch (block.type) {
		case 'paragraph':
			return <Typography sx={{ lineHeight: 1.6 }}>{renderInline(block.text)}</Typography>;
		case 'list':
			return (
				<Box component='ul' sx={{ lineHeight: 1.6, margin: 0, paddingLeft: 3 }}>
					{block.items.map((item) => (
						<li key={item}>{renderInline(item)}</li>
					))}
				</Box>
			);
		case 'table':
			return (
				// A named, focusable region, so keyboard users can scroll a table that is wider than the dialog.
				<Box
					aria-label={`${heading} table`}
					role='region'
					sx={{ overflowX: 'auto', '&:focus-visible': focusRing }}
					tabIndex={0}
				>
					<Table size='small' sx={stackedTableSx}>
						<TableHead>
							<TableRow>
								{block.columns.map((column) => (
									<TableCell key={column} scope='col' sx={{ fontWeight: 500 }}>
										{column}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{block.rows.map((row) => (
								<TableRow key={row.join('|')}>
									{row.map((cell, index) => (
										<TableCell
											data-label={block.columns[index]}
											key={block.columns[index]}
											sx={{ verticalAlign: 'top' }}
										>
											{renderCell(cell)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			);
		case 'consentControls':
			return (
				<Box
					sx={{
						backgroundColor: colors.raised,
						border: `1px solid ${colors.border}`,
						borderRadius: '16px',
						padding: 2,
					}}
				>
					<ConsentControls />
				</Box>
			);
	}
}

/** Renders every section of the privacy and cookie policy from `@data/policy`. */
export default function PolicyContent(): ReactElement {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
			{policy.sections.map((section, index) => (
				<Box
					component='section'
					key={section.heading}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1.5,
						// A hairline above every section after the first marks where one topic ends and the next begins.
						...(index > 0 && { borderTop: 1, borderColor: 'divider', paddingTop: 4 }),
					}}
				>
					<Typography
						component='h3'
						sx={{ fontSize: '1.35rem', fontWeight: 600, letterSpacing: '0.01em', textWrap: 'balance' }}
					>
						{section.heading}
					</Typography>
					{section.blocks.map((block, blockIndex) => (
						<Box key={`${section.heading}-${blockIndex}`}>{renderBlock(block, section.heading)}</Box>
					))}
				</Box>
			))}
		</Box>
	);
}
