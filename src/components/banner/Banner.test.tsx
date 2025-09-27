import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Banner from './Banner';

describe('Banner', () => {
	it('renders the name in three parts with correct text', () => {
		render(<Banner />);
		// The heading has aria-label 'Name', not the visible name as accessible name
		const heading = screen.getByRole('heading', { name: 'Name' });
		expect(heading).toBeInTheDocument();
		// Check for each part in the visible text
		expect(heading).toHaveTextContent('Alexander');
		expect(heading).toHaveTextContent('Joo-Hyun');
		expect(heading).toHaveTextContent('Sullivan');
	});

	it('renders the subtitle', () => {
		render(<Banner />);
		expect(screen.getByText(/software developer & bioinformatician/i)).toBeInTheDocument();
	});

	it('has accessible heading and aria-label', () => {
		render(<Banner />);
		const heading = screen.getByRole('heading', { name: 'Name' });
		expect(heading).toHaveAttribute('aria-label', 'Name');
	});

	it('has proper layout structure', () => {
		render(<Banner />);
		const heading = screen.getByRole('heading', { name: 'Name' });
		expect(heading.parentElement).toBeInTheDocument();
	});
});
