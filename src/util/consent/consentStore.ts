/** Optional purposes a visitor can consent to; essential processing needs no consent and has no flag. */
export interface ConsentChoices {
	/** Google Firebase Analytics and Performance Monitoring, and Vercel Speed Insights. */
	analytics: boolean;
	/** YouTube previews embedded in project cards. */
	media: boolean;
	/** The service worker that saves pages on the device for offline use. */
	offline: boolean;
	/** Each linked site's own icon beside a link, fetched through DuckDuckGo's icon proxy. */
	linkIcons: boolean;
}

/** Name of the first-party cookie recording the visitor's choices. */
export const CONSENT_COOKIE = 'cookie-consent';

/** How long a choice is kept before the banner asks again: 6 months, the re-consent interval the Irish DPC expects. */
export const CONSENT_MAX_AGE_DAYS = 180;

/** Version of the purposes and vendors a choice was made against; raising it asks every visitor again. */
export const CONSENT_VERSION = 2;

/**
 * The one-letter code of each purpose in the stored cookie, in the order they are written. Adding a purpose here adds
 * it to the cookie format, the parser, and both preset choices below.
 */
export const PURPOSE_CODES: Readonly<Record<keyof ConsentChoices, string>> = {
	analytics: 'a',
	media: 'm',
	offline: 'o',
	linkIcons: 'l',
};

/** The purposes, in cookie order. */
const PURPOSE_KEYS = Object.keys(PURPOSE_CODES) as (keyof ConsentChoices)[];

/**
 * Builds a choice with every purpose set to one value.
 * @param granted Whether every purpose is allowed
 * @returns The frozen choice
 */
function allPurposes(granted: boolean): Readonly<ConsentChoices> {
	return Object.freeze(Object.fromEntries(PURPOSE_KEYS.map((key) => [key, granted])) as unknown as ConsentChoices);
}

/** Choices with every optional purpose refused, as saved by "Essential only". */
export const ESSENTIAL_ONLY = allPurposes(false);

/** Choices with every optional purpose granted, as saved by "Accept all". */
export const ACCEPT_ALL = allPurposes(true);

/**
 * Serialised cookie value, such as `v2.a1.m0.o1.l0.t1791490457`: version, one flag per purpose, and the Unix time the
 * choice was made (GDPR Art 7(1) record).
 */
const COOKIE_PATTERN = new RegExp(
	`^v(\\d+)\\.${PURPOSE_KEYS.map((key) => `${PURPOSE_CODES[key]}([01])`).join('\\.')}\\.t(\\d+)$`,
);

/** Listeners notified when the stored choice changes, in this tab or another. */
const consentListeners = new Set<() => void>();

/** Channel to the site's other open tabs; created on first use, and `null` where `BroadcastChannel` is unavailable. */
let channel: BroadcastChannel | null | undefined;

/** Notifies every subscriber that the stored choice may have changed. */
function notifyListeners(): void {
	consentListeners.forEach((listener) => listener());
}

/**
 * Opens the channel that carries a change made in one tab to the others, so withdrawing consent in one tab stops
 * analytics in all of them. Created lazily in the browser, since a channel opened during server rendering would keep
 * the Node process alive.
 * @returns The channel, or `null` where unavailable
 */
function getChannel(): BroadcastChannel | null {
	if (channel === undefined) {
		channel =
			typeof window === 'undefined' || typeof BroadcastChannel === 'undefined'
				? null
				: new BroadcastChannel(CONSENT_COOKIE);
		channel?.addEventListener('message', notifyListeners);
	}
	return channel;
}

/** Raw cookie value the cached snapshot was parsed from; `undefined` until the first read. */
let cachedRaw: string | null | undefined;

/** Snapshot parsed from {@link cachedRaw}, returned again while the cookie is unchanged. */
let cachedChoices: Readonly<ConsentChoices> | null = null;

/**
 * Reads the raw consent cookie value.
 * @returns The value, or `null` when the cookie is absent
 */
function readCookie(): string | null {
	for (const pair of document.cookie.split(';')) {
		const [key, ...value] = pair.trim().split('=');
		if (key === CONSENT_COOKIE) {
			return value.join('=');
		}
	}

	return null;
}

/**
 * Parses a raw cookie value written by {@link saveConsent} for the current {@link CONSENT_VERSION}.
 * @param raw Raw cookie value
 * @returns The choices, or `null` for a missing, malformed, legacy, or outdated value
 */
function parseCookie(raw: string | null): Readonly<ConsentChoices> | null {
	const match = raw === null ? null : COOKIE_PATTERN.exec(raw);
	if (match === null || Number(match[1]) !== CONSENT_VERSION) {
		return null;
	}

	return Object.freeze(
		Object.fromEntries(
			PURPOSE_KEYS.map((key, index) => [key, match[index + 2] === '1']),
		) as unknown as ConsentChoices,
	);
}

/**
 * Reads the visitor's consent choices.
 *
 * The result is the same object for as long as the cookie is unchanged, which `useSyncExternalStore` requires. A Global
 * Privacy Control or Do Not Track signal is not a choice: it leaves the visitor undecided, so nothing optional runs and
 * the banner still asks.
 * @returns The choices, or `null` while the visitor has not decided
 */
export function readConsent(): Readonly<ConsentChoices> | null {
	if (typeof document === 'undefined') {
		return null;
	}

	const raw = readCookie();
	if (raw !== cachedRaw) {
		cachedRaw = raw;
		cachedChoices = parseCookie(raw);
	}

	return cachedChoices;
}

/**
 * Stores the visitor's choices for {@link CONSENT_MAX_AGE_DAYS} and notifies subscribers in this tab and in every
 * other open tab of the site.
 * @param choices Choices to store
 */
export function saveConsent(choices: Readonly<ConsentChoices>): void {
	const flags = PURPOSE_KEYS.map((key) => `${PURPOSE_CODES[key]}${Number(choices[key])}`).join('.');
	const timestamp = Math.floor(Date.now() / 1000);
	const secure = window.location.protocol === 'https:' ? '; Secure' : '';
	const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

	document.cookie = `${CONSENT_COOKIE}=v${CONSENT_VERSION}.${flags}.t${timestamp}; max-age=${maxAge}; path=/; SameSite=Lax${secure}`;
	notifyListeners();
	getChannel()?.postMessage('changed');
}

/**
 * Subscribes to changes of the stored choice, in the shape `useSyncExternalStore` expects.
 * @param listener Called after each change
 * @returns A function that removes the subscription
 */
export function subscribeConsent(listener: () => void): () => void {
	getChannel();
	consentListeners.add(listener);
	return () => {
		consentListeners.delete(listener);
	};
}
