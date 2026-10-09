/** Site paths served by a page, a route handler, or a static file, named once for every builder and the proxy. */
export const ROUTES = {
	/** The single HTML page. */
	home: '/',
	/** The home page as Markdown. */
	markdownHome: '/index.md',
	/** The llmstxt.org index for language models. */
	llmsTxt: '/llms.txt',
	/** The XML sitemap in `public/`. */
	sitemap: '/sitemap.xml',
} as const;

/** ID of the `<main>` element, which receives focus when a closing overlay has nowhere better to return it. */
export const MAIN_CONTENT_ID = 'main-content';

/** Fragments on the home page that a redirect or a link targets: an element ID, or a panel the fragment opens. */
export const SECTION_IDS = {
	/** The footer's contact block. */
	contact: 'contact',
	/** The fragment that opens the privacy and cookie policy dialog. */
	policy: 'privacy',
	/** The fragment that reopens the consent banner with its switches showing. */
	cookieSettings: 'cookie-settings',
} as const;

/** Link that opens the privacy and cookie policy dialog from any page. */
export const POLICY_HREF = `${ROUTES.home}#${SECTION_IDS.policy}`;

/** Conventional paths for a privacy or cookie policy; each opens the policy dialog on the home page. */
export const POLICY_PATHS = [
	'/privacy',
	'/policy',
	'/cookie',
	'/cookies',
	'/privacy-policy',
	'/cookie-policy',
] as const;

/**
 * Temporary redirects the proxy answers before anything else, from a conventional path to the part of the single page
 * that answers it.
 */
export const REDIRECTS: Readonly<Record<string, string>> = {
	'/about': ROUTES.home,
	'/contact': `${ROUTES.home}#${SECTION_IDS.contact}`,
	...Object.fromEntries(POLICY_PATHS.map((path) => [path, POLICY_HREF])),
};

/** Alternate paths the proxy rewrites to an existing route, serving the same response under both. */
export const REWRITES: Readonly<Record<string, string>> = {
	'/llm.txt': ROUTES.llmsTxt,
};
