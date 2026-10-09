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
		['Accept all', ACCEPT_ALL],
		['Essential only', ESSENTIAL_ONLY],
	])('saves "%s" and closes', (name, expected) => {
		render(<ConsentBanner />);

		fireEvent.click(screen.getByRole('button', { name }));

		expect(readConsent()).toEqual(expected);
		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
	});

	it('styles "Essential only" and "Accept all" identically, favouring neither', () => {
		render(<ConsentBanner />);

		expect(screen.getByRole('button', { name: 'Essential only' }).className).toBe(
			screen.getByRole('button', { name: 'Accept all' }).className,
		);
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

	it('reopens with the switches from the "Cookie settings" link without changing the URL', async () => {
		saveConsent(ESSENTIAL_ONLY);
		render(<ConsentBanner />);

		act(() => {
			openPanel('cookie-settings');
		});

		expect(await screen.findByRole('switch', { name: 'Analytics' })).toBeInTheDocument();
		expect(window.location.hash).toBe('');
	});

	it('hides while the policy dialog is open from a link, staying mounted but inert', () => {
		const { container } = render(<ConsentBanner />);

		act(() => {
			openPanel('privacy');
		});

		expect(screen.queryByRole('region', REGION)).not.toBeInTheDocument();
		expect(container.querySelector('section')).toHaveAttribute('inert');
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
