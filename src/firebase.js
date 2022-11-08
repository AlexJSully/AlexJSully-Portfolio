/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: `${process.env.REACT_APP_FIREBASE_ID}.firebaseapp.com`,
	projectId: process.env.REACT_APP_FIREBASE_ID,
	storageBucket: `${process.env.REACT_APP_FIREBASE_ID}.appspot.com`,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Performance Monitoring and get a reference to the service
const perf = getPerformance(app);
