/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
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

export function logAnalyticsEvent(eventName: any, eventParams?: object) {
	if (analytics && eventName) {
		logEvent(analytics, eventName, eventParams);
	}
}

export function init() {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	if (app) {
		// Initialize Performance Monitoring and get a reference to the service
		analytics = getAnalytics(app);

		// Initialize Performance Monitoring and get a reference to the service
		const perf = getPerformance(app);
	}
}
