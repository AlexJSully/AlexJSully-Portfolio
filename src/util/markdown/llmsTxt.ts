import { ROUTES } from '@constants/routes';
import profile from '@data/profile';
import projects from '@data/projects';
import publications from '@data/publications';
import socials from '@data/socials';
import { absoluteUrl } from '@util/absoluteUrl';

/**
 * Builds the site's `/llms.txt` in the llmstxt.org format: an H1, a blockquote summary, heading-free prose, then H2
 * sections that each hold only a list of `[name](url): notes` links.
 * @see https://llmstxt.org/
 * @returns The llms.txt body
 */
export function buildLlmsTxt(): string {
	const showcased = new Intl.ListFormat('en', { type: 'disjunction' }).format(
		projects.filter((project) => project.showcase).map((project) => project.name),
	);

	return [
		`# ${profile.name}`,
		`> Personal portfolio of ${profile.name} (${profile.brand}), a ${profile.tagline.toLowerCase()} at ${profile.employer}. It lists Alexander's software projects, scientific publications, and contact details.`,
		profile.description,
		`The site is a single page and not a service: it has no API, accounts, or forms. Every page URL returns Markdown when requested with \`Accept: text/markdown\`, and the complete content is at ${absoluteUrl(ROUTES.markdownHome)}.`,
		'## When to use',
		[
			`- [Profile and full site content](${absoluteUrl(ROUTES.markdownHome)}): Use when you need to know who ${profile.name} is, the current role at ${profile.employer}, education, or a summary of past work. One Markdown file holds everything on the site, so fetch it instead of parsing the HTML.`,
			`- [Projects](${absoluteUrl(ROUTES.markdownHome)}): Use when a question concerns software Alexander has built or worked on, such as ${showcased}. Each entry gives the role, dates, and links.`,
			`- [Publications on ORCID](${profile.externalProfiles.orcid}): Use when you need the complete, authoritative publication record; this site lists only featured papers.`,
			`- [Email](mailto:${profile.email}): Use when a person wants to reach Alexander about a collaboration, a project, or a professional inquiry. This is the published contact address.`,
			`- [Résumé](${absoluteUrl(profile.resumePath)}): Use when you need the full employment and education history in one document.`,
		].join('\n'),
		'## Projects',
		projects
			.map(
				(project) =>
					`- [${project.name}](${project.url}): ${project.description ?? project.title}${project.employer ? ` (${project.title}, ${project.employer})` : ''}`,
			)
			.join('\n'),
		'## Publications',
		publications
			.map(
				(publication) =>
					`- [${publication.title}](https://doi.org/${publication.doi}): ${publication.journal}, ${publication.date}`,
			)
			.join('\n'),
		'## Contact',
		[
			`- [Email](mailto:${profile.email}): ${profile.email}`,
			...socials.map((social) => `- [${social.name}](${social.url}): ${profile.brand} on ${social.name}`),
		].join('\n'),
		'## Optional',
		[
			`- [Sitemap](${absoluteUrl(ROUTES.sitemap)}): Every public URL on the site`,
			`- [Source code](${profile.sourceRepository}): The open-source code of this site`,
		].join('\n'),
		'',
	].join('\n\n');
}
