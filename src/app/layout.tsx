import '@styles/globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Alexander Sullivan's Portfolio & Showcase",
	description: "Alexander Sullivan's Portfolio & Showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
