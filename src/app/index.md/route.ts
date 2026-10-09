import { buildHomeMarkdown } from '@util/markdown/homeMarkdown';
import { markdownResponse } from '@util/markdown/markdownResponse';

/** Renders the Markdown once at build time, since its content comes only from static data modules. */
export const dynamic = 'force-static';

/**
 * Serves the Markdown representation of the home page, which `src/proxy.ts` also rewrites `/` to for agents that
 * request `text/markdown`.
 * @returns The home page as `text/markdown`
 */
export function GET(): Response {
	return markdownResponse(buildHomeMarkdown());
}
