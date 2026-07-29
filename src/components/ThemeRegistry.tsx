'use client';

import { ThemeProvider } from '@mui/material/styles';
import theme from '@styles/theme';
import { ReactElement, ReactNode } from 'react';

interface ThemeRegistryProps {
	/** The children to render inside the theme provider. */
	children: ReactNode;
}

/**
 * Provides the MUI theme to the app.
 *
 * `ThemeProvider` requires a client boundary, so children are passed through as a prop to keep
 * server-rendered subtrees on the server.
 */
export default function ThemeRegistry({ children }: Readonly<ThemeRegistryProps>): ReactElement {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
