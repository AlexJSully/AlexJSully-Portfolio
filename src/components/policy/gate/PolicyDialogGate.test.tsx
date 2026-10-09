import { act, render, screen } from '@testing-library/react';
import { closePanel, openPanel } from '@util/panelState';
import PolicyDialogGate from './PolicyDialogGate';

describe('PolicyDialogGate', () => {
	afterEach(() => {
		act(() => {
			closePanel('privacy');
		});
	});

	it('renders nothing until the policy is opened', () => {
		render(<PolicyDialogGate />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('loads and shows the dialog when the policy is opened', async () => {
		render(<PolicyDialogGate />);

		act(() => {
			openPanel('privacy');
		});

		expect(await screen.findByRole('dialog', { name: 'Privacy & cookie policy' })).toBeInTheDocument();
	});
});
