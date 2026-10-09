import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NotFound from './not-found';

jest.mock('next/navigation', () => ({
	...jest.requireActual('next/navigation'),
	usePathname: jest.fn(),
}));

describe('NotFound', () => {
	const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders 404 page and navigation', () => {
		mockUsePathname.mockReturnValue('/some-path');
		render(<NotFound />);

		expect(screen.getByRole('heading', { name: /page not found/i })).toHaveTextContent('404');
		expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
		expect(screen.getByText('/some-path')).toBeInTheDocument();
	});
});
