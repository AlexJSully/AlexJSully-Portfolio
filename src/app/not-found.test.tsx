import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NotFound from './not-found';

// Helper to mock usePathname
jest.mock('next/navigation', () => ({
	...jest.requireActual('next/navigation'),
	usePathname: jest.fn(),
}));

const realLocation = window.location;

describe('NotFound', () => {
	afterEach(() => {
		// @ts-expect-error: Overriding window.location for test cleanup
		globalThis.window.location = realLocation;
		jest.clearAllMocks();
	});

	it('renders 404 page and navigation', () => {
		(usePathname as jest.Mock).mockReturnValue('/some-path');
		render(<NotFound />);

		expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
		expect(screen.getByText('404')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
		expect(screen.getByText('/some-path')).toBeInTheDocument();
	});
});
