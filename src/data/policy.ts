import profile from '@data/profile';
import { CONSENT_COOKIE, CONSENT_MAX_AGE_DAYS } from '@util/consent/consentStore';

/** A paragraph of text. */
interface ParagraphBlock {
	/** Discriminator. */
	type: 'paragraph';
	/** The text; a Markdown-style `[label](url)` within it renders as a link, as {@link INLINE_LINK} matches. */
	text: string;
}

/** A bulleted list. */
interface ListBlock {
	/** Discriminator. */
	type: 'list';
	/** The items, in order; each may hold `[label](url)` links like a paragraph. */
	items: string[];
}

/** A table; a cell matching {@link LINK_CELL} renders as a link. */
interface TableBlock {
	/** Discriminator. */
	type: 'table';
	/** Column headings. */
	columns: string[];
	/** Rows, each with one cell per column. */
	rows: string[][];
}

/**
 * Matches a Markdown-style `[label](url)` link inside paragraph or list text, capturing the label and the URL. Only
 * `https:` and `mailto:` URLs match, as in {@link LINK_CELL}, so no other scheme can become a link.
 */
export const INLINE_LINK = /\[([^\]]+)\]\(((?:https:\/\/|mailto:)[^)\s]+)\)/;

/** Matches a table cell holding only an `https://` or `mailto:` URL, which every renderer turns into a link. */
export const LINK_CELL = /^(https:\/\/|mailto:)\S+$/;

/** The place where the dialog renders the consent switches; text renderers such as Markdown omit it. */
interface ConsentControlsBlock {
	/** Discriminator. */
	type: 'consentControls';
}

/** One block of policy content. */
export type PolicyBlock = ParagraphBlock | ListBlock | TableBlock | ConsentControlsBlock;

/** A titled section of the policy. */
export interface PolicySection {
	/** Section heading. */
	heading: string;
	/** Section body, in reading order. */
	blocks: PolicyBlock[];
}

/** The site's host name, as visitors see it. */
const host = new URL(profile.url).hostname;

/** The contact address as an inline `mailto:` link, which every renderer turns into a link that opens an email. */
const EMAIL_LINK = `[${profile.email}](mailto:${profile.email})`;

/** Retention shared by every item stored on the device until consent is withdrawn or site data is cleared. */
const UNTIL_WITHDRAWN = 'Until you withdraw consent or clear site data';

/** The policy's title, exported alone so the banner and footer can name it without loading the whole policy. */
export const POLICY_TITLE = 'Privacy & cookie policy';

/**
 * The combined privacy and cookie policy, rendered in the policy dialog and in the Markdown representation of the site.
 *
 * Vendor facts and their sources: Vercel runtime logs are kept 1 hour (Hobby) to 1 day (Pro),
 * https://vercel.com/docs/runtime-logs; Sentry keeps errors 30 to 90 days by plan,
 * https://docs.sentry.io/security-legal-pii/security/data-retention-periods; Firebase Performance Monitoring keeps
 * IP-associated events 30 days and other data 60 days, https://firebase.google.com/support/privacy; Google Analytics
 * cookie lifetimes, https://support.google.com/analytics/answer/11397207; DuckDuckGo's IP statement,
 * https://duckduckgo.com/privacy.
 *
 * The text discloses what happens without naming any law or regulation it is written to satisfy.
 */
const policy: {
	/** Policy title. */
	title: string;
	/** ISO date the policy was last updated. */
	lastUpdated: string;
	/** Policy body. */
	sections: PolicySection[];
} = {
	title: POLICY_TITLE,
	lastUpdated: '2026-10-08',
	sections: [
		{
			heading: 'Summary',
			blocks: [
				{
					type: 'paragraph',
					text: `[${host}](${profile.url}) is the personal portfolio of ${profile.name}. It showcases past work and provides no services. This policy describes what happens to information when you visit, and the choices you have.`,
				},
				{
					type: 'list',
					items: [
						'Optional analytics, video, link-icon, and offline features stay off until you choose to allow them.',
						"Analytics data is used only to understand visits to, and use of, this portfolio. It is never used for advertising: advertising storage, ad personalization, Google signals, and cross-device linking are switched off in the site's code.",
						'The site has no advertising, accounts, forms, comments, or payments, and visitor information is not sold.',
					],
				},
			],
		},
		{
			heading: 'Contact',
			blocks: [
				{
					type: 'paragraph',
					text: `This site is run by ${profile.name}. For questions about this policy or your information, email ${EMAIL_LINK}.`,
				},
			],
		},
		{
			heading: 'Your choices',
			blocks: [
				{
					type: 'paragraph',
					text: `On your first visit, a banner asks what to allow. "Accept all" allows every optional purpose below, "Essential only" refuses them all, and "Customize" lets you choose each one. Your choice is kept for ${CONSENT_MAX_AGE_DAYS} days, after which you are asked again.`,
				},
				{ type: 'consentControls' },
				{
					type: 'paragraph',
					text: 'You can change or withdraw consent at any time with "Cookie settings" at the bottom of every page. Withdrawing is as easy as consenting, does not affect what was processed before, and deletes the analytics cookies and offline copies this site stored on your device. You can also block or delete cookies in your browser settings; the site works without them.',
				},
			],
		},
		{
			heading: 'What is collected and why',
			blocks: [
				{
					type: 'paragraph',
					text: 'Optional features run only with your consent. Hosting, error reports, email, and the cookie remembering your choice run without it, because the site needs them to work and to answer you.',
				},
				{
					type: 'table',
					columns: ['Activity', 'Information', 'Kept for', 'Provider'],
					rows: [
						[
							'Hosting: deliver and secure the site',
							'IP address, browser, page requested, and time',
							'Up to 1 day',
							'Vercel',
						],
						[
							'Error reports: find and fix bugs',
							'On a server error: IP address, browser, page requested, and error details',
							'Up to 90 days',
							'Sentry',
						],
						[
							'Consent cookie: remember your choice',
							'What you allowed, and when',
							`${CONSENT_MAX_AGE_DAYS} days`,
							'This site, on your device',
						],
						[
							'Analytics: count visits and see how the site is used',
							'A random device ID, pages viewed, clicks, device and browser, and city-level location (Google does not keep your IP address)',
							'14 months',
							'Google Firebase',
						],
						[
							'Performance: measure page speed',
							'Load timings, device and browser, and country; Speed Insights data is not linked to you',
							'30 to 60 days (Firebase); up to 12 months of reports (Vercel)',
							'Google Firebase and Vercel',
						],
						[
							'Embedded videos: play project previews',
							"IP address, device, and YouTube's cookies, once a preview plays",
							'Set by Google',
							'YouTube (Google)',
						],
						[
							'Offline access: load faster and work offline',
							"Copies of this site's pages, kept only on your device",
							UNTIL_WITHDRAWN,
							'This site, on your device',
						],
						[
							'Link icons: show where links go',
							'IP address and the host name of each linked site; no cookies',
							'Not kept; DuckDuckGo states it does not log IP addresses',
							'DuckDuckGo',
						],
						[
							'Email you send: reply to you',
							'Your email address, name, and message',
							'Until no longer needed to reply',
							"Microsoft, which hosts this site's Outlook.com inbox",
						],
					],
				},
			],
		},
		{
			heading: 'Cookies and device storage',
			blocks: [
				{
					type: 'table',
					columns: ['Name', 'Set by', 'Purpose', 'Category', 'Duration'],
					rows: [
						[
							CONSENT_COOKIE,
							'This site',
							'Remembers your choices and when you made them',
							'Essential',
							`${CONSENT_MAX_AGE_DAYS} days`,
						],
						['_ga', 'Google Analytics', 'Distinguishes visitors', 'Analytics', '2 years'],
						['_ga_<ID>', 'Google Analytics', 'Keeps session state', 'Analytics', '2 years'],
						[
							'firebase-installations-database, firebase-heartbeat-database (IndexedDB)',
							'Firebase',
							'Installation identifier and software development kit health data',
							'Analytics',
							UNTIL_WITHDRAWN,
						],
						[
							'YouTube cookies and local storage, such as yt-remote-device-id',
							'YouTube (Google)',
							"Set by YouTube's player when a preview plays",
							'Embedded videos',
							'Set by Google',
						],
						// The cache names are declared in public/sw.js, which the build does not import.
						[
							'alexjsully-portfolio, runtime-cache (Cache Storage)',
							'This site',
							'Offline copies of pages and files',
							'Offline access',
							UNTIL_WITHDRAWN,
						],
					],
				},
			],
		},
		{
			heading: 'Where your information goes',
			blocks: [
				{
					type: 'paragraph',
					text: 'Hosting, analytics, video, error-monitoring, email, and link-icon providers process information on their own servers, each under its own privacy policy, linked below. DuckDuckGo receives only the host names of linked sites, and states that it does not log IP addresses.',
				},
				{
					type: 'table',
					columns: ['Recipient', 'Information', 'When and how', 'Privacy policy'],
					rows: [
						[
							'Vercel Inc.',
							'Hosting logs; Speed Insights if you allow Analytics',
							'On each visit, over an encrypted connection',
							'https://vercel.com/legal/privacy-policy',
						],
						[
							'Google LLC',
							'Analytics and performance data if you allow Analytics; video data if you allow Embedded videos',
							'While you use the site, over an encrypted connection',
							'https://policies.google.com/privacy',
						],
						[
							'Functional Software, Inc. (Sentry)',
							'Error reports',
							'When a server error occurs, over an encrypted connection',
							'https://sentry.io/privacy/',
						],
						[
							"Microsoft Corporation (Outlook.com, which hosts this site's inbox)",
							'Email you send and the replies to it',
							'When you email, over an encrypted connection',
							'https://privacy.microsoft.com',
						],
						[
							'Duck Duck Go, Inc.',
							'Host names of linked sites, if you allow Link icons',
							'While you view a page with links, over an encrypted connection',
							'https://duckduckgo.com/privacy',
						],
					],
				},
				{
					type: 'paragraph',
					text: 'Allowing Analytics, Embedded videos, or Link icons is also your consent to sending that information to the providers above. You can refuse: the site works without it, except that your visit is not measured, project previews do not play videos, and links show a generated icon.',
				},
			],
		},
		{
			heading: 'How your information is protected',
			blocks: [
				{
					type: 'list',
					items: [
						'Connections to the site are encrypted, and browsers are told to use only encrypted connections.',
						'Security headers help stop the site being framed by other sites and browsers guessing file types.',
						'Only the information listed above is knowingly collected.',
						'Access to the analytics and error dashboards is limited to the site owner.',
					],
				},
			],
		},
		{
			heading: 'Questions about your information',
			blocks: [
				{
					type: 'paragraph',
					text: `You are welcome to email ${EMAIL_LINK} with any question about your information. Analytics data is anonymized and de-identified by the third parties. Withdrawing consent in "Cookie settings" stops further collection.`,
				},
				{
					type: 'paragraph',
					text: 'To learn more about privacy and your rights where you live, these are some of the privacy authorities that publish guidance.',
				},
				{
					type: 'table',
					columns: ['Region', 'Privacy authority', 'Website'],
					rows: [
						['Canada', 'Office of the Privacy Commissioner of Canada', 'https://www.priv.gc.ca'],
						['European Union', 'European Data Protection Board', 'https://www.edpb.europa.eu'],
						['France', "Commission nationale de l'informatique et des libertés", 'https://www.cnil.fr/en'],
						[
							'Germany',
							'Federal Commissioner for Data Protection and Freedom of Information',
							'https://www.bfdi.bund.de',
						],
						['Ireland', 'Data Protection Commission', 'https://www.dataprotection.ie'],
						['United Kingdom', "Information Commissioner's Office", 'https://ico.org.uk'],
						['United States', 'Federal Trade Commission', 'https://consumer.ftc.gov'],
						['California', 'California Privacy Protection Agency', 'https://cppa.ca.gov'],
						[
							'Argentina',
							'Agencia de Acceso a la Información Pública',
							'https://www.argentina.gob.ar/aaip',
						],
						['China', 'Cyberspace Administration of China', 'https://www.cac.gov.cn'],
						[
							'India',
							'Ministry of Electronics and Information Technology',
							'https://www.meity.gov.in/data-protection-framework',
						],
						['South Korea', 'Personal Information Protection Commission', 'https://www.pipc.go.kr'],
						[
							'Vietnam',
							'Ministry of Public Security, personal data protection portal',
							'https://baovedlcn.gov.vn',
						],
					],
				},
			],
		},
		{
			heading: 'Links to other sites',
			blocks: [
				{
					type: 'paragraph',
					text: 'Project, publication, and social links lead to other sites, such as GitHub, LinkedIn, and journal publishers, which have their own privacy policies.',
				},
			],
		},
		{
			heading: 'Changes and language',
			blocks: [
				{
					type: 'paragraph',
					text: `The date at the top shows when this policy was last updated. When a change affects what you are asked to allow, the banner asks you again. This policy is written in English.`,
				},
			],
		},
	],
};

export default policy;
