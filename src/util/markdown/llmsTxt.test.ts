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
		expect(sections['When to use'].length).toBeGreaterThan(0);
		sections['When to use'].forEach((item) => {
			expect(item).toMatch(/^- \[[^\]]+\]\([^)]+\): Use when .{40,}/);
		});
	});

	it('holds only "[name](url)" list items in every H2 section', () => {
		const items = Object.values(sections).flat();

		expect(items.length).toBeGreaterThan(0);
		items.forEach((item) => {
			expect(item).toMatch(/^- \[[^\]]+\]\([^)]+\)(: .+)?$/);
		});
	});

	it('lists every project, publication, and social account', () => {
		expect(projects.length).toBeGreaterThan(0);
		expect(publications.length).toBeGreaterThan(0);
		expect(socials.length).toBeGreaterThan(0);
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
		const showcased = projects.filter((project) => project.showcase);

		expect(showcased.length).toBeGreaterThan(0);
		showcased.forEach((project) => {
			expect(sections['When to use'].join('\n')).toContain(project.name);
		});
	});

	it('leaves a project that is not showcased out of the "When to use" guidance', () => {
		const hidden = projects.find((project) => !project.showcase);
		if (hidden === undefined) {
			throw new Error('@data/projects has no project with showcase false, so the showcase filter is untested');
		}

		expect(sections['When to use'].join('\n')).not.toContain(hidden.name);
	});

	it('closes with an Optional section', () => {
		expect(Object.keys(sections).at(-1)).toBe('Optional');
	});
});
