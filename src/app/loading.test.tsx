import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('Loading', () => {
	it('renders a loading spinner with accessibility label', () => {
		render(<Loading />);
		expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
	});
});
