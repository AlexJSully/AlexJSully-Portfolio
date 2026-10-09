import policy from '@data/policy';
import { buildPolicyMarkdown } from './policyMarkdown';

describe('buildPolicyMarkdown', () => {
	const markdown = buildPolicyMarkdown();
	const blocks = policy.sections.flatMap((section) => section.blocks);

	it('opens with the policy title at level two and the last-updated date', () => {
		expect(markdown.startsWith(`## ${policy.title}\n\nLast updated ${policy.lastUpdated}.`)).toBe(true);
	});

	it('renders every section heading at level three', () => {
		policy.sections.forEach((section) => {
			expect(markdown).toContain(`\n### ${section.heading}\n`);
		});
	});

	it('renders every paragraph and list item', () => {
		blocks.forEach((block) => {
			if (block.type === 'paragraph') {
				expect(markdown).toContain(block.text);
			}
			if (block.type === 'list') {
				block.items.forEach((item) => {
					expect(markdown).toContain(`- ${item}`);
				});
			}
		});
	});

	it('renders each table with a header row and a separator row', () => {
		blocks.forEach((block) => {
			if (block.type === 'table') {
				expect(markdown).toContain(
					`| ${block.columns.join(' | ')} |\n| ${block.columns.map(() => '---').join(' | ')} |`,
				);
			}
		});
	});

	it('keeps inline links as Markdown links', () => {
		expect(markdown).toContain('[alexjsully.me](https://alexjsully.me/) is the personal portfolio');
		expect(markdown).toContain('[alexjsully.connect@outlook.com](mailto:alexjsully.connect@outlook.com)');
	});

	it('turns a cell holding only a URL into an autolink', () => {
		expect(markdown).toContain('| <https://ico.org.uk> |');
	});

	it('leaves out the consent switches, which have no text form', () => {
		expect(markdown).not.toContain('consentControls');
	});
});
