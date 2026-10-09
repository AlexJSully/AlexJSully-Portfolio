import policy from '@data/policy';
import profile from '@data/profile';
import projects from '@data/projects';
import publications from '@data/publications';
import socials from '@data/socials';
import { buildPolicyMarkdown } from '@util/markdown/policyMarkdown';
import { buildHomeMarkdown } from './homeMarkdown';

describe('buildHomeMarkdown', () => {
	const markdown = buildHomeMarkdown();
	const headings = markdown.split('\n').filter((line) => line.startsWith('#'));

	it('opens with the owner name as the only top-level heading', () => {
		expect(headings[0]).toBe(`# ${profile.name}`);
		expect(headings.filter((heading) => heading.startsWith('# '))).toHaveLength(1);
	});

	it('never skips a heading level', () => {
		const levels = headings.map((heading) => heading.indexOf(' '));

		levels.forEach((level, index) => {
			expect(level - (levels[index - 1] ?? 0)).toBeLessThanOrEqual(1);
		});
	});

	it.each(['## About', '## Projects', '## Publications', '## Contact', `## ${policy.title}`])(
		'has a %s section',
		(heading) => {
			expect(headings).toContain(heading);
		},
	);

	it('includes the profile description and email', () => {
		expect(markdown).toContain(profile.description);
		expect(markdown).toContain(`mailto:${profile.email}`);
	});

	it('includes every project, including those hidden behind "view more" on the page', () => {
		projects.forEach((project) => {
			expect(markdown).toContain(`### [${project.name}](${project.url})`);
		});
	});

	it('includes every publication with its full abstract and DOI link', () => {
		publications.forEach((publication) => {
			expect(markdown).toContain(publication.abstract);
			expect(markdown).toContain(`https://doi.org/${publication.doi}`);
		});
	});

	it('includes every social link', () => {
		socials.forEach((social) => {
			expect(markdown).toContain(social.url);
		});
	});

	it('includes the full privacy and cookie policy', () => {
		expect(markdown).toContain(buildPolicyMarkdown());
	});

	it('points agents at llms.txt', () => {
		expect(markdown).toContain('(https://alexjsully.me/llms.txt)');
	});
});
