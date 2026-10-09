import policy from '@data/policy';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { closePanel, openPanel } from '@util/panelState';
import PolicyDialog from './PolicyDialog';

describe('PolicyDialog', () => {
	afterEach(() => {
		act(() => {
			closePanel('privacy');
		});
		window.history.replaceState(null, '', '/');
	});

	it('opens from a link without changing the URL, and closes again', async () => {
		render(<PolicyDialog />);

		act(() => {
			openPanel('privacy');
		});

		expect(await screen.findByRole('dialog', { name: policy.title })).toBeInTheDocument();
		expect(window.location.hash).toBe('');

		fireEvent.click(screen.getByRole('button', { name: 'Close privacy and cookie policy' }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('stays closed when the URL has no #privacy fragment', () => {
		render(<PolicyDialog />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('opens on load when the fragment is #privacy, showing when it was last updated', async () => {
		window.history.replaceState(null, '', '/#privacy');

		render(<PolicyDialog />);

		expect(await screen.findByRole('dialog', { name: policy.title })).toBeInTheDocument();
		expect(screen.getByText('October 9, 2026')).toHaveAttribute('datetime', policy.lastUpdated);
	});

	it('opens when a link changes the fragment to #privacy', async () => {
		render(<PolicyDialog />);

		act(() => {
			window.history.replaceState(null, '', '/#privacy');
			window.dispatchEvent(new HashChangeEvent('hashchange'));
		});

		expect(await screen.findByRole('dialog', { name: policy.title })).toBeInTheDocument();
	});

	it('closes and clears the fragment when the close button is clicked', async () => {
		window.history.replaceState(null, '', '/#privacy');
		render(<PolicyDialog />);

		fireEvent.click(await screen.findByRole('button', { name: 'Close privacy and cookie policy' }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
		expect(window.location.hash).toBe('');
	});
});
