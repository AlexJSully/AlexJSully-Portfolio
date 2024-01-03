import Footer from '@components/footer/Footer';
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
				scrollBehavior: 'smooth',
			}}
		>
			<main>{children}</main>

			<footer>
				<Footer />
			</footer>
		</div>
	);
}
