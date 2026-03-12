// Import the functions you need from the SDKs you need
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_ID}.firebaseapp.com`,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_ID,
	storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_ID}.appspot.com`,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;

/**
 * Logs an analytics event to Firebase Analytics.
 * @param eventName - The name of the event to log
 * @param eventParams - Optional parameters for the event
 */
export function logAnalyticsEvent(eventName: string, eventParams?: object): void {
	if (analytics && eventName) {
		logEvent(analytics, eventName, eventParams);
	}
}

/**
 * Initializes Firebase app, analytics, and performance monitoring.
 * Must be called once on the client side before logAnalyticsEvent will function.
 * Typically called in app initialization (e.g., in a page useEffect or client component).
 * Safe to call multiple times; only the first call will initialize the analytics instance.
 */
export function init(): void {
	// Only initialize if Firebase hasn't been initialized yet
	if (getApps().length === 0) {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);

		if (app) {
			// Initialize Analytics and get a reference to the service
			analytics = getAnalytics(app);

			// Initialize Performance Monitoring
			getPerformance(app);
		}
	} else if (!analytics) {
		// Firebase is initialized but analytics hasn't been set up yet
		const app = getApp();
		analytics = getAnalytics(app);
	}
}
