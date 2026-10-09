/** Design tokens for the site's single dark appearance, read by the MUI theme and by components needing a value the theme has no key for. */
export const colors = {
	/** Page background behind the starfield. */
	page: '#131518',
	/** Raised surfaces such as cards, dialogs, and the consent banner. */
	surface: '#1e2227',
	/** Controls sitting on a surface, such as project link buttons. */
	raised: '#24272d',
	/** Hover fill for buttons and icon buttons. */
	hover: '#2c3443',
	/** Primary call-to-action fill. */
	accent: '#001ca8',
	/** Primary call-to-action fill on hover. */
	accentHover: '#0041b9',
	/** Inline link text; meets WCAG AA contrast on {@link colors.surface}. */
	link: '#8ab4ff',
	/** Hairline borders and dividers on dark surfaces. */
	border: 'rgba(255, 255, 255, 0.12)',
	/** Body text. */
	text: '#fff',
	/** Secondary text on a surface. */
	textMuted: 'rgba(255, 255, 255, 0.72)',
} as const;

/** Keyboard focus outline for links and buttons on dark surfaces. */
export const focusRing = {
	outline: `2px solid ${colors.link}`,
	outlineOffset: '2px',
} as const;

/** Hides an element visually while leaving it in the accessibility tree, for screen-reader-only text. */
export const visuallyHiddenSx = {
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: '1px',
	margin: '-1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	whiteSpace: 'nowrap',
	width: '1px',
} as const;
