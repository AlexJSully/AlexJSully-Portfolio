/** @jest-environment node */
import { buildHomeMarkdown } from '@util/markdown/homeMarkdown';
import { GET } from './route';

describe('GET /index.md', () => {
	it('serves the home page as Markdown that varies by Accept', async () => {
		const response = GET();

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
		expect(response.headers.get('vary')).toBe('Accept');
		expect(await response.text()).toBe(buildHomeMarkdown());
	});
});
