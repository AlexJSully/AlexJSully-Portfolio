import StarsBackground from '@components/Stars/StarsBackground';
import ConsentBanner from '@components/consent/banner/ConsentBanner';
import Footer from '@components/footer/Footer';
import Navbar from '@components/navbar/Navbar';
import PolicyDialogGate from '@components/policy/gate/PolicyDialogGate';
import { MAIN_CONTENT_ID } from '@constants/routes';
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
			{/* First in the document, so keyboard and screen-reader users reach the consent choices before the page. */}
			<ConsentBanner />

			<Navbar />

			{/* Named, so a closing overlay can hand focus back to the page itself; the overlay makes it focusable then. */}
			<main id={MAIN_CONTENT_ID} style={{ flex: '1 0 auto', outline: 'none' }}>
				{children}

				<StarsBackground />

				<PolicyDialogGate />
			</main>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}
