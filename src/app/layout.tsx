import seoKeywords from '@data/keywords';
import GeneralLayout from '@layouts/GeneralLayout';
import '@styles/globals.scss';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import Head from 'next/head';

const metadataValues = {
	description:
		"Alexander Sullivan's Portfolio & Showcase | Software Developer & Bioinformatician - Explore my featured projects, publications and social media links.",
	name: 'Alexander Joo-Hyun Sullivan',
	title: "Alexander Sullivan's Portfolio & Showcase",
	url: 'https://alexjsully.me/',
};
export const metadata: Metadata = {
	// General
	title: {
		template: `%s | ${metadataValues.title}`,
		default: metadataValues.title,
	},
	description: metadataValues.description,
	applicationName: metadataValues.title,
	referrer: 'origin',

	// SEO
	keywords: seoKeywords,
	category: 'technology',

	// Author
	authors: [
		{
			name: metadataValues.name,
			url: metadataValues.url,
		},
	],
	creator: metadataValues.name,
	publisher: metadataValues.name,

	// OpenGraph
	openGraph: {
		description: metadataValues.description,
		images: [
			{
				url: 'https://alexjsully.me/icon/resoc.png',
				width: 1529,
				height: 1021,
				alt: metadataValues.title,
			},
		],
		locale: 'en',
		title: metadataValues.title,
		type: 'website',
		url: metadataValues.url,
	},

	// metadataBase
	metadataBase: new URL(metadataValues.url),
	alternates: {
		canonical: '/',
	},

	// Robots
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
		indexifembedded: true,
	},

	// Icons
	icons: {
		icon: '/icon/favicon.ico',
		shortcut: '/icon/apple-touch-icon.png',
		apple: '/icon/apple-touch-icon.png',
		other: {
			rel: 'apple-touch-icon-precomposed',
			url: '/icon/apple-touch-icon-precomposed.png',
		},
	},

	// Web manifest
	manifest: 'https://alexjsully.me/manifest.webmanifest',

	// Twitter
	twitter: {
		card: 'summary_large_image',
		title: metadataValues.title,
		description: metadataValues.description,
		creator: '@AlexJSully',
		images: ['https://alexjsully.me/icon/resoc.png'],
	},

	// Facebook
	facebook: {
		appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? '',
	},

	// Apple Web App
	appleWebApp: {
		capable: true,
		title: metadataValues.title,
		startupImage: '/icon/apple-touch-icon.png',
		statusBarStyle: 'black-translucent',
	},

	// Custom Meta Tags
	other: {
		'msapplication-config': '/icon/browserconfig.xml',
		'msapplication-TileColor': '#1e2227',
		'msapplication-TileImage': '/icon/mstile-144x144.png',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	colorScheme: 'dark',
	themeColor: '#131518',
};

const jsonLD = [
	{
		'@context': 'https://schema.org/',
		'@type': 'Person',
		name: 'Alexander Joo-Hyun Sullivan',
		url: 'https://alexjsully.me/',
		image: 'https://pbs.twimg.com/profile_images/1443997899378069526/p4e_Vx1Z_400x400.jpg',
		sameAs: [
			'https://alexjsully.me/',
			'https://app.masterpiecex.com/user/alexjsully',
			'https://bsky.app/profile/alexjsully.bsky.social',
			'https://github.com/AlexJSully',
			'https://orcid.org/0000-0002-4463-4473',
			'https://scholar.google.ca/citations?user=1nr3eaAAAAAJ&hl=en',
			'https://twitter.com/alexjsully',
			'https://www.instagram.com/alex.j.sullly/',
			'https://www.linkedin.com/in/alexanderjsullivan/',
			'https://www.threads.net/@alex.j.sullly',
			'https://www.twitch.tv/alexjsully',
		],
		jobTitle: 'Software Developer',
		worksFor: {
			'@type': 'Organization',
			name: 'Verily',
		},
		gender: 'male',
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'Canada',
		},
		birthDate: '1995-02-14',
		alumniOf: 'University of Toronto',
		birthPlace: 'Ontario, Canada',
		honorificPrefix: 'Mr.',
		honorificSuffix: 'MSc',
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
		name: "Alexander Sullivan's Portfolio & Showcase",
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
		url: 'https://alexjsully.me/',
	},
];

/** Renders the root layout. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<Head>
				{/* httpEquiv support for cache-control and others */}
				<meta content='max-age=31536000; includeSubDomains; preload' httpEquiv='Strict-Transport-Security' />

				{/* JSON-LD */}
				<script
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLD),
					}}
					type='application/ld+json'
				/>
			</Head>

			<body>
				<GeneralLayout>{children}</GeneralLayout>

				<SpeedInsights />
			</body>
		</html>
	);
}
