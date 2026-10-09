import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import GoHomeLink from './GoHomeLink';

jest.mock('next/navigation', () => ({
	...jest.requireActual('next/navigation'),
	usePathname: jest.fn(),
}));

/** The console error jsdom raises for `window.location.reload()`, a navigation it does not implement. */
const reloadReport = expect.objectContaining({ message: expect.stringContaining('Not implemented: navigation') });

/** Whether a console error call is jsdom's report of a reload. */
function isReloadReport([first]: unknown[]): boolean {
	return (
		typeof first === 'object' &&
		first !== null &&
		String(Reflect.get(first, 'message')).includes('Not implemented: navigation')
	);
}

describe('GoHomeLink', () => {
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
	let consoleError: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		jest.clearAllMocks();

		// jsdom makes `window.location` and its `reload` non-configurable, so the console report is how a reload shows.
		const originalError = console.error;
		consoleError = jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
			if (!isReloadReport(args)) {
				originalError(...args);
			}
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders its label in a link named "Go home" to the home page', () => {
		mockUsePathname.mockReturnValue('/some-path');
		render(<GoHomeLink>Go back home!</GoHomeLink>);

		const link = screen.getByRole('link', { name: 'Go home' });

		expect(link).toHaveAttribute('href', '/');
		expect(link).toHaveTextContent('Go back home!');
	});

	it('reloads the page when clicked on the home page', () => {
		mockUsePathname.mockReturnValue('/');
		render(<GoHomeLink>Go Home</GoHomeLink>);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).toHaveBeenCalledWith(reloadReport);
	});

	it('does not reload when clicked on any other path', () => {
		mockUsePathname.mockReturnValue('/some-path');
		render(<GoHomeLink>Go Home</GoHomeLink>);

		fireEvent.click(screen.getByRole('link', { name: 'Go home' }));

		expect(consoleError).not.toHaveBeenCalledWith(reloadReport);
	});
});
