import { render, screen } from '@testing-library/react';
import Banner from './Banner';

describe('Banner', () => {
	it('renders the name in three parts with correct text', () => {
		render(<Banner />);
		// The heading has aria-label 'Name', not the visible name as accessible name
		const heading = screen.getByRole('heading', { name: 'Name' });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Alexander');
		expect(heading).toHaveTextContent('Joo-Hyun');
		expect(heading).toHaveTextContent('Sullivan');
		expect(screen.getByText((_content, element) => element?.textContent === 'Joo-Hyun')).toHaveStyle({
			whiteSpace: 'nowrap',
		});
	});

	it('renders the subtitle', () => {
		render(<Banner />);
		expect(screen.getByText(/software developer & bioinformatician/i)).toBeInTheDocument();
	});
});
