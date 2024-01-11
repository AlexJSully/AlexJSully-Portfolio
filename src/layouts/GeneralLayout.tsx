import StarsBackground from '@components/Stars/StarsBackground';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import { ReactElement } from 'react';

interface GeneralLayoutProps {
	/** The children to render inside the layout. */
	children: React.ReactNode;
}

/** Renders the general layout. */
export default function GeneralLayout({ children }: Readonly<GeneralLayoutProps>): ReactElement {
	return (
		<div
			id='content'
			style={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				scrollBehavior: 'smooth',
			}}
		>
			<Navbar />

			<main style={{ flex: '1 0 auto' }}>
				{children}

				<StarsBackground />
			</main>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}
