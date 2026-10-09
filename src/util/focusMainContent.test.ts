import { screen } from '@testing-library/react';
import { focusMainContent } from './focusMainContent';

describe('focusMainContent', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the main content, dropping its tabindex once focus moves on', () => {
		document.body.innerHTML = "<main id='main-content'></main><button type='button'>Next</button>";
		const main = document.getElementById('main-content') as HTMLElement;

		focusMainContent();

		expect(main).toHaveFocus();
		expect(main).toHaveAttribute('tabindex', '-1');

		screen.getByRole('button', { name: 'Next' }).focus();
		expect(main).not.toHaveAttribute('tabindex');
	});

	it('does nothing when the page has no main content', () => {
		document.body.innerHTML = "<button type='button'>Only</button>";

		expect(() => focusMainContent()).not.toThrow();
		expect(document.body).toHaveFocus();
	});
});
