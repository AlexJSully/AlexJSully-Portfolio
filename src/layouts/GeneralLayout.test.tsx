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
		expect(screen.getByRole('region', { name: 'Your privacy choices' })).toBeInTheDocument(); // ConsentBanner
	});

	it('places the consent banner before the navbar, so keyboard users reach it first', () => {
		render(
			<GeneralLayout>
				<div />
			</GeneralLayout>,
		);

		const banner = screen.getByRole('region', { name: 'Your privacy choices' });
		const navbar = screen.getByRole('banner');

		expect(banner.compareDocumentPosition(navbar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('wraps the page in a named main landmark that focus can return to, without a permanent tabindex', () => {
		render(
			<GeneralLayout>
				<div />
			</GeneralLayout>,
		);

		expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
		expect(screen.getByRole('main')).not.toHaveAttribute('tabindex');
	});
});
