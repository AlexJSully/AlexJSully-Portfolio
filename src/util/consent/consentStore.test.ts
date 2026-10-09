import {
	ACCEPT_ALL,
	CONSENT_COOKIE,
	CONSENT_MAX_AGE_DAYS,
	ESSENTIAL_ONLY,
	readConsent,
	saveConsent,
	subscribeConsent,
} from './consentStore';

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
	});

	it('reports an undecided visitor as null', () => {
		expect(readConsent()).toBeNull();
	});

	it.each([
		['Accept all', ACCEPT_ALL],
		['Essential only', ESSENTIAL_ONLY],
		['a custom choice', { analytics: true, media: false, offline: true, linkIcons: false }],
	])('reads back %s after saving it', (_label, choices) => {
		saveConsent(choices);

		expect(readConsent()).toEqual(choices);
	});

	it('returns the same object while the cookie is unchanged, as useSyncExternalStore requires', () => {
		saveConsent(ACCEPT_ALL);

		expect(readConsent()).toBe(readConsent());
	});

	it.each([
		['the legacy notice-dismissal value', 'true'],
		['an earlier consent version', 'v1.a1.m1.o1.t1700000000'],
		['a malformed value', 'v1.a1.m1'],
	])('asks again for %s', (_label, raw) => {
		setRawCookie(raw);

		expect(readConsent()).toBeNull();
	});

	it('stores the choice with a timestamp for the 6-month consent period', () => {
		const setter = jest.spyOn(Document.prototype, 'cookie', 'set');

		saveConsent(ESSENTIAL_ONLY);

		expect(setter).toHaveBeenCalledWith(expect.stringMatching(/^cookie-consent=v2\.a0\.m0\.o0\.l0\.t\d+;/));
		expect(setter).toHaveBeenCalledWith(
			expect.stringContaining(`max-age=${CONSENT_MAX_AGE_DAYS * 24 * 60 * 60}; path=/; SameSite=Lax`),
		);
		setter.mockRestore();
	});

	it.each([
		['Global Privacy Control', 'globalPrivacyControl', true, 'gpc'],
		['Do Not Track', 'doNotTrack', '1', 'dnt'],
	] as const)('leaves a visitor sending %s undecided, so the banner still asks', (_label, key, value, marker) => {
		setSignal(key, value);
		// A changed raw value makes the store re-read the cookie.
		setRawCookie(marker);

		expect(readConsent()).toBeNull();
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

		Reflect.deleteProperty(globalThis, 'BroadcastChannel');
	});
});
