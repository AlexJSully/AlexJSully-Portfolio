import { fireEvent, render, screen } from '@testing-library/react';
import { readConsent, saveConsent } from '@util/consent/consentStore';
import ConsentControls from './ConsentControls';

describe('ConsentControls', () => {
	it('shows essential processing as always on, with no switch to turn it off', () => {
		render(<ConsentControls />);

		expect(screen.getByText('Always on')).toBeInTheDocument();
		expect(screen.queryByRole('switch', { name: 'Essential' })).not.toBeInTheDocument();
	});

	it('starts every optional purpose off for an undecided visitor', () => {
		render(<ConsentControls />);

		['Analytics', 'Embedded videos', 'Offline access', 'Link icons'].forEach((name) => {
			expect(screen.getByRole('switch', { name })).not.toBeChecked();
		});
	});

	it('toggles a switch when its label text is clicked', () => {
		render(<ConsentControls />);

		fireEvent.click(screen.getByText('Analytics'));

		expect(screen.getByRole('switch', { name: 'Analytics' })).toBeChecked();
	});

	it('starts from the stored choice', () => {
		saveConsent({ analytics: false, media: true, offline: false, linkIcons: false });

		render(<ConsentControls />);

		expect(screen.getByRole('switch', { name: 'Embedded videos' })).toBeChecked();
		['Analytics', 'Offline access', 'Link icons'].forEach((name) => {
			expect(screen.getByRole('switch', { name })).not.toBeChecked();
		});
	});

	it('pushes extra actions to the end of the row', () => {
		render(<ConsentControls actions={<button type='button'>Close without changes</button>} />);

		const close = screen.getByRole('button', { name: 'Close without changes' });
		expect(close.parentElement).toHaveStyle({ marginInlineStart: 'auto' });
	});

	it('saves the switches, confirms it, and reports back', () => {
		const onSaved = jest.fn();
		render(<ConsentControls onSaved={onSaved} />);

		fireEvent.click(screen.getByRole('switch', { name: 'Analytics' }));
		fireEvent.click(screen.getByRole('button', { name: 'Save choices' }));

		expect(readConsent()).toEqual({ analytics: true, media: false, offline: false, linkIcons: false });
		expect(screen.getByRole('status')).toHaveTextContent('Choices saved.');
		expect(onSaved).toHaveBeenCalledTimes(1);
	});
});
