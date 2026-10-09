import { ROUTES } from '@constants/routes';
import profile from '@data/profile';
import { absoluteUrl } from '@util/absoluteUrl';

/**
 * Builds the Markdown body returned to agents that request a path the site does not serve.
 * @param pathname Requested path, as received
 * @returns Markdown explaining the miss and linking to the site's machine-readable entry points
 */
export function buildNotFoundMarkdown(pathname: string): string {
	return [
		'# Page not found',
		'',
		`There is no page at \`${pathname}\` on ${profile.brand}'s portfolio. The site is a single page, and everything it publishes is on the home page.`,
		'',
		`- [Home page](${absoluteUrl(ROUTES.home)}): request it with \`Accept: text/markdown\` to receive Markdown`,
		`- [Full site content as Markdown](${absoluteUrl(ROUTES.markdownHome)})`,
		`- [llms.txt](${absoluteUrl(ROUTES.llmsTxt)}): an index of the site for language models`,
		`- [Sitemap](${absoluteUrl(ROUTES.sitemap)})`,
		'',
	].join('\n');
}
