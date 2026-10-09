import profile from '@data/profile';
import socials from '@data/socials';
import { absoluteUrl } from '@util/absoluteUrl';

/** Stable `@id` of the Person node, so other nodes can reference it. */
const personId = `${profile.url}#person`;

/** Contact point shared by the Person and the Organization. */
const contactPoint = {
	'@type': 'ContactPoint',
	contactType: 'professional inquiries',
	email: profile.email,
	url: profile.url,
	availableLanguage: 'English',
};

/** Schema.org JSON-LD graph the root layout renders into every page. */
const structuredData = [
	{
		'@context': 'https://schema.org/',
		'@type': 'Person',
		'@id': personId,
		name: profile.name,
		description: profile.description,
		url: profile.url,
		email: profile.email,
		contactPoint,
		image: 'https://pbs.twimg.com/profile_images/1443997899378069526/p4e_Vx1Z_400x400.jpg',
		sameAs: [profile.url, ...socials.map((social) => social.url), ...Object.values(profile.externalProfiles)],
		jobTitle: profile.jobTitle,
		worksFor: {
			'@type': 'Organization',
			name: profile.employer,
		},
		gender: 'male',
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'Canada',
		},
		alumniOf: profile.alumniOf,
		birthPlace: 'Canada',
		honorificPrefix: 'Mr.',
		honorificSuffix: 'MSc',
	},
	{
		'@context': 'https://schema.org/',
		'@type': 'Organization',
		'@id': `${profile.url}#organization`,
		name: profile.brand,
		description: `${profile.brand} is the personal portfolio and professional brand of ${profile.name}, ${profile.tagline.toLowerCase()}.`,
		url: profile.url,
		email: profile.email,
		logo: absoluteUrl('/icon/apple-touch-icon.png'),
		founder: { '@id': personId },
		contactPoint,
		address: {
			'@type': 'PostalAddress',
			addressCountry: profile.addressCountry,
		},
	},
	{
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What projects have Alexander Sullivan worked on?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Worked as a Software Developer at Verily. Notable previous projects include: Masterpiece X & Masterpiece X - Generate with Masterpiece Studio, Impact Depth - a tool to visualize citation impact of a scientific publication of interest, GAIA - a web app to aggregate and synthesis agricultural biological data into a single location & eFP-Seq Browser - an RNA-Seq data exploration tool that shows read map coverage of a gene along with a coloured eFP image (doi.org/10.1111/tpj.14468)',
				},
			},
			{
				'@type': 'Question',
				name: 'What is Alexander Sullivan currently working on?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Worked as a Software Developer at Verily. Additional previous projects include: Masterpiece X & Masterpiece X - Generate with Masterpiece Studio, Impact Depth - a tool to visualize citation impact of a scientific publication of interest, and improving accessibility and performance of GAIA & the eFP-Seq Browser',
				},
			},
			{
				'@type': 'Question',
				name: 'How do I contact Alexander Sullivan?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Easiest way is through my twitter @AlexJSully but you can also reach out to me on LinkedIn.',
				},
			},
			{
				'@type': 'Question',
				name: 'What is the current employment status of Alexander Sullivan?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Currently working with Verily as a Software Developer.',
				},
			},
			{
				'@type': 'Question',
				name: 'Is Alexander Sullivan currently looking for a new job?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Not currently looking for a new job.',
				},
			},
			{
				'@type': 'Question',
				name: 'Does Alexander Sullivan have cats?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes! Quynh (Cathy) Cao and I have two amazing cats named MuMu and JuJu. You can find pictures of them on my twitter: @AlexJSully.',
				},
			},
		],
	},
	{
		'@context': 'https://schema.org/',
		'@type': 'WebPage',
		name: "AlexJSully's Portfolio & Showcase",
		speakable: {
			'@type': 'SpeakableSpecification',
			cssSelector: [
				'h2-description',
				'h3-description',
				'MuiCardContent-root',
				'MuiTypography-root',
				'responsibilities-bullets',
			],
		},
		url: profile.url,
	},
];

export default structuredData;
