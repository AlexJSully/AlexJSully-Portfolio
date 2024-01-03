import GeneralLayout from '@layouts/GeneralLayout';
import '@styles/globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Alexander Sullivan's Portfolio & Showcase",
	description: "Alexander Sullivan's Portfolio & Showcase",
};

/** Renders the root layout. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' content='text/html' httpEquiv='Content-Type' />
				<meta content='Alexander Sullivan' name='author' />

				{/* httpEquiv support for cache-control and others */}
				<meta content='max-age=31536000; includeSubDomains; preload' httpEquiv='Strict-Transport-Security' />

				<meta content='English' name='language' />
				<meta content='#131518' name='theme-color' />

				<link color='#1e2227' href='/icon/safari-pinned-tab.svg' rel='mask-icon' />
				<meta content='Masterpiece X' name='application-name' />
				<meta content='/icon/browserconfig.xml' name='msapplication-config' />
				<meta content='#1e2227' name='msapplication-TileColor' />
				<meta content='/icon/mstile-144x144.png' name='msapplication-TileImage' />
			</head>

			<body>
				<GeneralLayout>{children}</GeneralLayout>
			</body>
		</html>
	);
}
