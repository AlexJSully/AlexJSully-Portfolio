'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';

// Custom ThemeProvider with ssrMatchMedia support
export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
	// Only run on client
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	// Create theme with ssrMatchMedia
	const theme = React.useMemo(() => {
		if (typeof window === 'undefined') {
			return createTheme({
				components: {
					MuiUseMediaQuery: {
						defaultProps: {
							ssrMatchMedia: (query: string) => ({
								matches: false, // fallback for SSR
							}),
						},
					},
				},
			});
		}
		return createTheme({
			components: {
				MuiUseMediaQuery: {
					defaultProps: {
						ssrMatchMedia: (query: string) => ({
							matches: window.matchMedia(query).matches,
						}),
					},
				},
			},
		});
	}, []);

	// Prevent hydration mismatch
	if (!mounted) return null;

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
