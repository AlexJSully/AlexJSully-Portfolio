import { act, fireEvent, render, screen } from '@testing-library/react';
import { ACCEPT_ALL, ESSENTIAL_ONLY, saveConsent } from '@util/consent/consentStore';
import { resetIconMisses } from '@util/linkIcon';
import LinkIcon from './LinkIcon';

/**
 * Finds the decorative mark, which has an empty alt text and so no accessible role.
 * @returns The image element
 */
function mark(): HTMLImageElement {
	return screen.getByTestId('mark').querySelector('img') as HTMLImageElement;
}

/**
 * Renders the mark inside a wrapper the test can find.
 * @param href The link target
 */
function renderMark(href: string) {
	render(
		<span data-testid='mark'>
			<LinkIcon href={href} />
		</span>,
	);
}

describe('LinkIcon', () => {
	afterEach(() => {
		resetIconMisses();
	});

	it('is decorative, with an empty alt text and no referrer sent', () => {
		renderMark('https://github.com/AlexJSully');

		expect(mark()).toHaveAttribute('alt', '');
		expect(mark()).toHaveAttribute('referrerpolicy', 'no-referrer');
	});

	it('renders nothing for a mailto link', () => {
		renderMark('mailto:someone@example.org');

		expect(screen.getByTestId('mark')).toBeEmptyDOMElement();
	});

	it("shows this site's icon for a same-site link", () => {
		renderMark('/#privacy');

		expect(mark()).toHaveAttribute('src', '/icon/favicon.ico');
	});

	it('shows the generated globe for another site while Link icons is refused', () => {
		saveConsent(ESSENTIAL_ONLY);
		renderMark('https://github.com/AlexJSully');

		expect(mark().getAttribute('src')).toMatch(/^data:image\/svg\+xml,/);
	});

	it("shows the linked site's icon once Link icons is allowed", () => {
		saveConsent(ACCEPT_ALL);
		renderMark('https://github.com/AlexJSully');

		expect(mark()).toHaveAttribute('src', 'https://icons.duckduckgo.com/ip3/github.com.ico');
	});

	it('falls back to the globe when the proxy has no icon', () => {
		saveConsent(ACCEPT_ALL);
		renderMark('https://example.org/');

		act(() => {
			fireEvent.error(mark());
		});

		expect(mark().getAttribute('src')).toMatch(/^data:image\/svg\+xml,/);
	});
});
