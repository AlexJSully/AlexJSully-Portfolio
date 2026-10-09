import { buildLlmsTxt } from '@util/markdown/llmsTxt';

/** Renders the file once at build time, since its content comes only from static data modules. */
export const dynamic = 'force-static';

/**
 * Serves `/llms.txt`, the llmstxt.org index of the site for language models.
 * @returns The llms.txt body as plain text
 */
export function GET(): Response {
	return new Response(buildLlmsTxt(), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
