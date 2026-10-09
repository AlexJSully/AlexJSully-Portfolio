import { ROUTES } from '@constants/routes';
import profile from '@data/profile';
import projects from '@data/projects';
import publications from '@data/publications';
import socials from '@data/socials';
import { absoluteUrl } from '@util/absoluteUrl';
import { buildPolicyMarkdown } from '@util/markdown/policyMarkdown';

/**
 * Renders every project, including those the home page hides behind "view more", as Markdown sections.
 * @returns One `###` section per project
 */
function projectSections(): string[] {
	return projects.map((project) => {
		const role = project.employer
			? `${project.title} at [${project.employer}](${project.employerURL ?? project.url})`
			: project.title;
		const dates = project.dates
			? `${project.dates.startDate} to ${project.dates.endDate === 'current' ? 'present' : project.dates.endDate}`
			: null;
		const links = project.urls.map((link) => `[${link.text}](${link.url})`).join(', ');

		return [
			`### [${project.name}](${project.url})`,
			'',
			...(project.description ? [project.description, ''] : []),
			`- Role: ${role}`,
			...(project.type ? [`- Type: ${project.type}`] : []),
			...(dates ? [`- Dates: ${dates}`] : []),
			`- Links: ${links}`,
		].join('\n');
	});
}

/**
 * Renders every publication, with its full abstract, as Markdown sections.
 * @returns One `###` section per publication
 */
function publicationSections(): string[] {
	return publications.map((publication) =>
		[
			`### ${publication.title}`,
			'',
			`- Authors: ${publication.authors.join(', ')}`,
			`- Published: ${publication.journal}, ${publication.date}`,
			`- DOI: [${publication.doi}](https://doi.org/${publication.doi})`,
			'',
			publication.abstract,
		].join('\n'),
	);
}

/**
 * Builds the Markdown representation of the home page, served to agents that request `text/markdown`.
 *
 * It carries everything the HTML page shows plus the About and Contact content and the privacy and cookie policy that
 * the redirects in `@constants/routes` point to.
 * @returns The full site content as Markdown
 */
export function buildHomeMarkdown(): string {
	return [
		`# ${profile.name}`,
		`> ${profile.tagline}. The portfolio of ${profile.brand}: projects, publications, and contact details.`,
		'## About',
		profile.description,
		'## Projects',
		...projectSections(),
		'## Publications',
		...publicationSections(),
		'## Contact',
		[
			`- Email: [${profile.email}](mailto:${profile.email})`,
			`- Résumé: [${absoluteUrl(profile.resumePath)}](${absoluteUrl(profile.resumePath)})`,
			...socials.map((social) => `- ${social.name}: [${social.url}](${social.url})`),
		].join('\n'),
		buildPolicyMarkdown(),
		'## For agents',
		`An index of this site for language models is at [llms.txt](${absoluteUrl(ROUTES.llmsTxt)}).`,
		'',
	].join('\n\n');
}
