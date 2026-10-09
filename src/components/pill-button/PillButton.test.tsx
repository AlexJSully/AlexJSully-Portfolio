import { fireEvent, render, screen } from '@testing-library/react';
import PillButton, { accentFillSx } from './PillButton';

describe('PillButton', () => {
	it.each([
		{ size: 'medium', fontSize: '1rem' },
		{ size: 'small', fontSize: '0.875rem' },
	] as const)('renders its label at $fontSize when the size is $size', ({ size, fontSize }) => {
		render(<PillButton size={size}>Accept all</PillButton>);

		expect(screen.getByText('Accept all')).toHaveStyle({ fontSize });
	});

	it('renders a contained button, filled with the primary colour when no sx sets one', () => {
		render(<PillButton>Accept all</PillButton>);

		const button = screen.getByRole('button', { name: 'Accept all' });

		// MUI fills each variant through its own custom property, which jsdom leaves unresolved.
		expect(button).toHaveStyle({ backgroundColor: 'var(--variant-containedBg)' });
		expect(getComputedStyle(button).getPropertyValue('--variant-containedBg')).toBe('#1976d2');
	});

	it('forwards props such as onClick, aria-label, and sx', () => {
		const onClick = jest.fn();
		render(
			<PillButton aria-label='Email me' onClick={onClick} sx={accentFillSx}>
				Email
			</PillButton>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Email me' }));

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('button', { name: 'Email me' })).toHaveStyle({ backgroundColor: '#001ca8' });
	});

	it('keeps the pill shape and sentence case under further sx', () => {
		render(<PillButton sx={[accentFillSx, { minHeight: 44 }]}>Save choices</PillButton>);

		expect(screen.getByRole('button', { name: 'Save choices' })).toHaveStyle({
			borderRadius: '32px',
			minHeight: '44px',
			textTransform: 'none',
		});
	});
});
