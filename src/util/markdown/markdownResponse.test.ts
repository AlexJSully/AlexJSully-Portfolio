/** @jest-environment node */
import { markdownResponse } from './markdownResponse';

describe('markdownResponse', () => {
	it('serves the body as UTF-8 Markdown that varies by Accept', async () => {
		const response = markdownResponse('# Title\n');

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
		expect(response.headers.get('vary')).toBe('Accept');
		expect(await response.text()).toBe('# Title\n');
	});

	it('carries the status it is given', () => {
		expect(markdownResponse('# Missing\n', 404).status).toBe(404);
	});
});
