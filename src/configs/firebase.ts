import type { Analytics, logEvent } from 'firebase/analytics';

/** Firebase project credentials, read from `NEXT_PUBLIC_FIREBASE_*` environment variables. */
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_ID}.firebaseapp.com`,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_ID,
	storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_ID}.appspot.com`,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** The Analytics instance, set once {@link init} has loaded the SDK and started it. */
let analytics: Analytics | null = null;

/** The SDK's `logEvent`, held once {@link init} has loaded it. */
let sendEvent: typeof logEvent | null = null;

/** The first {@link init} call's work, shared by every later call. */
let starting: Promise<void> | null = null;

/**
 * Google Consent Mode state sent before Analytics starts: analytics storage granted, since {@link init} runs only after
 * the visitor accepts Analytics, and every advertising signal denied, since the site has no advertising purpose.
 */
const CONSENT_MODE = {
	analytics_storage: 'granted',
	ad_storage: 'denied',
	ad_user_data: 'denied',
	ad_personalization: 'denied',
} as const;

/**
 * Analytics tag settings that switch off Google signals (cross-device linking to Google accounts) and ad-personalization
 * signals from the page itself, whatever the property's admin settings say.
 */
const ANALYTICS_CONFIG = {
	allow_google_signals: false,
	allow_ad_personalization_signals: false,
} as const;

/**
 * Logs an analytics event to Firebase Analytics.
 *
 * Silently does nothing until {@link init} has run, so a call during server render is safe.
 * @param eventName - The name of the event to log
 * @param eventParams - Optional parameters for the event
 */
export function logAnalyticsEvent(eventName: string, eventParams?: object): void {
	if (analytics && sendEvent && eventName) {
		sendEvent(analytics, eventName, eventParams);
	}
}

/**
 * Loads the Firebase SDK and starts Analytics and Performance Monitoring, with {@link CONSENT_MODE} and
 * {@link ANALYTICS_CONFIG} applied.
 *
 * The SDK is fetched here rather than imported by the module, so a visitor who never allows Analytics never downloads
 * it. Called only once the visitor has accepted Analytics; see `src/components/consent/services/ConsentedServices.tsx`.
 * Safe to call more than once: later calls share the first call's work, and a failed load, such as one a content
 * blocker stops, is retried by the next call.
 * @returns A promise settling once Analytics is running, or once loading has failed
 */
export function init(): Promise<void> {
	starting ??= (async () => {
		const [{ getApp, getApps, initializeApp }, analyticsSdk, { getPerformance }] = await Promise.all([
			import('firebase/app'),
			import('firebase/analytics'),
			import('firebase/performance'),
		]);
		const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

		// Consent Mode must be set before Analytics initializes, or the first hits go out without it.
		analyticsSdk.setConsent(CONSENT_MODE);
		// With the same options every time, a second call returns the existing instance rather than throwing.
		analytics = analyticsSdk.initializeAnalytics(app, { config: ANALYTICS_CONFIG });
		sendEvent = analyticsSdk.logEvent;
		getPerformance(app);
	})().catch(() => {
		starting = null;
	});

	return starting;
}
