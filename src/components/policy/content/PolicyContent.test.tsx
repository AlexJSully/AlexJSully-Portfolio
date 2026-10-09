import policy from '@data/policy';
import { render, screen } from '@testing-library/react';
import PolicyContent from './PolicyContent';

describe('PolicyContent', () => {
	beforeEach(() => {
		render(<PolicyContent />);
	});

	it('renders every section heading', () => {
		policy.sections.forEach((section) => {
			expect(screen.getByRole('heading', { level: 3, name: section.heading })).toBeInTheDocument();
		});
	});

	it('renders every table with its column headers', () => {
		const tables = policy.sections.flatMap((section) => section.blocks).filter((block) => block.type === 'table');

		expect(screen.getAllByRole('table')).toHaveLength(tables.length);
		new Set(tables.flatMap((table) => table.columns)).forEach((column) => {
			const tablesWithColumn = tables.filter((table) => table.columns.includes(column)).length;

			expect(screen.getAllByRole('columnheader', { name: column })).toHaveLength(tablesWithColumn);
		});
	});

	it('names each scrollable table region after its section, and lets the keyboard reach it', () => {
		policy.sections
			.filter((section) => section.blocks.some((block) => block.type === 'table'))
			.forEach((section) => {
				expect(screen.getByRole('region', { name: `${section.heading} table` })).toHaveAttribute(
					'tabindex',
					'0',
				);
			});
	});

	it('links the contact email as mailto, opening in place rather than a new tab', () => {
		const links = screen.getAllByRole('link', { name: 'alexjsully.connect@outlook.com' });

		expect(links.length).toBeGreaterThan(0);
		links.forEach((link) => {
			expect(link).toHaveAttribute('href', 'mailto:alexjsully.connect@outlook.com');
			expect(link).not.toHaveAttribute('target');
		});
	});

	it('links the site name in the summary to the site', () => {
		expect(screen.getByRole('link', { name: 'alexjsully.me' })).toHaveAttribute('href', 'https://alexjsully.me/');
	});

	it('links a cell that holds only a URL', () => {
		expect(screen.getByRole('link', { name: 'ico.org.uk' })).toHaveAttribute('href', 'https://ico.org.uk');
	});

	it('labels a linked cell with its host name, keeping the full address as the target', () => {
		expect(screen.getByRole('link', { name: 'meity.gov.in' })).toHaveAttribute(
			'href',
			'https://www.meity.gov.in/data-protection-framework',
		);
	});

	it('renders the consent switches where the policy places them', () => {
		expect(screen.getByRole('switch', { name: 'Analytics' })).toBeInTheDocument();
	});
});
