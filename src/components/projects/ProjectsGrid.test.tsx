import ThemeRegistry from '@components/ThemeRegistry';
import theme from '@styles/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsGrid from './ProjectsGrid';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('ProjectsGrid', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<ProjectsGrid />);
	});

	it('renders the ProjectsGrid title', () => {
		const title = screen.getByRole('heading', { name: /Projects/i });

		expect(title).toBeInTheDocument();
	});

	it('renders at least one project card', () => {
		const projectCards = screen.getAllByTestId(/project-.*-grid/);

		expect(projectCards.length).toBeGreaterThan(0);
	});

	it('logs analytics on project hover and click', () => {
		const projectCards = screen.getAllByTestId(/project-.*-grid/);

		fireEvent.mouseEnter(projectCards[0]);
		fireEvent.mouseLeave(projectCards[0]);

		const projectLinks = screen.getAllByRole('link', { name: /Project:/i });

		fireEvent.click(projectLinks[0]);

		expect(mockLogAnalyticsEvent).toHaveBeenCalled();
	});

	it('toggles view more/less projects', () => {
		const toggleButton = screen.getByRole('button', { name: /view more projects/i });

		expect(toggleButton).toBeInTheDocument();

		fireEvent.click(toggleButton);

		expect(screen.getByRole('button', { name: /show less projects/i })).toBeInTheDocument();
	});

	it('has accessible links and thumbnails for all projects', () => {
		const projectLinks = screen.getAllByRole('link', { name: /Project:/i });

		expect(projectLinks.length).toBeGreaterThan(0);

		const thumbnails = screen.getAllByRole('img', { name: /thumbnail image for/i });

		expect(thumbnails.length).toBeGreaterThan(0);
	});
});

describe('ProjectsGrid responsive columns', () => {
	// MUI's default container width, and the divisor every card size derives from.
	const gridColumns = 12;

	const collectRules = (): string[] => {
		const rules: string[] = [];

		Array.from(document.styleSheets).forEach((sheet) => {
			try {
				Array.from(sheet.cssRules).forEach((rule) => rules.push(rule.cssText));
			} catch {
				// Cross-origin sheets are not readable; none are expected in jsdom.
			}
		});

		return rules;
	};

	// Parses the card's `size` back out of the `width: calc(...)` rule Emotion emits for a breakpoint.
	const sizeAt = (rules: string[], minWidth: string): number[] => {
		const matched = rules
			.filter((rule) => rule.includes(`min-width:${minWidth}`) && rule.includes('width: calc(100% *'))
			.join('\n')
			.match(/calc\(100% \* (\d+)/g);

		return [...new Set(matched ?? [])].map((match) => Number(match.replace('calc(100% * ', '')));
	};

	let rules: string[];

	beforeEach(() => {
		jest.clearAllMocks();

		render(
			<ThemeRegistry>
				<ProjectsGrid />
			</ThemeRegistry>,
		);

		rules = collectRules();
	});

	it('renders a 12 column grid container', () => {
		expect(rules.some((rule) => rule.includes(`--Grid-parent-columns: ${gridColumns}`))).toBe(true);
	});

	it.each([
		{ breakpoint: 'sm', expectedColumns: 2, minWidth: '600px' },
		{ breakpoint: 'md', expectedColumns: 3, minWidth: '900px' },
		{ breakpoint: 'lg', expectedColumns: 3, minWidth: '1200px' },
		{ breakpoint: 'xl', expectedColumns: 4, minWidth: '1536px' },
		{ breakpoint: 'xxl', expectedColumns: 6, minWidth: '2560px' },
	] as const)(
		'renders $expectedColumns columns from $minWidth ($breakpoint)',
		({ breakpoint, expectedColumns, minWidth }) => {
			// A card spans `gridColumns / expectedColumns` slots, so 6 columns is a size of 2 out of 12.
			expect(sizeAt(rules, minWidth)).toEqual([gridColumns / expectedColumns]);
			expect(theme.breakpoints.up(breakpoint)).toBe(`@media (min-width:${minWidth})`);
		},
	);

	it('widens both max-width caps on ultra-wide screens', () => {
		const ultraWide = rules.filter((rule) => rule.includes('min-width:2560px'));

		expect(ultraWide.some((rule) => rule.includes('max-width: 2560px'))).toBe(true);
		expect(ultraWide.some((rule) => rule.includes('max-width: 90%'))).toBe(true);
	});
});
