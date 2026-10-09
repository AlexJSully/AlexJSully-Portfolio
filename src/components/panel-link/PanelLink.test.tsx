import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { closePanel, usePanelOpen } from '@util/panelState';
import PanelLink from './PanelLink';

describe('PanelLink', () => {
	afterEach(() => {
		act(() => {
			closePanel('privacy');
		});
	});

	it('links to the panel fragment on the home page, for use before hydration and in a new tab', () => {
		render(<PanelLink panel='privacy'>Policy</PanelLink>);

		expect(screen.getByRole('link', { name: 'Policy' })).toHaveAttribute('href', '/#privacy');
	});

	it('opens the panel on click without changing the URL', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));
		render(<PanelLink panel='privacy'>Policy</PanelLink>);

		fireEvent.click(screen.getByRole('link', { name: 'Policy' }));

		expect(result.current).toBe(true);
		expect(window.location.hash).toBe('');
	});

	it('carries no link icon, since it opens a panel rather than going anywhere', () => {
		render(<PanelLink panel='privacy'>Policy</PanelLink>);

		expect(screen.getByRole('link', { name: 'Policy' }).querySelector('img')).toBeNull();
	});

	it('announces that it opens a dialog when asked to', () => {
		render(
			<PanelLink aria-haspopup='dialog' panel='privacy'>
				Policy
			</PanelLink>,
		);

		expect(screen.getByRole('link', { name: 'Policy' })).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('leaves a modified click to the browser, so it can open a new tab', () => {
		const { result } = renderHook(() => usePanelOpen('privacy'));
		render(<PanelLink panel='privacy'>Policy</PanelLink>);

		fireEvent.click(screen.getByRole('link', { name: 'Policy' }), { metaKey: true });

		expect(result.current).toBe(false);
	});
});
