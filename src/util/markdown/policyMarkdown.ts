import policy, { LINK_CELL, type PolicyBlock } from '@data/policy';

/**
 * Renders one table cell, escaping pipes and turning a lone URL into an autolink.
 * @param cell Cell text
 * @returns The cell as GitHub-flavoured Markdown
 */
function renderCell(cell: string): string {
	// Pipes would end the cell, and `<`/`>` would read as an HTML tag, hiding names such as `_ga_<ID>`.
	return LINK_CELL.test(cell)
		? `<${cell}>`
		: cell.replaceAll('|', '\\|').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Renders one policy block as Markdown.
 * @param block The block
 * @returns The Markdown, or `null` for a block with no text form
 */
function renderBlock(block: PolicyBlock): string | null {
	switch (block.type) {
		case 'paragraph':
			return block.text;
		case 'list':
			return block.items.map((item) => `- ${item}`).join('\n');
		case 'table':
			return [
				`| ${block.columns.map(renderCell).join(' | ')} |`,
				`| ${block.columns.map(() => '---').join(' | ')} |`,
				...block.rows.map((row) => `| ${row.map(renderCell).join(' | ')} |`),
			].join('\n');
		case 'consentControls':
			return null;
	}
}

/**
 * Builds the privacy and cookie policy as Markdown, titled at level two so it nests inside the home page.
 * @returns The policy as GitHub-flavoured Markdown
 */
export function buildPolicyMarkdown(): string {
	return [
		`## ${policy.title}`,
		`Last updated ${policy.lastUpdated}.`,
		...policy.sections.flatMap((section) => [
			`### ${section.heading}`,
			...section.blocks.map(renderBlock).filter((block): block is string => block !== null),
		]),
	].join('\n\n');
}
