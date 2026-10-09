import { fireEvent, render, screen } from '@testing-library/react';
import PillButton, { accentFillSx } from './PillButton';

describe('PillButton', () => {
	it('renders its label inside a contained button', () => {
		render(<PillButton>Accept all</PillButton>);

		expect(screen.getByRole('button', { name: 'Accept all' })).toHaveClass('MuiButton-contained');
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
