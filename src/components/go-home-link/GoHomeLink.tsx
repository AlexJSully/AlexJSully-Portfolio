'use client';

import PillButton, { accentFillSx } from '@components/pill-button/PillButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement, ReactNode } from 'react';

interface GoHomeLinkProps {
	/** The button label. */
	children: ReactNode;
}

/** Renders a pill button linking to the home page, which reloads the page instead when the visitor is already at `/`. */
export default function GoHomeLink({ children }: Readonly<GoHomeLinkProps>): ReactElement {
	const pathname = usePathname();

	return (
		<Link
			aria-label='Go home'
			href='/'
			onClick={() => {
				if (pathname === '/' && typeof window !== 'undefined') {
					window.location.reload();
				}
			}}
			prefetch
			style={{
				cursor: 'pointer',
			}}
		>
			<PillButton aria-label='Go home button' sx={accentFillSx}>
				{children}
			</PillButton>
		</Link>
	);
}
