import { Button, type ButtonProps, type SxProps, type Theme, Typography } from '@mui/material';
import { colors, focusRing } from '@styles/tokens';
import type { ReactElement, ReactNode } from 'react';

/** Accent fill and border for a primary call to action; pass it in `sx`. */
export const accentFillSx = {
	backgroundColor: colors.accent,
	border: `3px solid ${colors.accent}`,
	'&:hover': {
		backgroundColor: colors.accentHover,
		border: `3px solid ${colors.accentHover}`,
	},
};

/** The site's button shape: a fixed pill whose fill alone changes on hover. */
const pillSx: SxProps<Theme> = {
	borderRadius: '32px',
	lineHeight: '2rem',
	textTransform: 'none',
	'&:focus-visible': focusRing,
};

interface PillButtonProps extends Omit<ButtonProps, 'children' | 'variant'> {
	/** The button label. */
	children: ReactNode;
}

/**
 * Renders a contained button in the site's pill shape, with a smaller label at `size='small'`. Further `sx` is applied
 * after the shape, so it can add a fill such as {@link accentFillSx}.
 */
export default function PillButton({ children, size, sx, ...props }: Readonly<PillButtonProps>): ReactElement {
	return (
		<Button {...props} size={size} sx={[pillSx, ...(Array.isArray(sx) ? sx : [sx])]} variant='contained'>
			<Typography
				component='span'
				sx={{ color: 'inherit', textDecoration: 'none' }}
				variant={size === 'small' ? 'body2' : 'body1'}
			>
				{children}
			</Typography>
		</Button>
	);
}
