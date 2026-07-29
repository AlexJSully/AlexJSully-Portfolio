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

		expect(screen.getByTestId('keys')).toHaveTextContent('xs,sm,md,lg,xl,xxl');
		expect(screen.getByTestId('xxl')).toHaveTextContent('@media (min-width:2560px)');
	});

	it('keeps the default breakpoints intact', () => {
		render(
			<ThemeRegistry>
				<BreakpointProbe />
			</ThemeRegistry>,
		);

		// `createTheme` replaces `breakpoints.values` wholesale, so a missing default would silently
		// break MUI internals that hardcode `up('sm')`.
		expect(screen.getByTestId('keys')).toHaveTextContent('xs,sm,md,lg,xl');
	});
});
