/**
 * Wraps a Markdown body in a response carrying the headers acceptmarkdown.com requires: a Markdown content type with
 * an explicit charset, and `Vary: Accept` so caches keep it apart from the HTML representation of the same URL.
 * @see https://acceptmarkdown.com/
 * @param body Markdown text
 * @param status HTTP status code
 * @returns The response
 */
export function markdownResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
		},
	});
}
