import ThemeRegistry from '@components/ThemeRegistry';
import ConsentedServices from '@components/consent/services/ConsentedServices';
import seoKeywords from '@data/keywords';
import profile from '@data/profile';
import structuredData from '@data/structuredData';
import GeneralLayout from '@layouts/GeneralLayout';
import '@styles/globals.scss';
import { colors } from '@styles/tokens';
import { absoluteUrl } from '@util/absoluteUrl';
import type { Metadata, Viewport } from 'next';

const metadataValues = {
	description:
		"AlexJSully's Portfolio & Showcase | Software Developer & Bioinformatician - Explore my featured projects, publications and social media links.",
	name: profile.name,
	title: "AlexJSully's Portfolio & Showcase",
	url: profile.url,
};

/** Site-wide metadata Next.js renders into `<head>`: titles, SEO, icons, and social cards. */
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
				url: absoluteUrl('/icon/resoc.png'),
				width: 1529,
				height: 1021,
				alt: metadataValues.title,
			},
		],
		locale: 'en',
		title: metadataValues.title,
		type: 'website',
		url: metadataValues.url,
		siteName: metadataValues.title,
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
		other: [
			{
				rel: 'apple-touch-icon-precomposed',
				url: '/icon/apple-touch-icon-precomposed.png',
			},
			{
				rel: 'mask-icon',
				url: '/icon/safari-pinned-tab.svg',
			},
		],
	},

	// Web manifest
	manifest: '/manifest.webmanifest',

	// Twitter
	twitter: {
		card: 'summary_large_image',
		title: metadataValues.title,
		description: metadataValues.description,
		creator: '@AlexJSully',
		images: [absoluteUrl('/icon/resoc.png')],
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
		'msapplication-TileColor': colors.surface,
		'msapplication-TileImage': '/icon/mstile-144x144.png',
	},
};

/** Viewport and theme-colour settings Next.js renders into `<head>`. */
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	colorScheme: 'dark',
	themeColor: colors.page,
};

/** Renders the root layout. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<section>
					{/* JSON-LD */}
					<script
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(structuredData),
						}}
						type='application/ld+json'
					/>
				</section>

				<ThemeRegistry>
					<GeneralLayout>{children}</GeneralLayout>
				</ThemeRegistry>

				<ConsentedServices />
			</body>
		</html>
	);
}
