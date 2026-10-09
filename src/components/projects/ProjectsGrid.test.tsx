import ThemeRegistry from '@components/ThemeRegistry';
import { DELAYS } from '@constants/index';
import projects from '@data/projects';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ACCEPT_ALL, ESSENTIAL_ONLY, saveConsent } from '@util/consent/consentStore';
import ProjectsGrid from './ProjectsGrid';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

const showcaseProject = projects.find((candidate) => candidate.showcase);
const hiddenProject = projects.find((candidate) => !candidate.showcase);

if (!showcaseProject || !hiddenProject) {
	throw new Error('ProjectsGrid tests need one showcase project and one project behind View More.');
}

describe('ProjectsGrid', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	/** The card link for a project, including one hidden behind View More. */
	const cardLink = (name: string): HTMLElement =>
		screen.getByRole('link', { name: `Project: ${name}`, hidden: true });

	beforeEach(() => {
		jest.clearAllMocks();

		render(<ProjectsGrid />);
	});

	it('renders the ProjectsGrid title', () => {
		const title = screen.getByRole('heading', { name: /Projects/i });

		expect(title).toBeInTheDocument();
	});

	it('shows showcase projects and hides the rest until View More is clicked', () => {
		expect(cardLink(showcaseProject.name)).toBeVisible();
		expect(cardLink(hiddenProject.name)).not.toBeVisible();
	});

	it('logs analytics when a project card is hovered', () => {
		fireEvent.mouseEnter(cardLink(showcaseProject.name));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith(`project-${showcaseProject.id}`, {
			name: `project-${showcaseProject.id}`,
			type: 'hover',
		});
	});

	it('logs analytics when a project card is clicked', () => {
		fireEvent.click(cardLink(showcaseProject.name));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith(`project-${showcaseProject.id}`, {
			name: `project-${showcaseProject.id}`,
			type: 'click',
		});
	});

	it('toggles view more/less projects', () => {
		fireEvent.click(screen.getByRole('button', { name: /view more projects/i }));

		expect(cardLink(hiddenProject.name)).toBeVisible();
		expect(screen.getByRole('heading', { name: /all projects/i })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: /show less projects/i }));

		expect(cardLink(hiddenProject.name)).not.toBeVisible();
		expect(screen.getByRole('heading', { name: /featured projects/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /view more projects/i })).toBeInTheDocument();
	});
});

describe('ProjectsGrid video previews', () => {
	const project = projects.find((candidate) => candidate.youtubeURL && candidate.showcase);

	if (!project?.youtubeURL) {
		throw new Error('ProjectsGrid video preview tests need a showcase project with a YouTube URL.');
	}

	const { name, youtubeURL } = project;

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		Reflect.deleteProperty(navigator, 'connection');
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	/** Hovers the project card long enough for its preview to load. */
	function hoverProject() {
		render(<ProjectsGrid />);
		fireEvent.mouseEnter(screen.getByRole('link', { name: `Project: ${name}` }));
		act(() => {
			jest.advanceTimersByTime(DELAYS.PROJECT_HOVER_VIDEO);
		});
	}

	it('plays the YouTube preview on hover once Embedded videos is allowed', () => {
		saveConsent(ACCEPT_ALL);

		hoverProject();

		expect(screen.getByLabelText(`YouTube video for ${name}`)).toHaveAttribute('src', `${youtubeURL}&autoplay=1`);
	});

	it('loads the YouTube preview without autoplay while the visitor is saving data', () => {
		// navigator.connection is a browser API jsdom omits.
		Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
		saveConsent(ACCEPT_ALL);

		hoverProject();

		expect(screen.getByLabelText(`YouTube video for ${name}`)).toHaveAttribute('src', youtubeURL);
	});

	it('keeps the thumbnail on hover while Embedded videos is refused', () => {
		saveConsent(ESSENTIAL_ONLY);

		hoverProject();

		expect(screen.queryByLabelText(`YouTube video for ${name}`)).not.toBeInTheDocument();
		expect(screen.getByRole('img', { name: `Thumbnail image for ${name}` })).toBeInTheDocument();
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

		const { container } = render(
			<ThemeRegistry>
				<ProjectsGrid />
			</ThemeRegistry>,
		);

		// Earlier renders leave their rules in the document, and Emotion's shared cache never reinserts a rule it has
		// inserted, so only rules for a class this render carries are read.
		const classNames = new Set(
			Array.from(container.querySelectorAll('[class]')).flatMap((node) => [...node.classList]),
		);
		rules = collectRules().filter((rule) => [...classNames].some((className) => rule.includes(`.${className}`)));
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
	] as const)('renders $expectedColumns columns from $minWidth ($breakpoint)', ({ expectedColumns, minWidth }) => {
		// A card spans `gridColumns / expectedColumns` slots, so 6 columns is a size of 2 out of 12.
		expect(sizeAt(rules, minWidth)).toEqual([gridColumns / expectedColumns]);
	});

	it('widens both max-width caps on ultra-wide screens', () => {
		const ultraWide = rules.filter((rule) => rule.includes('min-width:2560px'));

		expect(ultraWide.some((rule) => rule.includes('max-width: 2560px'))).toBe(true);
		expect(ultraWide.some((rule) => rule.includes('max-width: 90%'))).toBe(true);
	});
});
