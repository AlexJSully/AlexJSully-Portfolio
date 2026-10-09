import profile from '@data/profile';
import projects from '@data/projects';
import publications from '@data/publications';
import socials from '@data/socials';
import { buildLlmsTxt } from './llmsTxt';

describe('buildLlmsTxt', () => {
	const llmsTxt = buildLlmsTxt();
	const lines = llmsTxt.split('\n');
	const firstSectionIndex = lines.findIndex((line) => line.startsWith('## '));

	/** Groups each H2 section's non-blank lines under its heading. */
	const sections = lines.slice(firstSectionIndex).reduce<Record<string, string[]>>((grouped, line) => {
		if (line.startsWith('## ')) {
			grouped[line.slice(3)] = [];
		} else if (line.trim() !== '') {
			Object.values(grouped).at(-1)?.push(line);
		}
		return grouped;
	}, {});

	it('opens with an H1 naming the site owner, then a blockquote summary', () => {
		const contentLines = lines.filter((line) => line.trim() !== '');

		expect(contentLines[0]).toBe(`# ${profile.name}`);
		expect(contentLines[1].startsWith('> ')).toBe(true);
	});

	it('has no heading between the H1 and the first H2 section', () => {
		expect(lines.slice(1, firstSectionIndex).some((line) => line.startsWith('#'))).toBe(false);
	});

	it('uses no heading deeper than H2', () => {
		expect(lines.some((line) => line.startsWith('###'))).toBe(false);
	});

	it('starts its sections with "When to use"', () => {
		expect(Object.keys(sections)[0]).toBe('When to use');
	});

	it('gives each "When to use" link specific guidance', () => {
		sections['When to use'].forEach((item) => {
			expect(item).toMatch(/^- \[[^\]]+\]\([^)]+\): Use when .{40,}/);
		});
	});

	it('holds only "[name](url)" list items in every H2 section', () => {
		Object.values(sections)
			.flat()
			.forEach((item) => {
				expect(item).toMatch(/^- \[[^\]]+\]\([^)]+\)(: .+)?$/);
			});
	});

	it('lists every project, publication, and social account', () => {
		projects.forEach((project) => {
			expect(sections.Projects).toContainEqual(expect.stringContaining(`[${project.name}](${project.url})`));
		});
		publications.forEach((publication) => {
			expect(sections.Publications).toContainEqual(
				expect.stringContaining(`(https://doi.org/${publication.doi})`),
			);
		});
		socials.forEach((social) => {
			expect(sections.Contact).toContainEqual(expect.stringContaining(`(${social.url})`));
		});
	});

	it('names every showcased project in the "When to use" guidance', () => {
		projects
			.filter((project) => project.showcase)
			.forEach((project) => {
				expect(sections['When to use'].join('\n')).toContain(project.name);
			});
	});

	it('closes with an Optional section', () => {
		expect(Object.keys(sections).at(-1)).toBe('Optional');
	});
});
