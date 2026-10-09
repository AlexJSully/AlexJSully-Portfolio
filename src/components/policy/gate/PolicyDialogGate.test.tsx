import { act, render, screen } from '@testing-library/react';
import { closePanel, openPanel } from '@util/panelState';
import PolicyDialogGate from './PolicyDialogGate';

describe('PolicyDialogGate', () => {
	afterEach(() => {
		act(() => {
			closePanel('privacy');
		});
	});

	it('renders nothing until the policy is opened, then loads and shows the dialog', async () => {
		render(<PolicyDialogGate />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		act(() => {
			openPanel('privacy');
		});

		expect(await screen.findByRole('dialog', { name: 'Privacy & cookie policy' })).toBeInTheDocument();
	});

	it('keeps the dialog mounted when the policy closes, so its close transition can play', async () => {
		render(<PolicyDialogGate />);
		act(() => {
			openPanel('privacy');
		});
		await screen.findByRole('dialog', { name: 'Privacy & cookie policy' });

		act(() => {
			closePanel('privacy');
		});

		expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
	});
});
