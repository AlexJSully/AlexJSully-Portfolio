import { render, screen } from '@testing-library/react';
import GeneralLayout from './GeneralLayout';

describe('GeneralLayout', () => {
	it('renders children and all layout components', () => {
		render(
			<GeneralLayout>
				<div data-testid='child-content'>Hello</div>
			</GeneralLayout>,
		);

		expect(screen.getByTestId('child-content')).toBeInTheDocument();
		expect(screen.getByRole('banner')).toBeInTheDocument(); // Navbar
		expect(screen.getByLabelText('Footer')).toBeInTheDocument();
		expect(screen.getByLabelText('Starry background')).toBeInTheDocument();
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});
