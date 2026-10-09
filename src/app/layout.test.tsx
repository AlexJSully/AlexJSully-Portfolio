import structuredData from '@data/structuredData';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

// This repository's wrappers around the Firebase and Sentry SDKs, so rendering does not start live analytics.
jest.mock('@configs/firebase', () => ({ init: jest.fn(), logAnalyticsEvent: jest.fn() }));
jest.mock('@configs/sentry', () => ({ startErrorReporting: jest.fn() }));

// A third-party SDK that reports to Vercel over the network.
jest.mock('@vercel/speed-insights/next', () => ({ SpeedInsights: () => null }));

/** Whether a console error call is React's warning that the rendered `<html>` sits inside the test container. */
function isHtmlNestingWarning([format, element]: unknown[]): boolean {
	return typeof format === 'string' && format.includes('cannot be a child of') && element === '<html>';
}

describe('RootLayout', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Rendering a whole document inside the test container makes React warn that <html> cannot sit in a <div>.
		const originalError = console.error;
		jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (!isHtmlNestingWarning(args)) {
				originalError(...args);
			}
		});

		render(
			<RootLayout>
				<p>Page content</p>
			</RootLayout>,
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('embeds the structured data as JSON-LD', () => {
		const script = document.querySelector('script[type="application/ld+json"]');

		expect(JSON.parse(script?.textContent ?? '')).toEqual(structuredData);
	});

	it('renders the page passed in', () => {
		expect(screen.getByText('Page content')).toBeInTheDocument();
	});
});
