import { render, screen } from '@testing-library/react';
import React from 'react';
import ProjectsGrid from './ProjectsGrid';

describe('ProjectsGrid', () => {
	it('renders the ProjectsGrid title', () => {
		render(<ProjectsGrid />);
		const title = screen.getByRole('heading', { name: /Projects/i });
		expect(title).toBeInTheDocument();
	});
});
