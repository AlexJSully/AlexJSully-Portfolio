import { render } from '@testing-library/react';
import * as Icons from './icons';

describe('Icon exports', () => {
	it.each(Object.entries(Icons).map(([name, Icon]) => ({ name, Icon })))(
		'$name forwards props to an SVG',
		({ Icon }) => {
			const { container } = render(<Icon data-custom='foo' />);
			const svg = container.querySelector('svg');

			expect(svg).toBeInTheDocument();
			expect(svg).toHaveAttribute('data-custom', 'foo');
		},
	);
});
