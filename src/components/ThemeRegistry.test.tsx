import { useTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import ThemeRegistry from './ThemeRegistry';

/** Reports the breakpoints visible to descendants of the provider. */
function BreakpointProbe() {
	const theme = useTheme();

	return (
		<>
			<span data-testid='keys'>{theme.breakpoints.keys.join(',')}</span>
			<span data-testid='xxl'>{theme.breakpoints.up('xxl')}</span>
		</>
	);
}

describe('ThemeRegistry', () => {
	it('renders its children', () => {
		render(
			<ThemeRegistry>
				<p>child content</p>
			</ThemeRegistry>,
		);

		expect(screen.getByText('child content')).toBeInTheDocument();
	});

	it('exposes the ultra-wide breakpoint to descendants', () => {
		render(
			<ThemeRegistry>
				<BreakpointProbe />
			</ThemeRegistry>,
		);

		// Anchored, because `createTheme` replaces `breakpoints.values` wholesale: a dropped default
		// breaks MUI internals that hardcode `up('sm')`, and an added key changes the cascade.
		expect(screen.getByTestId('keys')).toHaveTextContent(/^xs,sm,md,lg,xl,xxl$/);
		expect(screen.getByTestId('xxl')).toHaveTextContent(/^@media \(min-width:2560px\)$/);
	});
});
