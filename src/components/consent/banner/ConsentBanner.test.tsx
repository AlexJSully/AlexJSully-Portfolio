import { colors } from '@styles/tokens';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ACCEPT_ALL, ESSENTIAL_ONLY, readConsent, saveConsent } from '@util/consent/consentStore';
import { closePanel, openPanel } from '@util/panelState';
import ConsentBanner from './ConsentBanner';

const REGION = { name: 'Your privacy choices' };

describe('ConsentBanner', () => {
	afterEach(() => {
		act(() => {
			closePanel('cookie-settings');
			closePanel('privacy');
		});
		window.history.replaceState(null, '', '/');
	});

	it('asks an undecided visitor, linking to the policy', () => {
		render(<ConsentBanner />);

		expect(screen.getByRole('region', REGION)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Privacy & cookie policy' })).toHaveAttribute('href', '/#privacy');
	});

	it.each([
		{ button: 'Accept all', saved: ACCEPT_ALL },
		{ button: 'Essential only', saved: ESSENTIAL_ONLY },
	])('saves "$button" and closes', ({ button, saved }) => {
		render(<ConsentBanner />);

		fireEvent.click(screen.getByRole('button', { name: button }));

		expect(readConsent()).toEqual(saved);
		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
	});

	it('styles "Essential only" and "Accept all" identically, favouring neither', () => {
		render(<ConsentBanner />);
		const essential = screen.getByRole('button', { name: 'Essential only' });
		const accept = screen.getByRole('button', { name: 'Accept all' });

		expect(essential).toHaveStyle({ backgroundColor: colors.accent, borderColor: colors.accent });
		['background-color', 'border-color', 'color'].forEach((property) => {
			expect(getComputedStyle(accept).getPropertyValue(property)).toBe(
				getComputedStyle(essential).getPropertyValue(property),
			);
		});
	});

	it('records nothing when Escape is pressed', () => {
		render(<ConsentBanner />);

		fireEvent.keyDown(screen.getByRole('region', REGION), { key: 'Escape' });

		expect(readConsent()).toBeNull();
		expect(screen.getByRole('region', REGION)).toBeInTheDocument();
	});

	it('shows a switch per purpose on Customize', async () => {
		render(<ConsentBanner />);

		fireEvent.click(screen.getByRole('button', { name: 'Customize' }));

		expect(await screen.findByRole('switch', { name: 'Analytics' })).toBeInTheDocument();
		['Embedded videos', 'Offline access', 'Link icons'].forEach((name) => {
			expect(screen.getByRole('switch', { name })).toBeInTheDocument();
		});
	});

	it('stays hidden once the visitor has chosen', () => {
		saveConsent(ESSENTIAL_ONLY);

		render(<ConsentBanner />);

		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
	});

	it('reopens with the switches while the fragment is #cookie-settings, and clears it on close', async () => {
		saveConsent(ESSENTIAL_ONLY);
		window.history.replaceState(null, '', '/#cookie-settings');
		render(<ConsentBanner />);

		expect(await screen.findByRole('switch', { name: 'Analytics' })).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Close without changes' }));
		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
		expect(window.location.hash).toBe('');
	});

	it('reopens with the switches from the "Cookie settings" link', async () => {
		saveConsent(ESSENTIAL_ONLY);
		render(<ConsentBanner />);

		act(() => {
			openPanel('cookie-settings');
		});

		expect(await screen.findByRole('switch', { name: 'Analytics' })).toBeInTheDocument();
	});

	it('hides while the policy dialog is open from a link, staying mounted but inert', () => {
		render(<ConsentBanner />);

		act(() => {
			openPanel('privacy');
		});

		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
		// A hidden element has no computed accessible name, so the name is read from its attribute.
		const region = screen.getByRole('region', { hidden: true });
		expect(region).toHaveAttribute('aria-label', REGION.name);
		expect(region).toHaveAttribute('inert');
	});

	it('announces a saved choice in a status region that outlives the banner', () => {
		render(<ConsentBanner />);

		fireEvent.click(screen.getByRole('button', { name: 'Essential only' }));

		expect(screen.getByRole('status')).toHaveTextContent('Choices saved.');
	});

	it('closes reopened settings on Escape without changing the choice, returning focus to the opener', async () => {
		saveConsent(ESSENTIAL_ONLY);
		render(
			<>
				<button type='button'>Cookie settings</button>
				<ConsentBanner />
			</>,
		);
		const opener = screen.getByRole('button', { name: 'Cookie settings' });
		opener.focus();

		act(() => {
			openPanel('cookie-settings');
		});
		const region = screen.getByRole('region', REGION);
		await screen.findByRole('switch', { name: 'Analytics' });
		expect(region).toHaveFocus();

		fireEvent.keyDown(region, { key: 'Escape' });

		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
		expect(readConsent()).toEqual(ESSENTIAL_ONLY);
		expect(opener).toHaveFocus();
	});

	it('moves focus to the main content when reopened settings close and the page body held focus', async () => {
		saveConsent(ESSENTIAL_ONLY);
		render(
			<>
				<ConsentBanner />
				<main id='main-content' />
			</>,
		);

		act(() => {
			openPanel('cookie-settings');
		});
		fireEvent.click(await screen.findByRole('button', { name: 'Close without changes' }));

		expect(screen.getByRole('main')).toHaveFocus();
	});

	it('moves focus to the main content after a choice when nothing earlier held it', () => {
		render(
			<>
				<ConsentBanner />
				<main id='main-content' />
			</>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Accept all' }));

		const main = screen.getByRole('main');
		expect(main).toHaveFocus();

		// Focusable only while it holds focus, so it drops the tabindex once focus moves on.
		main.blur();
		expect(main).not.toHaveAttribute('tabindex');
	});

	it('hides while the policy dialog is open', () => {
		window.history.replaceState(null, '', '/#privacy');

		render(<ConsentBanner />);

		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
	});
});
