import { ACCEPT_ALL, CONSENT_COOKIE, ESSENTIAL_ONLY, readConsent, saveConsent, subscribeConsent } from './consentStore';

/**
 * Writes a raw consent cookie value, as a browser would hold it.
 * @param value Raw cookie value
 */
function setRawCookie(value: string): void {
	document.cookie = `${CONSENT_COOKIE}=${value}; path=/`;
}

/**
 * Sets a privacy signal on `navigator`, which jsdom does not define.
 * @param key The signal's property name
 * @param value Its value
 */
function setSignal(key: 'globalPrivacyControl' | 'doNotTrack', value: unknown): void {
	Object.defineProperty(navigator, key, { configurable: true, value });
}

describe('consentStore', () => {
	afterEach(() => {
		setSignal('globalPrivacyControl', undefined);
		setSignal('doNotTrack', null);
		Reflect.deleteProperty(globalThis, 'BroadcastChannel');
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	it('reports an undecided visitor as null', () => {
		expect(readConsent()).toBeNull();
	});

	it.each([
		{ label: 'Accept all', choices: ACCEPT_ALL },
		{ label: 'Essential only', choices: ESSENTIAL_ONLY },
		{ label: 'a custom choice', choices: { analytics: true, media: false, offline: true, linkIcons: false } },
	])('reads back $label after saving it', ({ choices }) => {
		saveConsent(choices);

		expect(readConsent()).toEqual(choices);
	});

	it('returns the same object while the cookie is unchanged, as useSyncExternalStore requires', () => {
		saveConsent(ACCEPT_ALL);

		expect(readConsent()).toBe(readConsent());
	});

	it.each([
		{ label: 'the legacy notice-dismissal value', raw: 'true' },
		{ label: 'an earlier consent version', raw: 'v1.a1.m1.o1.l1.t1700000000' },
		{ label: 'a malformed value', raw: 'v1.a1.m1' },
	])('asks again for $label', ({ raw }) => {
		setRawCookie(raw);

		expect(readConsent()).toBeNull();
	});

	it('stores the choice with a timestamp for the 6-month consent period', () => {
		jest.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') });
		const setter = jest.spyOn(Document.prototype, 'cookie', 'set');

		saveConsent(ESSENTIAL_ONLY);

		expect(setter).toHaveBeenCalledWith(
			'cookie-consent=v2.a0.m0.o0.l0.t1767225600; max-age=15552000; path=/; SameSite=Lax',
		);
	});

	describe.each([
		{ label: 'Global Privacy Control', key: 'globalPrivacyControl', value: true },
		{ label: 'Do Not Track', key: 'doNotTrack', value: '1' },
	] as const)('with $label sent', ({ key, value }) => {
		beforeEach(() => {
			setSignal(key, value);
		});

		it('leaves a visitor with no stored choice undecided, so the banner still asks', () => {
			expect(readConsent()).toBeNull();
		});

		it('keeps a stored choice rather than overriding it', () => {
			saveConsent(ACCEPT_ALL);

			expect(readConsent()).toEqual(ACCEPT_ALL);
		});
	});

	it('notifies subscribers on save until they unsubscribe', () => {
		const listener = jest.fn();
		const unsubscribe = subscribeConsent(listener);

		saveConsent(ACCEPT_ALL);
		unsubscribe();
		saveConsent(ESSENTIAL_ONLY);

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('tells subscribers when another tab changes the choice', () => {
		// BroadcastChannel is a browser API jsdom omits; this stand-in delivers messages between instances.
		const instances: { listener?: () => void }[] = [];
		class FakeChannel {
			listener?: () => void;
			constructor() {
				instances.push(this);
			}
			addEventListener(_type: string, listener: () => void) {
				this.listener = listener;
			}
			postMessage() {
				instances.filter((instance) => instance !== this).forEach((instance) => instance.listener?.());
			}
		}
		Object.defineProperty(globalThis, 'BroadcastChannel', { configurable: true, value: FakeChannel });

		// Two fresh copies of the store, each opening its own channel, stand in for two open tabs.
		let otherTab = {} as typeof import('./consentStore');
		let thisTab = {} as typeof import('./consentStore');
		jest.isolateModules(() => {
			otherTab = jest.requireActual('./consentStore');
		});
		jest.isolateModules(() => {
			thisTab = jest.requireActual('./consentStore');
		});
		const listener = jest.fn();
		otherTab.subscribeConsent(listener);
		thisTab.subscribeConsent(() => {});

		thisTab.saveConsent(ACCEPT_ALL);

		expect(listener).toHaveBeenCalled();
	});
});
