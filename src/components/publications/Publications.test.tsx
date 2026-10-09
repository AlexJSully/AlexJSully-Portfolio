import publications from '@data/publications';
import { fireEvent, render, screen } from '@testing-library/react';
import Publications from './Publications';

// Mock Firebase analytics so log calls can be asserted.
jest.mock('@configs/firebase', () => ({
	logAnalyticsEvent: jest.fn(),
}));

describe('Publications', () => {
	const mockLogAnalyticsEvent = jest.requireMock('@configs/firebase').logAnalyticsEvent;

	beforeEach(() => {
		jest.clearAllMocks();

		render(<Publications />);
	});

	it('renders the Publications section and featured publications', () => {
		expect(screen.getByLabelText('Publications')).toBeInTheDocument();
		expect(screen.getByText('Featured Publications')).toBeInTheDocument();

		expect(screen.getAllByRole('article')).toHaveLength(publications.length);
	});

	it('logs analytics when a publication link is clicked', () => {
		fireEvent.click(screen.getByRole('link', { name: /view 20 years of the bio-analytic/i }));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('publication-10.1093/nar/gkae920', {
			name: 'publication-10.1093/nar/gkae920',
			type: 'click',
		});
	});

	it('links each DOI on its own, with a link icon, to the same DOI page as its card', () => {
		const doi = screen.getByRole('link', { name: '10.1093/nar/gkae920' });

		expect(doi).toHaveAttribute('href', 'https://doi.org/10.1093/nar/gkae920');
		expect(doi.querySelector('img')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /view 20 years of the bio-analytic/i })).toHaveAttribute(
			'href',
			'https://doi.org/10.1093/nar/gkae920',
		);
	});

	it('never nests one link inside another', () => {
		screen.getAllByRole('link').forEach((link) => {
			expect(link.parentElement?.closest('a')).toBeNull();
		});
	});

	it('logs analytics when a DOI link is clicked', () => {
		fireEvent.click(screen.getByRole('link', { name: '10.1093/nar/gkae920' }));

		expect(mockLogAnalyticsEvent).toHaveBeenCalledWith('publication-10.1093/nar/gkae920', {
			name: 'publication-10.1093/nar/gkae920',
			type: 'click',
		});
	});

	it('has accessible links for all publications', () => {
		const links = screen.getAllByRole('link', { name: /view .+ on .+/i });

		expect(links).toHaveLength(publications.length);
		links.forEach((link, index) => {
			expect(link).toHaveAttribute('href', `https://doi.org/${publications[index].doi}`);
		});
	});
});
