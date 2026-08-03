import { createTheme } from '@mui/material/styles';

/**
 * Registers the custom `xxl` (ultra-wide) breakpoint with MUI's type system.
 *
 * This augmentation must live in a file with top-level imports: a standalone `.d.ts` with no
 * imports is treated as an ambient module declaration and silently fails to merge.
 */
declare module '@mui/material/styles' {
	// eslint-disable-next-line no-unused-vars
	interface BreakpointOverrides {
		xxl: true;
	}
}

/**
 * The application theme.
 *
 * Extends MUI's default breakpoints with an ultra-wide `xxl` step so layouts can add columns past
 * `xl` (1536px), which otherwise extends to infinity. All six values must be listed, because
 * `createTheme` replaces `breakpoints.values` wholesale rather than merging it with the defaults.
 */
const theme = createTheme({
	breakpoints: {
		values: {
			lg: 1200,
			md: 900,
			sm: 600,
			xl: 1536,
			xs: 0,
			xxl: 2560,
		},
	},
});

export default theme;
